import React, { useEffect, useState } from 'react';
import { Plus, RotateCcw, CheckCircle2, X, Loader2, Sparkles, ChevronLeft, ChevronRight, Shuffle, Eye } from 'lucide-react';
import { api } from '../services/api';
import { Flashcard, Subject } from '../types';
import { useToast } from '../context/ToastContext';

const FlashcardsPage: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState<'' | 'New' | 'Learning' | 'Mastered'>('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [studyMode, setStudyMode] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [generateForm, setGenerateForm] = useState({ topic: '', subjectId: '', count: 10 });
  const [generateModal, setGenerateModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchFlashcards();
    fetchSubjects();
  }, []);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const res = await api.get('/flashcards');
      if (res.data.success) setFlashcards(res.data.flashcards);
    } catch (_) {}
    setLoading(false);
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      if (res.data.success) setSubjects(res.data.subjects);
    } catch (_) {}
  };

  const generateFlashcards = async () => {
    if (!generateForm.topic.trim()) {
      showToast('Please enter a topic.', 'error');
      return;
    }
    setGenerating(true);
    try {
      const res = await api.post('/flashcards/generate', generateForm);
      if (res.data.success) {
        setFlashcards((prev) => [...res.data.flashcards, ...prev]);
        showToast(`${res.data.flashcards.length} flashcards generated!`, 'success');
        setGenerateModal(false);
        setGenerateForm({ topic: '', subjectId: '', count: 10 });
      }
    } catch (_) {
      showToast('Failed to generate flashcards.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const updateStatus = async (id: string, status: 'New' | 'Learning' | 'Mastered') => {
    try {
      await api.patch(`/flashcards/${id}/status`, { status });
      setFlashcards((prev) => prev.map((f) => f._id === id ? { ...f, status } : f));
    } catch (_) {}
  };

  const deleteFlashcard = async (id: string) => {
    try {
      await api.delete(`/flashcards/${id}`);
      setFlashcards((prev) => prev.filter((f) => f._id !== id));
      showToast('Flashcard deleted.', 'info');
    } catch (_) {}
  };

  const filtered = flashcards.filter((f) => {
    const matchSub = !filterSubject || (typeof f.subjectId === 'object' && f.subjectId && (f.subjectId as any)._id === filterSubject);
    const matchStatus = !filterStatus || f.status === filterStatus;
    return matchSub && matchStatus;
  });

  const shuffled = [...filtered].sort(() => Math.random() - 0.5);

  const toggleFlip = (id: string) => setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));

  const statusColor = (status: string) => {
    if (status === 'Mastered') return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300';
    if (status === 'Learning') return 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300';
    return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
  };

  // Study Mode
  const enterStudyMode = () => {
    setStudyMode(true);
    setStudyIndex(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    setStudyIndex((prev) => (prev + 1) % filtered.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setStudyIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    setIsFlipped(false);
  };

  const currentCard = filtered[studyIndex];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-teal-500" /> AI Flashcards
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {filtered.length} cards · {flashcards.filter((f) => f.status === 'Mastered').length} mastered · {flashcards.filter((f) => f.status === 'Learning').length} learning
          </p>
        </div>
        <div className="flex gap-2">
          {filtered.length > 0 && (
            <button onClick={enterStudyMode} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 rounded-xl transition">
              <Eye className="w-4 h-4" /> Study Mode
            </button>
          )}
          <button onClick={() => setGenerateModal(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-xl shadow-md hover:-translate-y-0.5 transition-all">
            <Plus className="w-4 h-4" /> Generate AI Cards
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none">
          <option value="">All Subjects</option>
          {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        {(['', 'New', 'Learning', 'Mastered'] as const).map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-3.5 py-2 text-sm font-semibold rounded-xl border transition ${filterStatus === s ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Sparkles className="w-14 h-14 mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-slate-600 dark:text-slate-300">{flashcards.length === 0 ? 'No flashcards yet' : 'No matching cards'}</p>
          <p className="text-sm mt-1">Generate AI-powered flashcards on any topic.</p>
          <button onClick={() => setGenerateModal(true)} className="mt-4 px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition">
            Generate Flashcards
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((card) => (
            <div key={card._id} className="group relative" style={{ perspective: '1000px' }}>
              <div
                onClick={() => toggleFlip(card._id)}
                className={`relative w-full h-44 rounded-2xl shadow-md cursor-pointer transition-all duration-500 border border-slate-200 dark:border-slate-700 hover:shadow-xl`}
                style={{ transformStyle: 'preserve-3d', transform: flipped[card._id] ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                {/* Front */}
                <div className="absolute inset-0 rounded-2xl bg-white dark:bg-slate-800 p-4 flex flex-col" style={{ backfaceVisibility: 'hidden' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(card.status)}`}>{card.status}</span>
                    <span className="text-xs text-slate-400">Click to flip</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white text-center leading-snug">{card.front}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <button onClick={(e) => { e.stopPropagation(); deleteFlashcard(card._id); }} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition">
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      {(['New', 'Learning', 'Mastered'] as const).map((s) => (
                        <button key={s} onClick={(e) => { e.stopPropagation(); updateStatus(card._id, s); }} className={`text-xs px-2 py-0.5 rounded-full font-medium transition ${card.status === s ? statusColor(s) : 'text-slate-400 hover:text-slate-600'}`}>{s[0]}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 p-4 flex items-center justify-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <p className="text-sm text-white text-center leading-relaxed">{card.back}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Modal */}
      {generateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-teal-500" /> Generate Flashcards</h2>
              <button onClick={() => setGenerateModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Topic *</label>
                <input type="text" value={generateForm.topic} onChange={(e) => setGenerateForm({ ...generateForm, topic: e.target.value })} placeholder="e.g. Binary Search Trees, SQL Joins, HTTP Methods" className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Subject</label>
                  <select value={generateForm.subjectId} onChange={(e) => setGenerateForm({ ...generateForm, subjectId: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition">
                    <option value="">None</option>
                    {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Number of Cards</label>
                  <select value={generateForm.count} onChange={(e) => setGenerateForm({ ...generateForm, count: parseInt(e.target.value) })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition">
                    {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n} cards</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setGenerateModal(false)} className="flex-1 py-2.5 text-sm font-semibold border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition">Cancel</button>
              <button onClick={generateFlashcards} disabled={generating} className="flex-1 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl hover:from-teal-500 hover:to-cyan-500 transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
                {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Study Mode Modal */}
      {studyMode && currentCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4 text-white">
              <span className="text-sm font-medium">{studyIndex + 1} / {filtered.length}</span>
              <button onClick={() => setStudyMode(false)} className="p-1.5 hover:bg-white/10 rounded-xl transition"><X className="w-5 h-5" /></button>
            </div>

            {/* 3D Flip Card */}
            <div className="relative h-60 cursor-pointer mb-6" style={{ perspective: '1000px' }} onClick={() => setIsFlipped(!isFlipped)}>
              <div className="absolute inset-0 rounded-3xl transition-all duration-700" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                <div className="absolute inset-0 rounded-3xl bg-white dark:bg-slate-800 shadow-2xl flex flex-col items-center justify-center p-8 text-center" style={{ backfaceVisibility: 'hidden' }}>
                  <p className="text-xs font-semibold text-brand-500 mb-4 uppercase tracking-wide">Question</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white leading-snug">{currentCard.front}</p>
                  <p className="text-xs text-slate-400 mt-6">Click to reveal answer</p>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-700 shadow-2xl flex flex-col items-center justify-center p-8 text-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <p className="text-xs font-semibold text-teal-200 mb-4 uppercase tracking-wide">Answer</p>
                  <p className="text-lg font-medium text-white leading-relaxed">{currentCard.back}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={prevCard} className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex flex-1 gap-2">
                <button onClick={() => { updateStatus(currentCard._id, 'Learning'); nextCard(); }} className="flex-1 py-2.5 text-sm font-bold rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition">
                  Still Learning
                </button>
                <button onClick={() => { updateStatus(currentCard._id, 'Mastered'); nextCard(); }} className="flex-1 py-2.5 text-sm font-bold rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition">
                  Mastered! ✓
                </button>
              </div>
              <button onClick={nextCard} className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardsPage;
