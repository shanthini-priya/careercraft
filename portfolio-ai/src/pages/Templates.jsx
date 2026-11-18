import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Palette, 
  Download, 
  Printer, 
  Edit3, 
  Eye, 
  Sparkles, 
  ArrowRight, 
  Check, 
  ExternalLink,
  Code2,
  FileText,
  User,
  Globe,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Lock,
  Layers,
  Sun,
  Moon
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons.jsx';
import { 
  getProfile, 
  saveProfile, 
  getSelectedTemplate, 
  saveSelectedTemplate, 
  getSettings, 
  saveSettings 
} from '../storage.js';
import { navigate, ROUTES } from '../router.js';

export const TEMPLATES = [
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    subtitle: 'Monochrome & Clean',
    tagline: 'Clean typography, distraction-free monochrome elegance, tech-forward',
    badge: 'Popular',
    icon: Sparkles,
    previewBg: 'bg-zinc-50 dark:bg-zinc-900'
  },
  {
    id: 'tech-slate',
    name: 'Tech Neo-Slate',
    subtitle: 'Terminal & Code',
    tagline: 'Structured cards, code badges, terminal accents, high contrast',
    badge: 'Engineers',
    icon: Code2,
    previewBg: 'bg-slate-900 text-slate-100'
  },
  {
    id: 'creative-indigo',
    name: 'Creative Indigo',
    subtitle: 'Atmospheric SaaS',
    tagline: 'Soft atmospheric gradients, glowing borders, modern SaaS aesthetic',
    badge: 'Design & Full-Stack',
    icon: Globe,
    previewBg: 'bg-indigo-950 text-indigo-50'
  },
  {
    id: 'executive-classic',
    name: 'Executive Classic',
    subtitle: 'Editorial Serif',
    tagline: 'Dense, structured corporate layout, traditional serif typography',
    badge: 'Executive',
    icon: Briefcase,
    previewBg: 'bg-stone-50 dark:bg-stone-900'
  }
];

export const COLOR_THEMES = [
  { id: 'indigo', name: 'Indigo', color: '#6366f1', lightColor: '#4f46e5' },
  { id: 'emerald', name: 'Emerald', color: '#10b981', lightColor: '#059669' },
  { id: 'violet', name: 'Violet', color: '#8b5cf6', lightColor: '#7c3aed' },
  { id: 'cyan', name: 'Teal / Cyan', color: '#06b6d4', lightColor: '#0891b2' },
  { id: 'amber', name: 'Amber', color: '#f59e0b', lightColor: '#d97706' },
  { id: 'rose', name: 'Rose', color: '#f43f5e', lightColor: '#e11d48' }
];

