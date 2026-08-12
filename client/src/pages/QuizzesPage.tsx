import React, { useEffect, useState } from 'react';
import { Plus, Trash2, HelpCircle, X, ChevronRight, CheckCircle2, XCircle, Loader2, RotateCcw, Award } from 'lucide-react';
import { api } from '../services/api';
import { Quiz } from '../types';
import { useToast } from '../context/ToastContext';

const QuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [generateModal, setGenerateModal] = useState(false);
  const [form, setForm] = useState({ topic: '', numQuestions: 10, difficulty: 'Medium', subjectId: '' });
  const [subjects, setSubjects] = useState<any[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    fetchQuizzes();
    fetchSubjects();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/quizzes');
      if (res.data.success) setQuizzes(res.data.quizzes);
    } catch (_) {}
    setLoading(false);
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      if (res.data.success) setSubjects(res.data.subjects);
    } catch (_) {}
  };

  const generateQuiz = async () => {
    if (!form.topic.trim()) { showToast('Please enter a topic.', 'error'); return; }
    setGenerating(true);
    try {
      const res = await api.post('/quizzes/generate', form);
      if (res.data.success) {
        setQuizzes((prev) => [res.data.quiz, ...prev]);
        showToast('Quiz generated!', 'success');
        setGenerateModal(false);
        setForm({ topic: '', numQuestions: 10, difficulty: 'Medium', subjectId: '' });
        startQuiz(res.data.quiz);
      }
    } catch (_) {
      showToast('Failed to generate quiz.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setSelected({});
    setSubmitted(false);
    setScore(0);
  };

  const handleSelect = (option: string) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [currentQ]: option }));
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;
    let correct = 0;
    activeQuiz.questions.forEach((q, i) => {
      if (selected[i] === q.options[q.correctAnswer] || selected[i] === String(q.correctAnswer)) correct++;
    });
    setScore(correct);
    setSubmitted(true);

    try {
      await api.post(`/quizzes/${activeQuiz._id}/submit`, {
        answers: Object.values(selected),
        score: Math.round((correct / activeQuiz.questions.length) * 100),
      });
      fetchQuizzes();
    } catch (_) {}
  };

  const deleteQuiz = async (id: string) => {
    try {
      await api.delete(`/quizzes/${id}`);
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
      showToast('Quiz deleted.', 'info');
    } catch (_) {}
  };

  const currentQuestion = activeQuiz?.questions[currentQ];
  const percentage = activeQuiz ? Math.round((score / activeQuiz.questions.length) * 100) : 0;

  const difficultyColor = (d: string) =>
    d === 'Hard' ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300' :
    d === 'Medium' ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300' :
    'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300';

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-orange-500" /> Quiz Generator
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{quizzes.length} quizzes · AI-generated MCQs to test your knowledge</p>
        </div>
        <button onClick={() => setGenerateModal(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 rounded-xl shadow-md hover:-translate-y-0.5 transition-all">
          <Plus className="w-4 h-4" /> Generate Quiz
        </button>
      </div>

      {/* Quiz List */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-16">
          <HelpCircle className="w-14 h-14 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <p className="font-semibold text-slate-600 dark:text-slate-300">No quizzes yet</p>
          <p className="text-sm text-slate-400 mt-1">Generate your first AI-powered quiz.</p>
          <button onClick={() => setGenerateModal(true)} className="mt-4 px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition">
            Create First Quiz
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 mb-1">{quiz.topic}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColor(quiz.difficulty)}`}>{quiz.difficulty}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{quiz.questions.length} questions</span>
                  </div>
                </div>
                <button onClick={() => deleteQuiz(quiz._id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {quiz.lastScore !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Last Score</span>
                    <span className={`font-bold ${quiz.lastScore >= 70 ? 'text-emerald-600' : quiz.lastScore >= 40 ? 'text-amber-600' : 'text-rose-600'}`}>{quiz.lastScore}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                    <div className={`h-full rounded-full ${quiz.lastScore >= 70 ? 'bg-emerald-500' : quiz.lastScore >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${quiz.lastScore}%` }} />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                <span className="text-xs text-slate-400">{new Date(quiz.createdAt).toLocaleDateString()}</span>
                <button onClick={() => startQuiz(quiz)} className="flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline">
                  {quiz.lastScore !== undefined ? <><RotateCcw className="w-3.5 h-3.5" /> Retake</> : <><ChevronRight className="w-3.5 h-3.5" /> Start</>}
                </button>
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
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><HelpCircle className="w-5 h-5 text-orange-500" /> Generate Quiz</h2>
              <button onClick={() => setGenerateModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Topic *</label>
                <input type="text" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="e.g. SQL Joins, Data Structures, React Hooks" className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Questions</label>
                  <select value={form.numQuestions} onChange={(e) => setForm({ ...form, numQuestions: parseInt(e.target.value) })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none">
                    {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n} questions</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Difficulty</label>
                  <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none">
                    {['Easy', 'Medium', 'Hard'].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Subject (Optional)</label>
                <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none">
                  <option value="">No Subject</option>
                  {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setGenerateModal(false)} className="flex-1 py-2.5 text-sm font-semibold border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition">Cancel</button>
              <button onClick={generateQuiz} disabled={generating} className="flex-1 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl hover:from-orange-400 hover:to-amber-500 transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
                {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><HelpCircle className="w-4 h-4" /> Generate Quiz</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Taking Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 my-4">
            {/* Quiz Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">{activeQuiz.topic}</h2>
                {!submitted && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Question {currentQ + 1} of {activeQuiz.questions.length}</p>
                )}
              </div>
              <button onClick={() => setActiveQuiz(null)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"><X className="w-5 h-5" /></button>
            </div>

            {!submitted ? (
              <div className="p-6 space-y-5">
                {/* Progress Bar */}
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                  <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-600 transition-all" style={{ width: `${((currentQ + 1) / activeQuiz.questions.length) * 100}%` }} />
                </div>

                {/* Question */}
                <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">{currentQuestion?.question}</h3>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQuestion?.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(opt)}
                      className={`w-full text-left p-3.5 rounded-xl border-2 text-sm font-medium transition ${
                        selected[currentQ] === opt
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50/50 dark:hover:bg-orange-950/10'
                      }`}
                    >
                      <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-2">
                  <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 transition">
                    ← Previous
                  </button>
                  {currentQ < activeQuiz.questions.length - 1 ? (
                    <button onClick={() => setCurrentQ(currentQ + 1)} className="px-5 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition">
                      Next →
                    </button>
                  ) : (
                    <button onClick={submitQuiz} className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition">
                      Submit Quiz ✓
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6">
                {/* Score Result */}
                <div className={`rounded-2xl p-6 text-center mb-6 ${
                  percentage >= 70 ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800' :
                  percentage >= 40 ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800' :
                  'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800'
                }`}>
                  <Award className={`w-12 h-12 mx-auto mb-3 ${percentage >= 70 ? 'text-emerald-500' : percentage >= 40 ? 'text-amber-500' : 'text-rose-500'}`} />
                  <div className="text-4xl font-extrabold mb-1">{percentage}%</div>
                  <p className="font-semibold">{score} / {activeQuiz.questions.length} correct</p>
                  <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
                    {percentage >= 70 ? '🎉 Excellent work! Keep it up!' : percentage >= 40 ? '📚 Good effort! Review the missed questions.' : '💪 Keep studying and try again!'}
                  </p>
                </div>

                {/* Question Review */}
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {activeQuiz.questions.map((q, i) => {
                    const userAnswer = selected[i];
                    const isCorrect = userAnswer === q.options[q.correctAnswer] || userAnswer === String(q.correctAnswer);
                    return (
                      <div key={i} className={`p-3.5 rounded-xl border ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'}`}>
                        <div className="flex items-start gap-2">
                          {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{q.question}</p>
                            {!isCorrect && (
                              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                                Correct: {q.correctAnswer}
                              </p>
                            )}
                            {q.explanation && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">{q.explanation}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 mt-5">
                  <button onClick={() => startQuiz(activeQuiz)} className="flex-1 py-2.5 text-sm font-semibold border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Retry Quiz
                  </button>
                  <button onClick={() => setActiveQuiz(null)} className="flex-1 py-2.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition">
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizzesPage;
