import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Shield, Zap, Crown, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const PricingPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>('Free');

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await api.get('/subscription/status');
      if (res.data.success && res.data.subscription) {
        setCurrentPlan(res.data.subscription.plan);
      }
    } catch (_) { }
  };

  const handleSubscribe = async (plan: 'Pro' | 'Premium') => {
    setLoadingPlan(plan);
    try {
      const res = await api.post('/subscription/checkout', { plan });
      if (res.data.success) {
        if (res.data.url) {
          window.location.href = res.data.url;
        } else {
          setCurrentPlan(plan);
          if (user) updateUser({ subscription: res.data.subscription });
          showToast(`Successfully upgraded to ${plan} Plan! 🚀`, 'success');
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to process subscription', 'error');
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      name: 'Free',
      tagline: 'Essential study tools for getting started',
      price: '$0',
      period: 'forever',
      badge: 'Current Plan',
      features: [
        '20 AI Tutor queries / day',
        '5 MCQ Quizzes / month',
        '20 Interactive Flashcards',
        '15 Smart Study Notes',
        '5 MB PDF Summarizer limit',
        'Basic Study Planner & Analytics',
      ],
      isPopular: false,
      ctaText: 'Your Active Plan',
      action: null,
    },
    {
      name: 'Pro',
      tagline: 'Ideal for dedicated university students',
      price: '$12',
      period: 'per month',
      badge: 'Most Popular',
      features: [
        '200 AI Tutor queries / day',
        '50 MCQ Quizzes / month',
        '200 Interactive Flashcards',
        '150 Smart Study Notes',
        '25 MB PDF Summarizer limit',
        'Advanced Analytics & Weekly Trends',
        'Priority AI response generation',
      ],
      isPopular: true,
      ctaText: currentPlan === 'Pro' ? 'Current Plan' : 'Upgrade to Pro',
      action: () => handleSubscribe('Pro'),
    },
    {
      name: 'Premium',
      tagline: 'Unlimited power for high achievers',
      price: '$29',
      period: 'per month',
      badge: 'Best Value',
      features: [
        'Unlimited AI Tutor queries',
        'Unlimited MCQ Quizzes',
        'Unlimited Interactive Flashcards',
        'Unlimited Smart Study Notes',
        '100 MB PDF Summarizer limit',
        'Full Analytics & Export Options',
        'Instant AI processing & 24/7 Support',
      ],
      isPopular: false,
      ctaText: currentPlan === 'Premium' ? 'Current Plan' : 'Upgrade to Premium',
      action: () => handleSubscribe('Premium'),
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-4 h-4" /> Transparent Pricing
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Invest in Your Academic Success
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Choose the plan that fits your study goals. Upgrade or downgrade anytime with instant feature access.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.name;
          return (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between p-8 rounded-3xl transition-all duration-300 ${plan.isPopular
                  ? 'bg-gradient-to-b from-brand-900 to-indigo-950 text-white shadow-2xl shadow-brand-500/20 border-2 border-brand-500 scale-105 z-10'
                  : 'glass-panel border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-brand-300 dark:hover:border-brand-700 shadow-xl'
                }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  {plan.name === 'Premium' && <Crown className="w-6 h-6 text-amber-400" />}
                  {plan.name === 'Pro' && <Zap className="w-6 h-6 text-brand-400" />}
                  {plan.name === 'Free' && <Shield className="w-6 h-6 text-slate-400" />}
                </div>
                <p className={`mt-2 text-sm ${plan.isPopular ? 'text-brand-200' : 'text-slate-500 dark:text-slate-400'}`}>
                  {plan.tagline}
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className={`text-sm ${plan.isPopular ? 'text-brand-200' : 'text-slate-500 dark:text-slate-400'}`}>
                    /{plan.period}
                  </span>
                </div>

                {/* Feature List */}
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <div
                        className={`p-1 rounded-full shrink-0 ${plan.isPopular ? 'bg-brand-500/30 text-brand-300' : 'bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                          }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className={plan.isPopular ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-10">
                <button
                  disabled={isCurrent || loadingPlan === plan.name}
                  onClick={plan.action || undefined}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isCurrent
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-default'
                      : plan.isPopular
                        ? 'bg-white text-brand-950 hover:bg-brand-50 shadow-lg shadow-white/10'
                        : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                    }`}
                >
                  {loadingPlan === plan.name ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{isCurrent ? 'Current Plan' : `Get ${plan.name}`}</span>
                      {!isCurrent && <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Banner */}
      <div className="mt-16 text-center max-w-2xl mx-auto p-6 glass-panel rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-semibold mb-1">
          <Shield className="w-4 h-4 text-emerald-500" /> Secure Payment Integration Architecture
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Transactions are secured via Stripe SSL encryption. No credit card details are ever stored on our servers.
        </p>
      </div>
    </div>
  );
};