export const ACCENT_STYLES = {
  indigo: {
    primaryHex: '#6366f1',
    primaryLightHex: '#4f46e5',
    text: 'text-indigo-600 dark:text-indigo-400',
    textLight: 'text-indigo-600',
    textDark: 'text-indigo-400',
    hoverText: 'hover:text-indigo-500',
    bg: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    bgSoft: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-500/30 dark:border-indigo-500/40',
    borderHover: 'hover:border-indigo-500/60',
    ring: 'focus:ring-indigo-500',
    badge: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-700 dark:text-indigo-300',
    tag: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
    glow: 'shadow-[0_0_20px_rgba(99,102,241,0.3)]',
    gradient: 'from-indigo-600 to-indigo-400'
  },
  emerald: {
    primaryHex: '#10b981',
    primaryLightHex: '#059669',
    text: 'text-emerald-600 dark:text-emerald-400',
    textLight: 'text-emerald-600',
    textDark: 'text-emerald-400',
    hoverText: 'hover:text-emerald-500',
    bg: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    bgSoft: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-500/30 dark:border-emerald-500/40',
    borderHover: 'hover:border-emerald-500/60',
    ring: 'focus:ring-emerald-500',
    badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
    tag: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    gradient: 'from-emerald-600 to-emerald-400'
  },
  violet: {
    primaryHex: '#8b5cf6',
    primaryLightHex: '#7c3aed',
    text: 'text-violet-600 dark:text-violet-400',
    textLight: 'text-violet-600',
    textDark: 'text-violet-400',
    hoverText: 'hover:text-violet-500',
    bg: 'bg-violet-600 hover:bg-violet-500 text-white',
    bgSoft: 'bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300',
    border: 'border-violet-500/30 dark:border-violet-500/40',
    borderHover: 'hover:border-violet-500/60',
    ring: 'focus:ring-violet-500',
    badge: 'bg-violet-500/15 border-violet-500/30 text-violet-700 dark:text-violet-300',
    tag: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]',
    gradient: 'from-violet-600 to-violet-400'
  },
  cyan: {
    primaryHex: '#06b6d4',
    primaryLightHex: '#0891b2',
    text: 'text-cyan-600 dark:text-cyan-400',
    textLight: 'text-cyan-600',
    textDark: 'text-cyan-400',
    hoverText: 'hover:text-cyan-500',
    bg: 'bg-cyan-600 hover:bg-cyan-500 text-white',
    bgSoft: 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-500/30 dark:border-cyan-500/40',
    borderHover: 'hover:border-cyan-500/60',
    ring: 'focus:ring-cyan-500',
    badge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-700 dark:text-cyan-300',
    tag: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    gradient: 'from-cyan-600 to-cyan-400'
  },
  amber: {
    primaryHex: '#f59e0b',
    primaryLightHex: '#d97706',
    text: 'text-amber-600 dark:text-amber-400',
    textLight: 'text-amber-600',
    textDark: 'text-amber-400',
    hoverText: 'hover:text-amber-500',
    bg: 'bg-amber-600 hover:bg-amber-500 text-white',
    bgSoft: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
    border: 'border-amber-500/30 dark:border-amber-500/40',
    borderHover: 'hover:border-amber-500/60',
    ring: 'focus:ring-amber-500',
    badge: 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300',
    tag: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    gradient: 'from-amber-600 to-amber-400'
  },
  rose: {
    primaryHex: '#f43f5e',
    primaryLightHex: '#e11d48',
    text: 'text-rose-600 dark:text-rose-400',
    textLight: 'text-rose-600',
    textDark: 'text-rose-400',
    hoverText: 'hover:text-rose-500',
    bg: 'bg-rose-600 hover:bg-rose-500 text-white',
    bgSoft: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300',
    border: 'border-rose-500/30 dark:border-rose-500/40',
    borderHover: 'hover:border-rose-500/60',
    ring: 'focus:ring-rose-500',
    badge: 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-300',
    tag: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
    gradient: 'from-rose-600 to-rose-400'
  }
};

ACCENT_STYLES['teal'] = ACCENT_STYLES.cyan;

/**
 * Master Portfolio Renderer
 */
