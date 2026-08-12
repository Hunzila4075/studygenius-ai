import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  MessageSquare,
  FileText,
  HelpCircle,
  Layers,
  Calendar,
  BarChart3,
  Users,
  ArrowRight,
  Star,
  CheckCircle2,
  Sparkles,
  Play,
  Brain,
  Target,
  Zap,
  Shield,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [countVisible, setCountVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCountVisible(true); },
      { threshold: 0.4 }
    );
    const el = document.getElementById('stats-section');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Tutor',
      desc: 'Get expert explanations on any topic instantly. Ask questions, get step-by-step breakdowns, and learn with a personal AI mentor.',
      color: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50 dark:bg-violet-950/30',
    },
    {
      icon: FileText,
      title: 'PDF Summarizer',
      desc: 'Upload any study material and get a comprehensive summary, key terms, review questions, and short notes within seconds.',
      color: 'from-blue-500 to-cyan-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      icon: BookOpen,
      title: 'Smart Notes',
      desc: 'Create, organize, search, and tag your study notes. Mark favorites and filter by subject for efficient revision.',
      color: 'from-emerald-500 to-green-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      icon: HelpCircle,
      title: 'Quiz Generator',
      desc: 'Generate customized MCQ quizzes on any topic with adjustable difficulty. Track your scores and review explanations.',
      color: 'from-orange-500 to-amber-600',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
    },
    {
      icon: Calendar,
      title: 'Study Planner',
      desc: 'Schedule study sessions with priorities and durations. Track today\'s tasks, upcoming sessions, and completion status.',
      color: 'from-pink-500 to-rose-600',
      bg: 'bg-pink-50 dark:bg-pink-950/30',
    },
    {
      icon: BarChart3,
      title: 'Progress Analytics',
      desc: 'Visualize weekly study hours, quiz performance trends, and subject-wise distribution with interactive charts.',
      color: 'from-indigo-500 to-blue-600',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    },
    {
      icon: Layers,
      title: 'AI Flashcards',
      desc: 'Generate and study 3D flip flashcards automatically. Mark cards as learned or for review and shuffle them.',
      color: 'from-teal-500 to-cyan-600',
      bg: 'bg-teal-50 dark:bg-teal-950/30',
    },
    {
      icon: Target,
      title: 'Subject Tracker',
      desc: 'Manage all your university subjects in one place. Monitor study hours, quiz averages, and progress per subject.',
      color: 'from-red-500 to-rose-600',
      bg: 'bg-red-50 dark:bg-red-950/30',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Create Your Account',
      desc: 'Sign up free and set up your student profile with your university, degree, and subjects.',
      icon: Users,
      color: 'from-brand-500 to-indigo-600',
    },
    {
      step: '02',
      title: 'Upload or Enter Material',
      desc: 'Upload PDF study materials or type your topic directly into the AI Tutor or Quiz Generator.',
      icon: FileText,
      color: 'from-violet-500 to-purple-600',
    },
    {
      step: '03',
      title: 'Let AI Analyze It',
      desc: 'Our Gemini AI engine processes your material and generates summaries, notes, quizzes, and flashcards.',
      icon: Brain,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      step: '04',
      title: 'Learn & Track Progress',
      desc: 'Study smarter, complete quizzes, build streaks and track your improvement with detailed analytics.',
      icon: TrendingUp,
      color: 'from-orange-500 to-amber-600',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      desc: 'Perfect for getting started',
      features: ['5 AI Tutor conversations/day', 'Upload up to 3 PDFs/month', '10 Quiz questions/day', 'Basic Notes & Flashcards', 'Study Planner'],
      cta: 'Get Started Free',
      highlighted: false,
    },
    {
      name: 'Student Pro',
      price: '$7',
      period: '/month',
      desc: 'Best for active learners',
      features: ['Unlimited AI Tutor access', 'Unlimited PDF uploads', 'Unlimited quiz generation', 'Advanced analytics & charts', 'All subjects & flashcards', 'Priority AI processing'],
      cta: 'Start Pro Trial',
      highlighted: true,
    },
    {
      name: 'Team',
      price: '$12',
      period: '/month',
      desc: 'Perfect for study groups',
      features: ['Everything in Pro', 'Study group collaboration', 'Shared notes & quizzes', 'Group analytics dashboard', 'Custom study plans', 'Priority support'],
      cta: 'Contact Us',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section
        id="home"
        className="relative overflow-hidden pt-20 pb-28 px-4 sm:px-6"
      >
        {/* Ambient Background Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-[480px] h-[480px] bg-gradient-to-br from-brand-400/30 to-indigo-500/20 rounded-full blur-3xl dark:opacity-40" />
          <div className="absolute -bottom-24 -right-24 w-[480px] h-[480px] bg-gradient-to-tl from-violet-400/25 to-cyan-500/20 rounded-full blur-3xl dark:opacity-30" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Copy */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 rounded-full text-sm font-semibold border border-brand-200 dark:border-brand-800">
                <Sparkles className="w-4 h-4" />
                Powered by Google Gemini AI
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white mb-6">
                Study{' '}
                <span className="bg-gradient-to-r from-brand-500 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                  Smarter.
                </span>
                <br />
                Learn{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  Faster.
                </span>
                <br />
                Achieve More.
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-8 leading-relaxed">
                Your intelligent AI-powered study companion for notes, quizzes, PDF summaries, planning, and personalized learning — all in one platform.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="group flex items-center gap-2.5 px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-2xl shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Start Learning Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="flex items-center gap-2.5 px-7 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 hover:-translate-y-0.5 transition-all duration-200 shadow-md"
                >
                  <Play className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  Explore Features
                </a>
              </div>

              {/* Social Proof Chips */}
              <div className="mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                {['No credit card required', 'Free to start', 'AI-powered'].map((chip) => (
                  <div key={chip} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {chip}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Illustration — Abstract Animated UI Card */}
            <div className="flex-1 flex justify-center lg:justify-end animate-float">
              <div className="w-full max-w-sm">
                {/* Glowing Dashboard Preview Card */}
                <div className="relative rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl shadow-slate-900/20 p-5 space-y-4">
                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Good morning,</p>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Student! 🎓</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Study Hours', value: '4.5h', color: 'text-brand-600 dark:text-brand-400' },
                      { label: 'Quiz Score', value: '92%', color: 'text-emerald-600 dark:text-emerald-400' },
                      { label: 'Day Streak', value: '🔥 7', color: 'text-orange-600 dark:text-orange-400' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-2.5 text-center">
                        <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* AI Tutor Chat Preview */}
                  <div className="bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-950/30 dark:to-indigo-950/30 rounded-2xl p-3 border border-brand-100 dark:border-brand-900">
                    <div className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        AI
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                        Binary search works by dividing the array in half repeatedly... Here's a step-by-step explanation 📚
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">Today's Goal</span>
                      <span className="text-brand-600 dark:text-brand-400 font-semibold">72%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-600"
                        style={{ width: '72%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section id="stats-section" className="py-12 bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50K+', label: 'Active Students', icon: Users },
              { value: '99.9%', label: 'Uptime', icon: Shield },
              { value: '500K+', label: 'Quizzes Generated', icon: HelpCircle },
              { value: '4.9★', label: 'Average Rating', icon: Star },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-1">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 rounded-full text-sm font-semibold border border-brand-100 dark:border-brand-900">
              <Zap className="w-3.5 h-3.5" /> Powerful Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              From AI explanations to analytics dashboards — StudyGenius AI equips you with every tool for academic success.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`group relative rounded-2xl p-6 border border-slate-100 dark:border-slate-800 ${feature.bg} hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-slate-900/60 transition-all duration-300 cursor-default`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold border border-indigo-100 dark:border-indigo-900">
              <Clock className="w-3.5 h-3.5" /> Simple & Fast Setup
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Get started in minutes and see results from day one.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden lg:block absolute top-[52px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-brand-300 to-orange-300 dark:from-brand-700 dark:to-orange-700 z-0" />

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative z-10 flex flex-col items-center text-center group"
                >
                  <div
                    className={`w-[104px] h-[104px] rounded-3xl bg-gradient-to-br ${step.color} text-white flex flex-col items-center justify-center mb-5 shadow-xl shadow-brand-500/15 group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300`}
                  >
                    <Icon className="w-8 h-8 mb-1.5" />
                    <span className="text-xs font-bold opacity-80">STEP {i + 1}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-semibold border border-emerald-100 dark:border-emerald-900">
              <Star className="w-3.5 h-3.5" /> Transparent Pricing
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Affordable for Every Student
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Start free forever. Upgrade when you need more power.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 border transition-all duration-200 hover:-translate-y-1 ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-brand-600 to-indigo-700 text-white border-brand-500 shadow-2xl shadow-brand-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:shadow-xl'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-xs font-bold rounded-full shadow">
                    MOST POPULAR
                  </div>
                )}
                <h3 className={`text-lg font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? 'text-brand-200' : 'text-slate-500 dark:text-slate-400'}`}>
                  {plan.desc}
                </p>
                <div className="flex items-end gap-1 mb-6">
                  <span className={`text-4xl font-extrabold ${plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm pb-1 ${plan.highlighted ? 'text-brand-200' : 'text-slate-500 dark:text-slate-400'}`}>
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5">
                      <CheckCircle2
                        className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-emerald-300' : 'text-emerald-500'}`}
                      />
                      <span className={`text-sm ${plan.highlighted ? 'text-brand-100' : 'text-slate-600 dark:text-slate-300'}`}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-white text-brand-700 hover:bg-brand-50'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT / CTA SECTION ===== */}
      <section id="about" className="py-24 px-4 sm:px-6 bg-gradient-to-br from-brand-600 via-indigo-700 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Ready to Transform Your Studies?
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Join thousands of university students already learning smarter with StudyGenius AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link
              to="/register"
              className="flex items-center gap-2.5 px-8 py-4 text-base font-bold text-brand-700 bg-white hover:bg-brand-50 rounded-2xl shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <Sparkles className="w-5 h-5" />
              Get Started — It's Free
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-white border-2 border-white/40 hover:border-white hover:bg-white/10 rounded-2xl transition-all duration-200"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
};

export default LandingPage;
