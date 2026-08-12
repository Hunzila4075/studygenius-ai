import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Github, Twitter, Linkedin, Mail, Phone, ShieldCheck, Globe, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white">
                StudyGenius <span className="text-brand-400">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              An intelligent, university-level AI study assistant empowering students to master complex coursework, generate active recall flashcards, practice quizzes, and organize smart notes effortlessly.
            </p>

            {/* Contact Details */}
            <div className="space-y-1.5 pt-1 text-sm text-slate-300">
              <a href="mailto:developerwithkhan804@gmail.com" className="flex items-center gap-2 hover:text-brand-400 transition">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>developerwithkhan804@gmail.com</span>
              </a>
              <a href="tel:+923330935652" className="flex items-center gap-2 hover:text-brand-400 transition">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>+92 333 0935652</span>
              </a>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/app/tutor" className="hover:text-white transition">AI Tutor</Link></li>
              <li><Link to="/app/summarizer" className="hover:text-white transition">PDF Summarizer</Link></li>
              <li><Link to="/app/notes" className="hover:text-white transition">Smart Notes</Link></li>
              <li><Link to="/app/quizzes" className="hover:text-white transition">Quiz Generator</Link></li>
              <li><Link to="/app/flashcards" className="hover:text-white transition">3D Flashcards</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Pricing Plans</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Blog & Study Tips</Link></li>
              <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition">Cookie Policy</Link></li>
              <li><Link to="/security" className="hover:text-white transition">Security Audit</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-400 text-center sm:text-left">
            © 2026 StudyGenius AI — Created by <span className="font-bold text-white tracking-wider">HUNZILA KHAN</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> SSL Encrypted</span>
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-brand-400" /> Global EdTech Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
