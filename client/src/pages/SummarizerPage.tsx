import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X, Send, Download, Save, Copy, Loader2, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { Summary } from '../types';
import { useToast } from '../context/ToastContext';

const SummarizerPage: React.FC = () => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'points' | 'terms' | 'questions' | 'notes'>('summary');
  const [question, setQuestion] = useState('');
  const [qaLoading, setQaLoading] = useState(false);
  const [qaAnswer, setQaAnswer] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (uploading) {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 15, 90));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [uploading]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') {
      setFile(dropped);
    } else {
      showToast('Only PDF files are supported.', 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected?.type === 'application/pdf') {
      setFile(selected);
    } else {
      showToast('Only PDF files are supported.', 'error');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('File is too large. Maximum size is 10MB.', 'error');
      return;
    }

    setUploading(true);
    setSummary(null);
    setQaAnswer('');

    const formData = new FormData();
    formData.append('pdfFile', file);

    try {
      const res = await api.post('/summarizer/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setSummary(res.data.summary);
        setProgress(100);
        showToast('PDF analyzed successfully!', 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'PDF upload failed. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    setQaLoading(true);
    setQaAnswer('');
    try {
      const res = await api.post('/summarizer/qa', {
        summaryId: summary?._id,
        question,
      });
      if (res.data.success) setQaAnswer(res.data.answer);
    } catch (_) {
      setQaAnswer('Failed to get an answer. Please try again.');
    } finally {
      setQaLoading(false);
    }
  };

  const handleSaveToNotes = async () => {
    if (!summary) return;
    try {
      await api.post('/summarizer/save-note', { summaryId: summary._id });
      showToast('Summary saved to your notes!', 'success');
    } catch (_) {
      showToast('Failed to save to notes.', 'error');
    }
  };

  const handleDownload = () => {
    if (!summary) return;
    const content = `# ${summary.title}\n\n## Summary\n${summary.summaryText}\n\n## Important Points\n${summary.importantPoints.map((p) => `• ${p}`).join('\n')}\n\n## Key Terms\n${summary.keyTerms.map((k) => `• ${k.term}: ${k.definition}`).join('\n')}\n\n## Review Questions\n${summary.reviewQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\n## Short Notes\n${summary.shortNotes}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summary.title.replace(/\s+/g, '-')}-summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Summary downloaded!', 'success');
  };

  const tabs = [
    { key: 'summary', label: 'Summary' },
    { key: 'points', label: 'Key Points' },
    { key: 'terms', label: 'Key Terms' },
    { key: 'questions', label: 'Review Q&A' },
    { key: 'notes', label: 'Short Notes' },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">PDF Summarizer</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Upload any PDF study material and get an AI-generated summary, key terms, and review questions.</p>
      </div>

      {/* Upload Zone */}
      {!summary && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => !file && fileInputRef.current?.click()}
          className={`relative rounded-3xl border-2 border-dashed p-12 text-center transition-all cursor-pointer ${dragging
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 scale-[1.01]'
            : file
              ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:border-brand-700 dark:hover:bg-brand-950/20'
            }`}
        >
          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <FileText className="w-14 h-14 text-emerald-500" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{file.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl hover:bg-rose-100 transition"
                >
                  <X className="w-4 h-4" /> Remove
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                  disabled={uploading}
                  className="flex items-center gap-1.5 px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-md disabled:opacity-60 transition"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'Analyzing...' : 'Analyze PDF'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Drop your PDF here</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">or click to browse files</p>
              <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full">PDF only · Max 10MB</span>
            </>
          )}
        </div>
      )}

      {/* Upload Progress Bar */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 font-medium">
            <span>Analyzing PDF with AI...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results Area */}
      {summary && (
        <div className="space-y-4">
          {/* Result Header */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">{summary.title}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{summary.fileName}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => { navigator.clipboard.writeText(summary.summaryText); showToast('Copied!', 'success'); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
                <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button onClick={handleSaveToNotes} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition">
                  <Save className="w-3.5 h-3.5" /> Save to Notes
                </button>
                <button onClick={() => { setSummary(null); setFile(null); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                  <Upload className="w-3.5 h-3.5" /> New PDF
                </button>
              </div>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 px-3.5 py-2 text-sm font-semibold rounded-lg transition ${activeTab === tab.key
                  ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            {activeTab === 'summary' && (
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap text-sm">{summary.summaryText}</p>
            )}
            {activeTab === 'points' && (
              <ul className="space-y-3">
                {summary.importantPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'terms' && (
              <dl className="space-y-3">
                {summary.keyTerms.map((term, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-1.5 sm:gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                    <dt className="font-bold text-brand-700 dark:text-brand-300 text-sm flex-shrink-0 min-w-[140px]">{term.term}</dt>
                    <dd className="text-slate-700 dark:text-slate-200 text-sm">{term.definition}</dd>
                  </div>
                ))}
              </dl>
            )}
            {activeTab === 'questions' && (
              <ol className="space-y-2.5">
                {summary.reviewQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-brand-600 dark:text-brand-400 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                    <p className="text-sm text-slate-700 dark:text-slate-200">{q}</p>
                  </li>
                ))}
              </ol>
            )}
            {activeTab === 'notes' && (
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap text-sm font-mono text-xs bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">{summary.shortNotes}</p>
            )}
          </div>

          {/* Ask About PDF */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Send className="w-4 h-4 text-brand-600" /> Ask a Question About This PDF
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                placeholder="What are the main points? / Explain the key concepts..."
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
              />
              <button
                onClick={handleAskQuestion}
                disabled={qaLoading || !question.trim()}
                className="px-4 py-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 transition flex items-center gap-1.5 text-sm font-semibold"
              >
                {qaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
            {qaAnswer && (
              <div className="mt-4 p-4 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800">
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{qaAnswer}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummarizerPage;