export function PortfolioRenderer({ 
  profile, 
  templateId = 'tech-slate', 
  isEditable = false, 
  onProfileChange,
  themeMode = 'dark',
  accentColor = 'cyan'
}) {
  const p = profile || {};
  const personal = p.personal || {};
  const education = p.education || [];
  const skills = p.skills || { technical: [], frameworks: [], tools: [], soft: [] };
  const projects = p.projects || [];
  const experience = p.experience || [];

  const isDark = themeMode === 'dark';
  const accent = ACCENT_STYLES[accentColor] || ACCENT_STYLES.cyan;

  const handleTextEdit = (path, value) => {
    if (!isEditable || !onProfileChange) return;
    const clone = JSON.parse(JSON.stringify(p));
    const parts = path.split('.');
    let curr = clone;
    for (let i = 0; i < parts.length - 1; i++) {
      curr = curr[parts[i]];
    }
    curr[parts[parts.length - 1]] = value;
    onProfileChange(clone);
  };

  const containerStyle = {
    '--color-primary': isDark ? accent.primaryHex : accent.primaryLightHex
  };

  // ==========================================
  // TEMPLATE 1: Modern Minimalist
  // ==========================================
  if (templateId === 'modern-minimalist') {
    return (
      <div 
        style={containerStyle}
        data-theme={accentColor}
        className={`${isDark ? 'dark bg-zinc-950 text-zinc-100' : 'light bg-white text-zinc-900'} min-h-full font-sans p-6 sm:p-12 space-y-16 transition-colors duration-200`}
      >
        {/* Header */}
        <header className={`max-w-4xl mx-auto space-y-4 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'} pb-10`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleTextEdit('personal.fullName', e.currentTarget.textContent)}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              >
                {personal.fullName || 'M. Shanthini Priya'}
              </h1>
              <p 
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleTextEdit('personal.targetRole', e.currentTarget.textContent)}
                className={`text-lg font-semibold mt-1 ${accent.text}`}
              >
                {personal.targetRole || 'Graphic Designer | UI/UX Designer | Frontend Developer'}
              </p>
            </div>

            <div className={`flex flex-wrap items-center gap-3 text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {personal.location && (
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{personal.location}</span>
              )}
              {personal.email && (
                <a href={`mailto:${personal.email}`} className={`flex items-center gap-1 ${accent.hoverText} transition`}>
                  <Mail className="w-3.5 h-3.5" />{personal.email}
                </a>
              )}
            </div>
          </div>

          <p 
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleTextEdit('summary', e.currentTarget.textContent)}
            className={`text-sm sm:text-base leading-relaxed max-w-3xl pt-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            {p.summary || personal.bio || 'Your career summary...'}
          </p>

          {/* Social links */}
          <div className="flex flex-wrap gap-3 pt-2">
            {personal.github && (
              <a 
                href={personal.github} 
                target="_blank" 
                rel="noreferrer" 
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                  isDark ? 'border-zinc-800 text-zinc-300 hover:border-zinc-600' : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                } ${accent.hoverText}`}
              >
                <GithubIcon className="w-3.5 h-3.5" /> GitHub
              </a>
            )}
            {personal.linkedin && (
              <a 
                href={personal.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                  isDark ? 'border-zinc-800 text-zinc-300 hover:border-zinc-600' : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                } ${accent.hoverText}`}
              >
                <LinkedinIcon className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}
            {personal.website && (
              <a 
                href={personal.website} 
                target="_blank" 
                rel="noreferrer" 
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                  isDark ? 'border-zinc-800 text-zinc-300 hover:border-zinc-600' : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                } ${accent.hoverText}`}
              >
                <Globe className="w-3.5 h-3.5" /> Website
              </a>
            )}
          </div>
        </header>

        {/* Featured Projects */}
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              01 / Featured Projects
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-2xl border space-y-3 flex flex-col justify-between transition-colors ${
                  isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-zinc-50/80 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base">{proj.title}</h3>
                    <div className="flex gap-2">
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className={`${accent.text} ${accent.hoverText}`}>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className={`${isDark ? 'text-zinc-400' : 'text-zinc-500'} ${accent.hoverText}`}>
                          <GithubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className={`text-xs font-mono mt-0.5 ${accent.text}`}>{proj.role}</p>
                  <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{proj.description}</p>
                </div>

                <div className={`space-y-3 pt-3 border-t ${isDark ? 'border-zinc-800/60' : 'border-zinc-200/80'}`}>
                  <div className="flex flex-wrap gap-1.5">
                    {(proj.techStack || []).map((t, ti) => (
                      <span 
                        key={ti} 
                        className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                          isDark ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-200/70 text-zinc-800'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className={`text-xs space-y-1 list-disc list-inside ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {proj.bullets.slice(0, 2).map((b, bi) => (
                        <li key={bi} className="leading-snug">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience & Education Grid */}
        <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              02 / Work & Internships
            </h2>
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx} className={`space-y-1.5 border-l-2 pl-4 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                  <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{exp.startDate} — {exp.endDate}</span>
                  <h3 className="font-bold text-sm">{exp.role}</h3>
                  <p className={`text-xs font-semibold ${accent.text}`}>{exp.company} • {exp.type}</p>
                  <ul className={`text-xs space-y-1 list-disc list-inside pt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {(exp.bullets || []).map((b, bi) => (
                      <li key={bi} className="leading-snug">{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                03 / Education
              </h2>
              {education.map((edu, idx) => (
                <div key={idx} className={`space-y-1 border-l-2 pl-4 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                  <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{edu.startDate} — {edu.endDate}</span>
                  <h3 className="font-bold text-sm">{edu.degree} in {edu.fieldOfStudy}</h3>
                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}</p>
                  {edu.highlights && (
                    <p className={`text-xs italic pt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{edu.highlights}</p>
                  )}
                </div>
              ))}
            </div>

            <div>
              <h2 className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                04 / Skills & Technologies
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {[
                  ...(skills.technical || []),
                  ...(skills.frameworks || []),
                  ...(skills.tools || [])
                ].map((s, idx) => (
                  <span 
                    key={idx} 
                    className={`text-xs px-2.5 py-1 rounded-md border font-medium ${
                      isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-200' : 'border-zinc-200 bg-zinc-100 text-zinc-800'
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ==========================================
  // TEMPLATE 2: Tech Neo-Slate
  // ==========================================
  if (templateId === 'tech-slate') {
    return (
      <div 
        style={containerStyle}
        data-theme={accentColor}
        className={`${isDark ? 'dark bg-slate-950 text-slate-100' : 'light bg-slate-100 text-slate-900'} min-h-full font-mono p-6 sm:p-10 space-y-12 transition-colors duration-200`}
      >
        {/* Top Terminal Bar */}
        <div className={`max-w-4xl mx-auto rounded-2xl border p-6 sm:p-8 space-y-5 shadow-2xl transition-colors ${
          isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-300 bg-white shadow-xl'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className={`text-xs ml-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>sys://developer-manifest</span>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${accent.badge}`}>
              STATUS: READY FOR HIRE
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {personal.fullName || 'M. Shanthini Priya'}
            </h1>
            <p className={`text-sm sm:text-base font-semibold mt-1 ${accent.text}`}>
              $ role --title "{personal.targetRole || 'Graphic Designer | UI/UX Designer | Frontend Developer'}"
            </p>
          </div>

          <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {p.summary || personal.bio}
          </p>

          <div className={`flex flex-wrap gap-3 text-xs pt-2 font-mono border-t ${
            isDark ? 'text-slate-400 border-slate-800' : 'text-slate-600 border-slate-200'
          }`}>
            <span>📍 {personal.location}</span>
            <span>✉ {personal.email}</span>
            {personal.github && (
              <a href={personal.github} target="_blank" rel="noreferrer" className={`${accent.text} hover:underline`}>
                [GitHub]
              </a>
            )}
            {personal.linkedin && (
              <a href={personal.linkedin} target="_blank" rel="noreferrer" className={`${accent.text} hover:underline`}>
                [LinkedIn]
              </a>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <Code2 className={`w-4 h-4 ${accent.text}`} />
            <span>./repositories --featured</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj, idx) => (
              <div 
                key={idx} 
                className={`p-5 rounded-xl border transition space-y-3 ${
                  isDark 
                    ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-100' 
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-sm">{proj.title}</h3>
                  <div className="flex gap-2">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black'}`}>
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className={`${accent.text} hover:underline`}>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                <p className={`text-xs font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{proj.description}</p>
                <div className="flex flex-wrap gap-1">
                  {(proj.techStack || []).map((t, ti) => (
                    <span 
                      key={ti} 
                      className={`text-[10px] px-2 py-0.5 rounded border font-mono ${accent.tag}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience & Skills */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-5 rounded-xl border space-y-4 ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-sm'
          }`}>
            <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              // WORK HISTORY
            </span>
            {experience.map((exp, idx) => (
              <div key={idx} className={`space-y-1 border-b pb-3 last:border-none ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                <div className="flex justify-between text-xs">
                  <span className="font-bold">{exp.role}</span>
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className={`text-xs font-semibold ${accent.text}`}>{exp.company}</p>
                <p className={`text-xs font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{exp.bullets?.[0]}</p>
              </div>
            ))}
          </div>

          <div className={`p-5 rounded-xl border space-y-4 ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-sm'
          }`}>
            <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              // SKILLS & EDUCATION
            </span>
            <div className={`flex flex-wrap gap-1.5 pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              {[...(skills.technical || []), ...(skills.frameworks || []), ...(skills.tools || [])].map((s, idx) => (
                <span 
                  key={idx} 
                  className={`text-xs px-2 py-1 rounded font-mono ${
                    isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
            {education.map((edu, idx) => (
              <div key={idx} className="text-xs space-y-0.5">
                <p className="font-bold">{edu.degree} in {edu.fieldOfStudy}</p>
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>{edu.institution} • {edu.endDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // TEMPLATE 3: Creative Indigo / Atmospheric
  // ==========================================
  if (templateId === 'creative-indigo') {
    return (
      <div 
        style={containerStyle}
        data-theme={accentColor}
        className={`${
          isDark 
            ? 'dark bg-gradient-to-b from-[#090b14] via-[#0d101d] to-[#090b14] text-slate-100' 
            : 'light bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900'
        } min-h-full font-sans p-6 sm:p-12 space-y-14 transition-colors duration-200`}
      >
        {/* Hero Banner */}
        <div className="max-w-4xl mx-auto text-center space-y-4 pt-6">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${accent.badge}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Available for New Roles</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${
            isDark 
              ? 'bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent' 
              : 'text-slate-900'
          }`}>
            {personal.fullName || 'Creative Developer'}
          </h1>
          <p className={`text-lg font-medium max-w-xl mx-auto ${accent.text}`}>
            {personal.targetRole}
          </p>
          <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {p.summary || personal.bio}
          </p>

          <div className="flex justify-center gap-3 pt-2">
            {personal.email && (
              <a 
                href={`mailto:${personal.email}`} 
                className={`px-4 py-2 rounded-xl font-semibold text-xs shadow-lg transition ${accent.bg}`}
              >
                Get In Touch
              </a>
            )}
            {personal.github && (
              <a 
                href={personal.github} 
                target="_blank" 
                rel="noreferrer" 
                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition ${
                  isDark ? 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                GitHub
              </a>
            )}
            {personal.linkedin && (
              <a 
                href={personal.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition ${
                  isDark ? 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className={`text-xs font-bold uppercase tracking-widest text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Highlighted Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-2xl border backdrop-blur-md transition space-y-4 ${
                  isDark 
                    ? 'bg-white/[0.025] border-white/10 hover:border-white/20' 
                    : 'bg-white/90 border-slate-200/90 hover:border-slate-300 shadow-md'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-base">{proj.title}</h3>
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className={`${accent.text} hover:opacity-80`}>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(proj.techStack || []).map((t, ti) => (
                    <span 
                      key={ti} 
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${accent.badge}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Split: Experience & Skills */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border space-y-4 ${
            isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white/90 border-slate-200/90 shadow-md'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${accent.text}`}>Experience</h3>
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <h4 className="font-bold text-sm">{exp.role}</h4>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{exp.company} • {exp.startDate} - {exp.endDate}</p>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{exp.bullets?.[0]}</p>
              </div>
            ))}
          </div>

          <div className={`p-6 rounded-2xl border space-y-4 ${
            isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white/90 border-slate-200/90 shadow-md'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${accent.text}`}>Skills & Education</h3>
            <div className="flex flex-wrap gap-1.5">
              {[...(skills.technical || []), ...(skills.frameworks || []), ...(skills.tools || [])].map((s, idx) => (
                <span 
                  key={idx} 
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                    isDark ? 'bg-white/[0.04] border-white/10 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
            {education[0] && (
              <div className="pt-2 text-xs">
                <p className="font-bold">{education[0].degree} in {education[0].fieldOfStudy}</p>
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>{education[0].institution} ({education[0].endDate})</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // TEMPLATE 4: Executive Classic
  // ==========================================
  return (
    <div 
      style={containerStyle}
      data-theme={accentColor}
      className={`${
        isDark ? 'dark bg-stone-900 text-stone-100' : 'light bg-[#faf8f5] text-stone-900'
      } min-h-full font-serif p-6 sm:p-12 space-y-10 transition-colors duration-200`}
    >
      <header className={`max-w-4xl mx-auto text-center border-b pb-8 space-y-2 ${isDark ? 'border-stone-800' : 'border-stone-300'}`}>
        <h1 className="text-3xl sm:text-4xl font-normal tracking-wide font-serif">
          {personal.fullName || 'M. Shanthini Priya'}
        </h1>
        <p className={`text-sm font-sans uppercase tracking-widest font-semibold ${accent.text}`}>
          {personal.targetRole || 'Graphic Designer | UI/UX Designer | Frontend Developer'}
        </p>
        <p className={`text-xs font-sans ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
          {personal.location} • {personal.email} • {personal.phone}
        </p>
        <p className={`text-sm max-w-2xl mx-auto pt-3 font-sans leading-relaxed italic ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
          "{p.summary || personal.bio}"
        </p>
      </header>

      <div className="max-w-4xl mx-auto space-y-8 font-sans">
        {/* Projects */}
        <section className="space-y-4">
          <h2 className={`text-xs font-bold uppercase tracking-widest border-b pb-1 ${isDark ? 'border-stone-800 text-stone-400' : 'border-stone-300 text-stone-500'}`}>
            Selected Projects
          </h2>
          <div className="space-y-4">
            {projects.map((proj, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm font-serif">{proj.title}</h3>
                  <span className={`text-xs font-mono ${accent.text}`}>{(proj.techStack || []).join(', ')}</span>
                </div>
                <p className={`text-xs ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>{proj.description}</p>
                {proj.bullets && (
                  <ul className={`text-xs list-disc list-inside ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    {proj.bullets.slice(0, 2).map((b, bi) => <li key={bi}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Experience & Education */}
        <section className={`grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t ${isDark ? 'border-stone-800' : 'border-stone-300'}`}>
          <div className="space-y-3">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Professional Experience</h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="text-xs space-y-0.5">
                <div className="flex justify-between font-bold">
                  <span>{exp.role}</span>
                  <span className={isDark ? 'text-stone-400' : 'text-stone-500'}>{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className={`italic font-medium ${accent.text}`}>{exp.company}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Education & Honors</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="text-xs space-y-0.5">
                <div className="flex justify-between font-bold">
                  <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className={isDark ? 'text-stone-400' : 'text-stone-500'}>{edu.endDate}</span>
                </div>
                <p className={isDark ? 'text-stone-400' : 'text-stone-600'}>{edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * Main Templates Page
 */
export default function Templates() {
  const [profile, setProfile] = useState(() => getProfile());
  const [selectedTemplate, setSelectedTemplate] = useState(() => getSelectedTemplate());
  const [settings, setSettings] = useState(() => getSettings());
  const [viewport, setViewport] = useState('desktop'); // desktop | tablet | mobile
  const [isEditable, setIsEditable] = useState(false);

  // Sync settings when updated externally
  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail) {
        setSettings(e.detail);
      }
    };
    window.addEventListener('portfolio-ai-settings-updated', handleSync);
    return () => window.removeEventListener('portfolio-ai-settings-updated', handleSync);
  }, []);

  const handleSelectTemplate = (id) => {
    setSelectedTemplate(id);
    saveSelectedTemplate(id);
  };

  const handleColorChange = (colorId) => {
    const updated = { ...settings, accentColor: colorId };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleThemeModeChange = (mode) => {
    const updated = { ...settings, theme: mode };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
  };

  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  };

  const currentAccent = settings.accentColor || 'cyan';
  const currentThemeMode = settings.theme || 'dark';

  return (
    <div className="min-h-screen bg-token-bg text-token-text pb-16 selection:bg-token-accent selection:text-white transition-colors duration-200">
      {/* Background Atmosphere Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-30 dark:opacity-100 transition-opacity">
        <div className="absolute top-[8%] left-[20%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[10%] w-[450px] h-[450px] bg-purple-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4 space-y-6">
        {/* Top Gallery Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-token-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-token-text flex items-center gap-2.5">
              <span>Template Gallery & Live Preview</span>
            </h1>
            <p className="text-xs sm:text-sm text-token-muted mt-0.5">
              Switch between 4 curated portfolio layouts, fine-tune accent tokens, and test responsive viewports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate(ROUTES.PROFILE)}
              className="px-3.5 py-2 rounded-xl border border-token-border bg-token-card hover:bg-token-card-hover text-xs font-semibold text-token-text flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-token-accent" />
              <span>Edit Profile Data</span>
            </button>

            <button
              onClick={() => navigate(ROUTES.RESUME, { tab: 'resume' })}
              className="px-4 py-2 rounded-xl bg-token-accent hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Open ATS Resume View</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>

        {/* 1. Streamlined Horizontal Template Selector Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate === tmpl.id;
            const Icon = tmpl.icon || Sparkles;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'border-token-accent bg-token-accent/10 shadow-sm ring-1 ring-token-accent/30'
                    : 'border-token-border bg-token-card hover:bg-token-card-hover'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                    isSelected
                      ? 'bg-token-accent/20 border-token-accent/40 text-token-accent'
                      : 'bg-token-bg border-token-border text-token-muted'
                  }`}>
                    <Icon className="w-3 h-3 text-token-accent" />
                    <span>{tmpl.badge}</span>
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-token-accent text-white flex items-center justify-center text-[10px] font-extrabold shadow-sm">
                      ✓
                    </span>
                  )}
                </div>
                <div>
                  <h3 className={`font-bold text-xs sm:text-sm tracking-tight transition ${
                    isSelected ? 'text-token-text' : 'text-token-text group-hover:text-token-accent'
                  }`}>
                    {tmpl.name}
                  </h3>
                  <p className="text-[11px] text-token-muted mt-0.5 font-medium">
                    {tmpl.subtitle || tmpl.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2. Cohesive Minimalist Preview Toolbar */}
        <div className="p-3 sm:p-3.5 rounded-2xl border border-token-border bg-token-card shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors">
          {/* Left: Viewport Switcher */}
          <div className="flex items-center gap-1 bg-token-bg p-1 rounded-xl border border-token-border shadow-inner">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewport === 'desktop'
                  ? 'bg-token-accent text-white font-bold shadow-sm'
                  : 'text-token-muted hover:text-token-text border border-transparent'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport('tablet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewport === 'tablet'
                  ? 'bg-token-accent text-white font-bold shadow-sm'
                  : 'text-token-muted hover:text-token-text border border-transparent'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewport === 'mobile'
                  ? 'bg-token-accent text-white font-bold shadow-sm'
                  : 'text-token-muted hover:text-token-text border border-transparent'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          {/* Center: Accent Color Palette Swatches & Light/Dark Mode Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Color Swatches */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-token-muted font-medium">
                <Palette className="w-3.5 h-3.5 text-token-accent" />
                <span className="hidden sm:inline">Accent:</span>
              </div>
              <div className="flex items-center gap-2 bg-token-bg px-2.5 py-1.5 rounded-xl border border-token-border shadow-inner">
                {COLOR_THEMES.map(theme => {
                  const isActive = currentAccent === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleColorChange(theme.id)}
                      title={`Accent: ${theme.name}`}
                      className={`relative w-5 h-5 rounded-full transition-all duration-150 flex items-center justify-center cursor-pointer ${
                        isActive 
                          ? 'ring-2 ring-token-text ring-offset-2 ring-offset-token-card scale-110 shadow-md' 
                          : 'opacity-70 hover:opacity-100 hover:scale-110'
                      }`}
                      style={{ backgroundColor: theme.color }}
                    >
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm inline-block" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Light / Dark Mode Switcher */}
            <div className="flex items-center gap-1 bg-token-bg p-1 rounded-xl border border-token-border shadow-inner">
              <button
                type="button"
                onClick={() => handleThemeModeChange('light')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  currentThemeMode === 'light'
                    ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40 shadow-sm font-bold'
                    : 'text-token-muted hover:text-token-text border border-transparent'
                }`}
                title="Switch preview to Light Mode"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Light</span>
              </button>
              <button
                type="button"
                onClick={() => handleThemeModeChange('dark')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  currentThemeMode === 'dark'
                    ? 'bg-token-accent/20 text-token-accent border border-token-accent/40 shadow-sm font-bold'
                    : 'text-token-muted hover:text-token-text border border-transparent'
                }`}
                title="Switch preview to Dark Mode"
              >
                <Moon className="w-3.5 h-3.5 text-token-accent" />
                <span className="hidden sm:inline">Dark</span>
              </button>
            </div>
          </div>

          {/* Right: In-place Edit & Fullscreen CTA */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditable(!isEditable)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isEditable 
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500 shadow-sm' 
                  : 'bg-token-bg border-token-border text-token-muted hover:text-token-text hover:bg-token-card-hover'
              }`}
            >
              <Edit3 className={`w-3.5 h-3.5 ${isEditable ? 'text-emerald-500' : 'text-token-muted'}`} />
              <span>{isEditable ? 'In-Place Edit: ON' : 'Enable In-Place Edit'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(ROUTES.PREVIEW, { tab: 'portfolio', template: selectedTemplate })}
              className="px-3.5 py-1.5 rounded-xl border border-token-border bg-token-bg hover:bg-token-card-hover text-xs font-semibold text-token-accent flex items-center gap-1.5 transition shadow-sm"
              title="Fullscreen portfolio preview & export"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>

        {/* 3. Interactive Responsive Canvas Frame */}
        <div className="w-full flex justify-center bg-token-bg p-3 sm:p-6 lg:p-8 rounded-3xl border border-token-border shadow-sm overflow-x-hidden transition-colors">
          <div className={`${viewportWidths[viewport]} max-w-full transition-all duration-300 ease-out rounded-2xl shadow-xl border border-token-border overflow-hidden ${
            currentThemeMode === 'dark' ? 'bg-[#0e1017]' : 'bg-slate-100'
          }`}>
            {/* Authentic Device Window Header */}
            <div className={`flex items-center justify-between px-4 py-2.5 border-b select-none text-xs transition-colors ${
              currentThemeMode === 'dark' ? 'bg-black/60 border-white/[0.08]' : 'bg-slate-200/90 border-slate-300 text-slate-700'
            }`}>
              {/* Window dots */}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              </div>

              {/* Address bar simulation */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-md border text-[11px] font-mono max-w-[280px] sm:max-w-xs truncate ${
                currentThemeMode === 'dark' 
                  ? 'bg-white/[0.04] border-white/[0.06] text-slate-400' 
                  : 'bg-white border-slate-300 text-slate-600 shadow-sm'
              }`}>
                <Lock className="w-3 h-3 text-cyan-500 flex-shrink-0" />
                <span className={`truncate ${currentThemeMode === 'dark' ? 'text-slate-300' : 'text-slate-800 font-medium'}`}>
                  {(profile.personal?.fullName || 'alexrivera').toLowerCase().replace(/\s+/g, '')}.dev/portfolio
                </span>
              </div>

              {/* Viewport & Theme badge */}
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider hidden sm:block ${
                  currentThemeMode === 'dark' ? 'text-slate-500' : 'text-slate-600'
                }`}>
                  {viewport === 'desktop' && 'Desktop'}
                  {viewport === 'tablet' && 'Tablet (768px)'}
                  {viewport === 'mobile' && 'Mobile (375px)'}
                </span>
              </div>
            </div>

            {/* Rendered Template with dynamic theme & accent */}
            <div className="min-h-[500px]">
              <PortfolioRenderer
                profile={profile}
                templateId={selectedTemplate}
                isEditable={isEditable}
                onProfileChange={handleProfileUpdate}
                themeMode={currentThemeMode}
                accentColor={currentAccent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}