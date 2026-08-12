import React, { useEffect, useRef, useState } from 'react';
import {
  Send, Trash2, RefreshCw, Save, Copy, Plus, ChevronDown, Bot, User, Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { Conversation, ChatMessage } from '../types';
import { useToast } from '../context/ToastContext';

const SUBJECTS = ['General', 'Programming', 'Mathematics', 'Computer Science', 'Database Systems', 'Computer Networks', 'Human-Computer Interaction', 'Web Engineering', 'Other'];

const TutorPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [subject, setSubject] = useState('General');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations');
      if (res.data.success) setConversations(res.data.conversations);
    } catch (_) {}
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setLoading(true);
    setTyping(true);

    const userMsg: ChatMessage = { sender: 'user', text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await api.post('/conversations/message', {
        conversationId: activeConvId,
        message: text,
        subject,
      });
      if (res.data.success) {
        setActiveConvId(res.data.conversationId);
        setMessages(res.data.messages);
        fetchConversations();
      }
    } catch (_) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Connection error. Please check the backend server is running and try again.', timestamp: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  const loadConversation = (conv: Conversation) => {
    setActiveConvId(conv._id);
    setMessages(conv.messages);
    setSubject(conv.subject || 'General');
    setSidebarOpen(false);
  };

  const clearConversation = async () => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }
    try {
      await api.delete(`/conversations/${activeConvId}/clear`);
      setMessages([]);
      showToast('Conversation cleared.', 'info');
    } catch (_) {}
  };

  const newConversation = () => {
    setActiveConvId(null);
    setMessages([]);
    setInput('');
  };

  const saveToNotes = async (text: string) => {
    try {
      await api.post('/conversations/save-note', { text, subject });
      showToast('Saved to Smart Notes!', 'success');
    } catch (_) {
      showToast('Failed to save note.', 'error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  };

  const promptTemplates = [
    `Explain ${subject === 'General' ? 'Binary Search' : subject} in simple terms`,
    `What are the key concepts in ${subject}?`,
    `Give me 5 practice questions on ${subject}`,
    'What should I focus on for my exam?',
  ];

  return (
    <div className="h-[calc(100vh-5.5rem)] flex gap-4 overflow-hidden">
      {/* Conversations Sidebar (Mobile Toggle + Desktop Visible) */}
      <div className={`absolute md:relative inset-y-0 left-0 z-20 md:z-auto md:block bg-white dark:bg-slate-800 md:bg-transparent rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 flex-shrink-0
        ${sidebarOpen ? 'w-64 block' : 'hidden md:block md:w-60'}`}>
        <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900 dark:text-white">Conversations</span>
          <button onClick={newConversation} className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/30 text-brand-600 dark:text-brand-400">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto h-full pb-20">
          {conversations.length === 0 ? (
            <p className="text-xs text-slate-400 text-center p-4">No conversations yet. Start chatting!</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => loadConversation(conv)}
                className={`w-full text-left px-3 py-2.5 text-sm border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition ${activeConvId === conv._id ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}
              >
                <div className="truncate font-medium">{conv.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{conv.subject} · {conv.messages.length} messages</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white">AI Tutor</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">StudyGenius Gemini AI · Ask anything</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Subject Selector */}
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="text-xs font-semibold rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={clearConversation} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition" title="Clear conversation">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-xl mb-4">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Start a Conversation</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">Ask me anything about your studies. I'll explain concepts, help with problems, and guide your learning.</p>
              <div className="grid sm:grid-cols-2 gap-2 w-full max-w-md">
                {promptTemplates.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => { setInput(prompt); }}
                    className="text-left text-xs font-medium p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-950/20 text-slate-700 dark:text-slate-300 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm shadow ${
                msg.sender === 'ai'
                  ? 'bg-gradient-to-br from-brand-600 to-indigo-600 text-white'
                  : 'bg-gradient-to-br from-slate-700 to-slate-900 text-white dark:from-slate-500 dark:to-slate-700'
              }`}>
                {msg.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className={`group max-w-[78%] ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-sm'
                      : 'bg-slate-100 dark:bg-slate-700/70 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === 'ai' && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => copyToClipboard(msg.text)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition" title="Copy">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => saveToNotes(msg.text)} className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition" title="Save to Notes">
                      <Save className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-700/70 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                {[0, 150, 300].map((delay) => (
                  <span key={delay} className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={`Ask about ${subject}...`}
              disabled={loading}
              className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition disabled:opacity-60"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md hover:shadow-brand-500/30 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center mt-2">Press Enter to send · AI responses may not always be accurate</p>
        </div>
      </div>
    </div>
  );
};

export default TutorPage;
