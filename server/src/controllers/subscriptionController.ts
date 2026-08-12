import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

export const PLAN_LIMITS = {
  Free: {
    maxQuizzes: 5,
    maxFlashcards: 20,
    maxNotes: 15,
    aiDailyLimit: 20,
    pdfLimitMb: 5,
  },
  Pro: {
    maxQuizzes: 50,
    maxFlashcards: 200,
    maxNotes: 150,
    aiDailyLimit: 200,
    pdfLimitMb: 25,
  },
  Premium: {
    maxQuizzes: 9999,
    maxFlashcards: 9999,
    maxNotes: 9999,
    aiDailyLimit: 9999,
    pdfLimitMb: 100,
  },
};

// Get current user subscription
export const getSubscriptionStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId).select('subscription email name');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const plan = user.subscription?.plan || 'Free';
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.Free;

    res.json({
      success: true,
      subscription: {
        plan,
        status: user.subscription?.status || 'active',
        currentPeriodEnd: user.subscription?.currentPeriodEnd,
        cancelAtPeriodEnd: user.subscription?.cancelAtPeriodEnd || false,
        limits,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve subscription status.' });
  }
};

// Initiate subscription upgrade or checkout (Stripe architecture ready)
export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { plan } = req.body; // 'Pro' or 'Premium'
    const userId = req.user?.userId;

    if (!['Pro', 'Premium'].includes(plan)) {
      res.status(400).json({ success: false, message: 'Invalid plan selected.' });
      return;
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const isStripeActive = stripeSecretKey && !stripeSecretKey.includes('your_') && stripeSecretKey.length > 10;

    if (isStripeActive) {
      // In live production with Stripe keys configured:
      // Construct Stripe checkout session
      const stripe = require('stripe')(stripeSecretKey);
      const priceId = plan === 'Pro' ? process.env.STRIPE_PRO_PRICE_ID : process.env.STRIPE_PREMIUM_PRICE_ID;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/app/subscription?success=true`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/pricing?canceled=true`,
        client_reference_id: userId,
      });

      res.json({ success: true, url: session.url, mode: 'stripe' });
      return;
    }

    // Direct subscription update architecture when testing or when webhook key is pending
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const oneMonth = new Date();
    oneMonth.setMonth(oneMonth.getMonth() + 1);

    user.subscription = {
      plan: plan as 'Pro' | 'Premium',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: oneMonth,
      cancelAtPeriodEnd: false,
    };

    await user.save();

    res.json({
      success: true,
      message: `Successfully upgraded to ${plan} Plan!`,
      mode: 'direct',
      subscription: user.subscription,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process subscription checkout.' });
  }
};

// Cancel subscription
export const cancelSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (user.subscription) {
      user.subscription.cancelAtPeriodEnd = true;
      await user.save();
    }

    res.json({ success: true, message: 'Subscription will cancel at the end of the billing period.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel subscription.' });
  }
};

// Stripe Webhook handler architecture
export const handleStripeWebhook = async (req: any, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    res.status(400).json({ success: false, message: 'Webhook secret not configured.' });
    return;
  }

  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id;
      if (userId) {
        await User.findByIdAndUpdate(userId, {
          'subscription.plan': 'Pro',
          'subscription.status': 'active',
          'subscription.stripeCustomerId': session.customer,
          'subscription.stripeSubscriptionId': session.subscription,
        });
      }
    }

    res.json({ received: true });
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
