import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Sun, Moon, Monitor, Sparkles, Plus, Bell, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [aiStatus, setAiStatus] = useState<{ mode: string; message: string }>({
    mode: 'demo',
    message: 'Demo Mode (Mock AI)',
  });
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/ai/status')
      .then((res) => {
        if (res.data.success) {
          setAiStatus({ mode: res.data.mode, message: res.data.message });
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/notes?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* Mobile Menu Button */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, subjects, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition"
          />
        </form>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-3">
        {/* AI Status Badge */}
        <div
          className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            aiStatus.mode === 'live'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
          }`}
          title={aiStatus.message}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{aiStatus.mode === 'live' ? 'Gemini AI Active' : 'AI Demo Mode'}</span>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => navigate('/app/tutor')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-md shadow-brand-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI Tutor</span>
        </button>

        {/* Theme Picker Dropdown */}
        <div className="relative">
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Theme Options"
          >
            {theme === 'light' ? <Sun className="w-5 h-5 text-amber-500" /> : theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Monitor className="w-5 h-5" />}
          </button>

          {themeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 glass-panel rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-sm">
              <button
                onClick={() => { setTheme('light'); setThemeDropdownOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                <Sun className="w-4 h-4 text-amber-500" /> Light
              </button>
              <button
                onClick={() => { setTheme('dark'); setThemeDropdownOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                <Moon className="w-4 h-4 text-indigo-400" /> Dark
              </button>
              <button
                onClick={() => { setTheme('system'); setThemeDropdownOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                <Monitor className="w-4 h-4 text-slate-400" /> System
              </button>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-semibold flex items-center justify-center text-xs shadow">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <span className="hidden md:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
              {user?.name || 'Student'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 glass-panel rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 text-sm">
              <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { setProfileDropdownOpen(false); navigate('/app/profile'); }}
                className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                My Profile
              </button>
              <button
                onClick={() => { setProfileDropdownOpen(false); navigate('/app/settings'); }}
                className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                Settings
              </button>
              <button
                onClick={() => { setProfileDropdownOpen(false); logout(); navigate('/'); }}
                className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
