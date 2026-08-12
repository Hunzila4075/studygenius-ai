import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, Sun, Moon, Monitor, ArrowRight, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-brand-700 to-indigo-600 dark:from-white dark:via-brand-300 dark:to-indigo-400 bg-clip-text text-transparent">
              StudyGenius <span className="text-brand-600 dark:text-brand-400">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Home</Link>
            <a href="/#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Features</a>
            <a href="/#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">How It Works</a>
            <Link to="/pricing" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Pricing</Link>
            <a href="/#about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">About</a>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Dropdown Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg text-xs font-medium transition ${theme === 'light' ? 'bg-white dark:bg-slate-700 shadow text-brand-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                title="Light Mode"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg text-xs font-medium transition ${theme === 'dark' ? 'bg-white dark:bg-slate-700 shadow text-brand-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                title="Dark Mode"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded-lg text-xs font-medium transition ${theme === 'system' ? 'bg-white dark:bg-slate-700 shadow text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                title="System Mode"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/app/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-md shadow-brand-500/20 hover:shadow-brand-500/35 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-md shadow-brand-500/20 hover:shadow-brand-500/35 transition-all"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-600 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600"
          >
            Home
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600"
          >
            Pricing
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600"
          >
            About
          </a>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/app/dashboard');
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-brand-600 rounded-xl"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-brand-600 rounded-xl"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
