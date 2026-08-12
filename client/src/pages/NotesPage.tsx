import React, { useEffect, useState } from 'react';
import { Plus, Search, Heart, HeartOff, Trash2, Edit3, Tag, X, BookOpen, Star } from 'lucide-react';
import { api } from '../services/api';
import { Note, Subject } from '../types';
import { useToast } from '../context/ToastContext';
import { useSearchParams } from 'react-router-dom';

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ title: '', content: '', subjectId: '', tags: '', favorite: false });

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, []);

  useEffect(() => {
    fetchNotes();
    fetchSubjects();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notes');
      if (res.data.success) setNotes(res.data.notes);
    } catch (_) {}
    setLoading(false);
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      if (res.data.success) setSubjects(res.data.subjects);
    } catch (_) {}
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', content: '', subjectId: '', tags: '', favorite: false });
    setModalOpen(true);
  };

  const openEdit = (note: Note) => {
    setEditing(note);
    const subId = typeof note.subjectId === 'object' && note.subjectId ? (note.subjectId as any)._id : note.subjectId || '';
    setForm({
      title: note.title,
      content: note.content,
      subjectId: subId as string,
      tags: note.tags.join(', '),
      favorite: note.favorite,
    });
    setModalOpen(true);
  };

  const saveNote = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      showToast('Title and content are required.', 'error');
      return;
    }
    try {
      if (editing) {
        await api.put(`/notes/${editing._id}`, form);
        showToast('Note updated!', 'success');
      } else {
        await api.post('/notes', form);
        showToast('Note created!', 'success');
      }
      fetchNotes();
      setModalOpen(false);
    } catch (_) {
      showToast('Failed to save note.', 'error');
    }
  };

  const toggleFavorite = async (note: Note) => {
    try {
      await api.patch(`/notes/${note._id}/favorite`);
      setNotes((prev) => prev.map((n) => n._id === note._id ? { ...n, favorite: !n.favorite } : n));
    } catch (_) {}
  };

  const deleteNote = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      setDeleting(null);
      showToast('Note deleted.', 'info');
    } catch (_) {
      showToast('Failed to delete note.', 'error');
    }
  };

  const filtered = notes.filter((n) => {
    const matchesSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()) || n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesSubject = !filterSubject || (typeof n.subjectId === 'object' && n.subjectId && (n.subjectId as any)._id === filterSubject);
    const matchesFavorite = !filterFavorite || n.favorite;
    return matchesSearch && matchesSubject && matchesFavorite;
  });

  const subjectColor = (note: Note) => {
    if (typeof note.subjectId === 'object' && note.subjectId) {
      return (note.subjectId as any).color || '#6366F1';
    }
    return '#6366F1';
  };

  const subjectName = (note: Note) => {
    if (typeof note.subjectId === 'object' && note.subjectId) {
      return (note.subjectId as any).name || '';
    }
    return '';
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-brand-600" /> Smart Notes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{notes.length} notes · {notes.filter((n) => n.favorite).length} favorites</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-md hover:-translate-y-0.5 transition-all">
          <Plus className="w-4 h-4" /> New Note
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes, tags..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
          />
        </div>
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500 transition"
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <button
          onClick={() => setFilterFavorite(!filterFavorite)}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-sm font-semibold rounded-xl border transition ${filterFavorite ? 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800' : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <Star className="w-4 h-4" />
          Favorites
        </button>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <BookOpen className="w-14 h-14 mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-slate-600 dark:text-slate-300">{notes.length === 0 ? 'No notes yet' : 'No matching notes'}</p>
          <p className="text-sm mt-1">{notes.length === 0 ? 'Create your first note to start organizing your study material.' : 'Try changing your search or filters.'}</p>
          {notes.length === 0 && (
            <button onClick={openCreate} className="mt-4 px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition">
              Create First Note
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <div key={note._id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
              {/* Note Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  {subjectName(note) && (
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: subjectColor(note) }} />
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{subjectName(note)}</span>
                    </div>
                  )}
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2">{note.title}</h3>
                </div>
                <button onClick={() => toggleFavorite(note)} className="p-1 rounded-lg text-slate-300 dark:text-slate-600 hover:text-yellow-500 transition flex-shrink-0">
                  {note.favorite ? <Heart className="w-4 h-4 fill-yellow-400 text-yellow-400" /> : <Heart className="w-4 h-4" />}
                </button>
              </div>

              {/* Content Preview */}
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 flex-1 mb-3">{note.content}</p>

              {/* Tags */}
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {note.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="flex items-center gap-0.5 px-2 py-0.5 text-xs font-medium bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-900 rounded-full">
                      <Tag className="w-2.5 h-2.5" /> {tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && <span className="text-xs text-slate-400">+{note.tags.length - 3}</span>}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <span className="text-xs text-slate-400">{new Date(note.updatedAt).toLocaleDateString()}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => openEdit(note)} className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/30 text-slate-400 hover:text-brand-600 transition">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleting(note._id)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editing ? 'Edit Note' : 'Create Note'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Note title..." className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Content *</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} placeholder="Write your note content here..." className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Subject</label>
                  <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition">
                    <option value="">No Subject</option>
                    {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Tags (comma-separated)</label>
                  <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="exam, cs, important" className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition" />
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.favorite} onChange={(e) => setForm({ ...form, favorite: e.target.checked })} className="w-4 h-4 rounded text-brand-600 border-slate-300" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Mark as Favorite</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">Cancel</button>
              <button onClick={saveNote} className="flex-1 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 rounded-xl hover:from-brand-500 hover:to-indigo-500 transition shadow-md">{editing ? 'Update Note' : 'Create Note'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Note?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">This action cannot be undone. The note will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="flex-1 py-2.5 text-sm font-semibold border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200">Cancel</button>
              <button onClick={() => deleteNote(deleting)} className="flex-1 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
