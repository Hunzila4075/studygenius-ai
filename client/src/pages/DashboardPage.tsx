import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  Target,
  Flame,
  BookOpen,
  HelpCircle,
  MessageSquare,
  BarChart3,
  ArrowRight,
  Plus,
  Calendar,
  Layers,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StudyTask } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, analyticsRes] = await Promise.all([
          api.get(`/tasks?date=${today}`),
          api.get('/analytics'),
        ]);
        if (tasksRes.data.success) setTasks(tasksRes.data.tasks);
        if (analyticsRes.data.success) setAnalytics(analyticsRes.data);
      } catch (_) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const metrics = analytics?.metrics || {};
  const completedTodayCount = tasks.filter((t) => t.completed).length;
  const totalTodayCount = tasks.length;

  const statCards = [
    {
      label: 'Study Hours Today',
      value: `${metrics.totalStudyHoursThisWeek || '0'}h`,
      sub: 'This week',
      icon: Clock,
      color: 'from-brand-500 to-indigo-600',
      bg: 'bg-brand-50 dark:bg-brand-950/30',
      iconBg: 'bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-300',
    },
    {
      label: 'Tasks Completed',
      value: `${completedTodayCount}/${totalTodayCount}`,
      sub: "Today's tasks",
      icon: CheckCircle2,
      color: 'from-emerald-500 to-green-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300',
    },
    {
      label: 'Average Quiz Score',
      value: `${metrics.avgQuizScore || 85}%`,
      sub: 'Across all quizzes',
      icon: Target,
      color: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50 dark:bg-violet-950/30',
      iconBg: 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300',
    },
    {
      label: 'Current Streak',
      value: `🔥 ${metrics.currentStreak || 7} days`,
      sub: 'Keep it up!',
      icon: Flame,
      color: 'from-orange-500 to-amber-600',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      iconBg: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300',
    },
  ];

  const quickActions = [
    { label: 'Ask AI Tutor', desc: 'Get instant explanations', icon: MessageSquare, path: '/app/tutor', color: 'from-violet-500 to-purple-600' },
    { label: 'Generate Quiz', desc: 'Test your knowledge', icon: HelpCircle, path: '/app/quizzes', color: 'from-orange-500 to-amber-600' },
    { label: 'Summarize PDF', desc: 'Upload study material', icon: FileText, path: '/app/summarizer', color: 'from-blue-500 to-cyan-600' },
    { label: 'Add Flashcards', desc: 'Generate AI flashcards', icon: Layers, path: '/app/flashcards', color: 'from-teal-500 to-cyan-600' },
  ];

  const toggleTask = async (taskId: string) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, completed: !t.completed } : t))
      );
    } catch (_) {}
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-600 via-indigo-700 to-violet-700 p-6 sm:p-8 text-white shadow-xl shadow-brand-500/20">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-brand-200 text-sm font-medium">{getGreeting()},</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-0.5">{user?.name || 'Student'} 🎓</h1>
            <p className="text-brand-100 text-sm mt-1.5">
              {user?.university || 'National University'} · {user?.degree || 'Computer Science'} · {user?.semester || 'Semester 4'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/app/planner')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-sm font-semibold border border-white/30 transition"
            >
              <Calendar className="w-4 h-4" />
              Plan Today
            </button>
            <button
              onClick={() => navigate('/app/progress')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-sm font-semibold border border-white/30 transition"
            >
              <TrendingUp className="w-4 h-4" />
              Analytics
            </button>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="relative z-10 mt-6">
          <div className="flex justify-between text-xs text-brand-200 mb-1.5">
            <span>Weekly Study Goal</span>
            <span>{metrics.totalStudyHoursThisWeek || '18.5'}h / {metrics.weeklyGoalHours || 25}h</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
              style={{
                width: `${Math.min(
                  100,
                  Math.round(((parseFloat(metrics.totalStudyHoursThisWeek) || 18.5) / (metrics.weeklyGoalHours || 25)) * 100)
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`${card.bg} rounded-2xl p-4 border border-slate-100 dark:border-slate-800 hover:scale-[1.01] hover:shadow-md transition-all duration-200`}
            >
              <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{card.value}</div>
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{card.label}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{card.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-brand-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-start gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-950/20 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${action.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{action.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{action.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-600" />
              Today's Tasks
            </h2>
            <button
              onClick={() => navigate('/app/planner')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-slate-100 dark:bg-slate-700/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No tasks scheduled for today.</p>
              <button
                onClick={() => navigate('/app/planner')}
                className="mt-3 px-4 py-2 text-xs font-semibold text-brand-600 dark:text-brand-400 border border-brand-300 dark:border-brand-700 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-950/30 transition"
              >
                + Schedule a Task
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto">
              {tasks.map((task) => {
                const priorityColor =
                  task.priority === 'High'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                    : task.priority === 'Medium'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';

                return (
                  <div
                    key={task._id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      task.completed
                        ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-60'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task._id)}
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors flex items-center justify-center ${
                        task.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-brand-500'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-400">{task.startTime} · {task.duration}min</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${priorityColor}`}>
                      {task.priority}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Smart Notes', icon: BookOpen, path: '/app/notes', count: metrics.totalNotes || 0, suffix: 'notes' },
          { label: 'Flashcards', icon: Layers, path: '/app/flashcards', count: metrics.totalFlashcards || 0, suffix: 'cards' },
          { label: 'Quiz History', icon: HelpCircle, path: '/app/quizzes', count: metrics.avgQuizScore || 85, suffix: '% avg' },
          { label: 'Analytics', icon: BarChart3, path: '/app/progress', count: metrics.currentStreak || 7, suffix: 'day streak' },
        ].map((shortcut) => {
          const Icon = shortcut.icon;
          return (
            <button
              key={shortcut.label}
              onClick={() => navigate(shortcut.path)}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <Icon className="w-7 h-7 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900 dark:text-white">{shortcut.count}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{shortcut.suffix}</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{shortcut.label}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
