import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  BookOpen,
  HelpCircle,
  Layers,
  Calendar,
  FolderKanban,
  BarChart3,
  User,
  Settings,
  LogOut,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
    { label: 'AI Tutor', icon: MessageSquare, path: '/app/tutor' },
    { label: 'Summarizer', icon: FileText, path: '/app/summarizer' },
    { label: 'Smart Notes', icon: BookOpen, path: '/app/notes' },
    { label: 'Quizzes', icon: HelpCircle, path: '/app/quizzes' },
    { label: 'Flashcards', icon: Layers, path: '/app/flashcards' },
    { label: 'Study Planner', icon: Calendar, path: '/app/planner' },
    { label: 'Subjects', icon: FolderKanban, path: '/app/subjects' },
    { label: 'Progress', icon: BarChart3, path: '/app/progress' },
    { label: 'Profile', icon: User, path: '/app/profile' },
    { label: 'Settings', icon: Settings, path: '/app/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 glass-panel border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/80 dark:border-slate-800/80">
            <NavLink to="/app/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                StudyGenius <span className="text-brand-600 dark:text-brand-400">AI</span>
              </span>
            </NavLink>
            {onCloseMobile && (
              <button onClick={onCloseMobile} className="md:hidden text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Nav Items */}
          <div className="py-4 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Footer / User Profile & Logout */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 text-white font-semibold flex items-center justify-center text-sm shadow">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {user?.name || 'Student'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.university || 'University'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
