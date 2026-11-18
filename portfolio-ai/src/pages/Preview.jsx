import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Layout,
  Printer,
  Download,
  Upload,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Copy,
  Check,
  ChevronDown,
  Palette,
  ExternalLink,
  Lock,
  Globe,
  Share2,
  Sun,
  Moon
} from 'lucide-react';
import {
  getProfile,
  saveProfile,
  getSelectedTemplate,
  saveSelectedTemplate,
  getSettings,
  saveSettings,
  exportProfileAsJson,
  importProfileFromJson
} from '../storage.js';
import { analyzeAtsScore, autoQuantifyAllBullets } from '../ai/adapter.js';
import { PortfolioRenderer, TEMPLATES, COLOR_THEMES, ACCENT_STYLES } from './Templates.jsx';
import ResumeExport from '../components/ResumeExport.jsx';
import { navigate, getRouteParams, ROUTES } from '../router.js';

export default function Preview() {
  const [profile, setProfile] = useState(() => getProfile());
  const [templateId, setTemplateId] = useState(() => getSelectedTemplate() || 'tech-slate');
  const [settings, setSettings] = useState(() => getSettings());
  const [activeView, setActiveView] = useState(() => {
    const params = getRouteParams();
    return params.tab === 'portfolio' ? 'portfolio' : 'resume';
  });
  const [resumeDensity, setResumeDensity] = useState('normal'); // 'normal' | 'compact'
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [atsScore, setAtsScore] = useState(() => analyzeAtsScore(getProfile()));

  const exportDropdownRef = useRef(null);

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

  // Update ATS score whenever profile changes
  useEffect(() => {
    const score = analyzeAtsScore(profile);
    setAtsScore(score);
  }, [profile]);

  // Handle Hash parameter changes
  useEffect(() => {
    const params = getRouteParams();
    if (params.tab) {
      setActiveView(params.tab);
    }
    if (params.template) {
      setTemplateId(params.template);
    }
  }, []);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target)) {
        setIsExportMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle Template change
  const handleSelectTemplate = (id) => {
    setTemplateId(id);
    saveSelectedTemplate(id);
  };

  // Handle Accent Color change
  const handleColorChange = (colorId) => {
    const updated = { ...settings, accentColor: colorId };
    setSettings(updated);
    saveSettings(updated);
  };

  // Handle Theme Mode toggle
  const handleThemeModeChange = (mode) => {
    const updated = { ...settings, theme: mode };
    setSettings(updated);
    saveSettings(updated);
  };

  // 1-Click Print / Save PDF
  const handlePrint = () => {
    window.print();
  };

  // 1-Click Auto-Fix Quantifiable Metrics
  const handleAutoFixMetrics = () => {
    const { updatedProfile } = autoQuantifyAllBullets(profile);
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
    const newScore = analyzeAtsScore(updatedProfile);
    setAtsScore(newScore);
  };

  const currentAccent = settings.accentColor || 'cyan';
  const currentThemeMode = settings.theme || 'dark';
  const accentObj = ACCENT_STYLES[currentAccent] || ACCENT_STYLES.cyan;
  const isDark = currentThemeMode === 'dark';

  // Export standalone single-file HTML portfolio
  const handleExportHtml = () => {
    setIsExportMenuOpen(false);
    const personal = profile.personal || {};
    const primaryHex = isDark ? accentObj.primaryHex : accentObj.primaryLightHex;
    const bodyBg = isDark ? '#090b14' : '#f8fafc';
    const bodyText = isDark ? '#f8fafc' : '#0f172a';
    const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';

    const htmlContent = `<!DOCTYPE html>
<html lang="en" class="${isDark ? 'dark' : 'light'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personal.fullName || 'Portfolio'} — ${personal.targetRole || 'Career Portfolio'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --primary: ${primaryHex};
    }
    body { 
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background-color: ${bodyBg};
      color: ${bodyText};
    }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .text-accent { color: var(--primary); }
    .bg-accent { background-color: var(--primary); }
    .border-accent { border-color: var(--primary); }
  </style>
</head>
<body class="min-h-screen selection:bg-[var(--primary)] selection:text-white transition-colors duration-200">
  <div class="max-w-4xl mx-auto px-6 py-16 space-y-16">
    <!-- Header -->
    <header class="border-b pb-10 space-y-4" style="border-color: ${borderColor};">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-4xl font-extrabold tracking-tight">${personal.fullName || 'M. Shanthini Priya'}</h1>
          <p class="text-lg font-semibold mt-1 text-accent">${personal.targetRole || 'Graphic Designer | UI/UX Designer | Frontend Developer'}</p>
        </div>
        <div class="text-xs opacity-75 space-y-1">
          ${personal.location ? `<div>📍 ${personal.location}</div>` : ''}
          ${personal.email ? `<div>✉️ <a href="mailto:${personal.email}" class="text-accent hover:underline">${personal.email}</a></div>` : ''}
          ${personal.phone ? `<div>📞 ${personal.phone}</div>` : ''}
        </div>
      </div>
      <p class="text-sm opacity-85 leading-relaxed max-w-2xl pt-2">${profile.summary || personal.bio || ''}</p>
      <div class="flex flex-wrap gap-3 pt-2 text-xs">
        ${personal.github ? `<a href="${personal.github}" target="_blank" class="px-3 py-1.5 rounded-lg border font-medium hover:opacity-80 transition" style="border-color: ${borderColor}; background-color: ${cardBg};">GitHub</a>` : ''}
        ${personal.linkedin ? `<a href="${personal.linkedin}" target="_blank" class="px-3 py-1.5 rounded-lg border font-medium hover:opacity-80 transition" style="border-color: ${borderColor}; background-color: ${cardBg};">LinkedIn</a>` : ''}
        ${personal.website ? `<a href="${personal.website}" target="_blank" class="px-3 py-1.5 rounded-lg border font-medium hover:opacity-80 transition" style="border-color: ${borderColor}; background-color: ${cardBg};">Portfolio</a>` : ''}
      </div>
    </header>

    <!-- Projects -->
    <section class="space-y-6">
      <h2 class="text-xs font-bold uppercase tracking-widest text-accent font-mono">01 // Featured Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${(profile.projects || []).map(p => `
          <div class="p-6 rounded-2xl border space-y-3" style="border-color: ${borderColor}; background-color: ${cardBg};">
            <div class="flex justify-between items-start">
              <h3 class="font-bold text-base">${p.title}</h3>
              ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" class="text-xs text-accent hover:underline">Demo ↗</a>` : ''}
            </div>
            <p class="text-xs font-mono text-accent">${p.role || ''}</p>
            <p class="text-xs opacity-75 leading-relaxed">${p.description || ''}</p>
            <div class="flex flex-wrap gap-1.5 pt-2">
              ${(p.techStack || []).map(t => `<span class="text-[10px] px-2 py-0.5 rounded font-mono border" style="border-color: ${borderColor};">${t}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Experience & Education -->
    <section class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-10" style="border-color: ${borderColor};">
      <div class="space-y-4">
        <h2 class="text-xs font-bold uppercase tracking-widest text-accent font-mono">02 // Experience</h2>
        ${(profile.experience || []).map(e => `
          <div class="space-y-1 border-l-2 pl-4 text-xs" style="border-color: ${borderColor};">
            <span class="opacity-60 font-mono">${e.startDate} - ${e.endDate}</span>
            <h4 class="font-bold text-sm">${e.role}</h4>
            <p class="text-accent font-medium">${e.company} • ${e.type}</p>
            <ul class="opacity-75 space-y-1 list-disc list-inside pt-1">
              ${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <div class="space-y-6">
        <div class="space-y-4">
          <h2 class="text-xs font-bold uppercase tracking-widest text-accent font-mono">03 // Education</h2>
          ${(profile.education || []).map(ed => `
            <div class="space-y-1 border-l-2 pl-4 text-xs" style="border-color: ${borderColor};">
              <span class="opacity-60 font-mono">${ed.startDate} - ${ed.endDate}</span>
              <h4 class="font-bold text-sm">${ed.degree} in ${ed.fieldOfStudy}</h4>
              <p class="opacity-75">${ed.institution} ${ed.gpa ? `• GPA: ${ed.gpa}` : ''}</p>
            </div>
          `).join('')}
        </div>

        <div class="space-y-2">
          <h2 class="text-xs font-bold uppercase tracking-widest text-accent font-mono">04 // Core Skills</h2>
          <div class="flex flex-wrap gap-1.5">
            ${[...(profile.skills?.technical || []), ...(profile.skills?.frameworks || [])].map(s => `
              <span class="text-xs px-2.5 py-1 rounded border" style="border-color: ${borderColor}; background-color: ${cardBg};">${s}</span>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t pt-8 text-center text-xs opacity-60" style="border-color: ${borderColor};">
      Generated with PortfolioAI — Self-contained static asset ready for hosting.
    </footer>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const name = (personal.fullName || 'portfolio').toLowerCase().replace(/\s+/g, '-');
    a.download = `${name}-portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy resume as plain Markdown
  const handleCopyMarkdown = () => {
    setIsExportMenuOpen(false);
    const p = profile;
    const md = `# ${p.personal?.fullName || 'Full Name'}
${p.personal?.targetRole || ''}
${[p.personal?.email, p.personal?.phone, p.personal?.location, p.personal?.linkedin, p.personal?.github].filter(Boolean).join(' | ')}

## PROFESSIONAL SUMMARY
${p.summary || ''}

## EDUCATION
${(p.education || []).map(e => `* **${e.degree} in ${e.fieldOfStudy}**, ${e.institution} (${e.startDate} - ${e.endDate})${e.gpa ? ` - GPA: ${e.gpa}` : ''}\n  ${e.highlights || ''}`).join('\n\n')}

## TECHNICAL SKILLS
* **Languages & Core**: ${(p.skills?.technical || []).join(', ')}
* **Frameworks & Libraries**: ${(p.skills?.frameworks || []).join(', ')}
* **Tools & Platforms**: ${(p.skills?.tools || []).join(', ')}
* **Core Competencies**: ${(p.skills?.soft || []).join(', ')}

## FEATURED PROJECTS
${(p.projects || []).map(proj => `### ${proj.title} [${(proj.techStack || []).join(', ')}]
${proj.liveUrl || proj.githubUrl || ''}
${(proj.bullets || []).map(b => `* ${b}`).join('\n')}`).join('\n\n')}

## EXPERIENCE
${(p.experience || []).map(exp => `### ${exp.role} — ${exp.company} (${exp.startDate} - ${exp.endDate})
${(exp.bullets || []).map(b => `* ${b}`).join('\n')}`).join('\n\n')}
`;

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  // Import JSON handler
  const handleFileInputChange = async (e) => {
    setIsExportMenuOpen(false);
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importProfileFromJson(file);
      setProfile(imported);
      alert('Profile successfully imported!');
    } catch (err) {
      alert('Error importing JSON: ' + err.message);
    }
  };

  const activeTemplateObj = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[1];

  return (
    <div className="min-h-screen bg-token-bg text-token-text pb-20 selection:bg-token-accent selection:text-white transition-colors duration-200">
      {/* Background Atmosphere Glows */}
      <div className="no-print fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-30 dark:opacity-100 transition-opacity">
        <div className="absolute top-[8%] left-[20%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[10%] w-[450px] h-[450px] bg-purple-600/5 rounded-full blur-[150px]" />
      </div>

      {/* 1. Unified Action Toolbar (Hidden during print) */}
      <div className="no-print max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 space-y-3">
        {/* Tier 1: Primary Navigation, View Switcher & Core Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-token-border">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(ROUTES.PROFILE)}
              className="p-2.5 rounded-xl border border-token-border bg-token-card hover:bg-token-card-hover text-token-text transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Back to profile editor"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-token-text flex items-center gap-2">
                <span>Career Assets Preview</span>
              </h1>
              <p className="text-xs text-token-muted mt-0.5">
                ATS-compliant resume & responsive web portfolio ready for export.
              </p>
            </div>
          </div>

          {/* Primary View Switcher & Context Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Switcher Tabs */}
            <div className="flex p-1 rounded-xl bg-token-bg border border-token-border shadow-inner">
              <button
                onClick={() => setActiveView('resume')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeView === 'resume'
                  ? 'bg-token-accent text-white font-bold shadow-sm'
                  : 'text-token-muted hover:text-token-text border border-transparent'
                  }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>ATS Resume</span>
              </button>

              <button
                onClick={() => setActiveView('portfolio')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeView === 'portfolio'
                  ? 'bg-token-accent text-white font-bold shadow-sm'
                  : 'text-token-muted hover:text-token-text border border-transparent'
                  }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Web Portfolio</span>
              </button>
            </div>

            {/* Resume Density Toggle */}
            {activeView === 'resume' && (
              <button
                onClick={() => setResumeDensity(resumeDensity === 'normal' ? 'compact' : 'normal')}
                className="px-3 py-1.5 rounded-xl border border-token-border bg-token-card hover:bg-token-card-hover text-xs font-semibold text-token-text transition shadow-sm cursor-pointer"
                title="Toggle font density for 1-page fit"
              >
                {resumeDensity === 'normal' ? 'Density: Normal' : 'Density: Compact'}
              </button>
            )}

            {/* Web Portfolio In-Situ Template & Accent Switchers */}
            {activeView === 'portfolio' && (
              <div className="flex flex-wrap items-center gap-2">
                {/* Theme Selector */}
                <div className="relative inline-block">
                  <select
                    value={templateId}
                    onChange={(e) => handleSelectTemplate(e.target.value)}
                    className="px-3 py-1.5 pr-8 rounded-xl border border-token-border bg-token-card hover:bg-token-card-hover text-xs font-semibold text-token-text transition shadow-sm appearance-none cursor-pointer focus:outline-none focus:border-token-accent"
                    title="Switch portfolio theme"
                  >
                    {TEMPLATES.map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id} className="bg-token-card text-token-text">
                        {tmpl.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-token-muted pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* Accent Color Swatches */}
                <div className="flex items-center gap-1.5 bg-token-bg px-2 py-1 rounded-xl border border-token-border shadow-inner">
                  {COLOR_THEMES.map(theme => {
                    const isActive = currentAccent === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => handleColorChange(theme.id)}
                        title={`Accent: ${theme.name}`}
                        className={`relative rounded-full transition-all duration-150 flex items-center justify-center cursor-pointer ${isActive
                          ? 'ring-2 ring-token-text ring-offset-2 ring-offset-token-card scale-110 shadow-md'
                          : 'opacity-70 hover:opacity-100 hover:scale-110'
                          }`}
                        style={{ backgroundColor: theme.color, width: '18px', height: '18px' }}
                      >
                        {isActive && <span className="w-1 h-1 rounded-full bg-white shadow-sm inline-block" />}
                      </button>
                    );
                  })}
                </div>

                {/* Light / Dark Mode Toggle */}
                <div className="flex items-center gap-1 bg-token-bg p-1 rounded-xl border border-token-border shadow-inner">
                  <button
                    type="button"
                    onClick={() => handleThemeModeChange('light')}
                    className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentThemeMode === 'light'
                      ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40 shadow-sm font-bold'
                      : 'text-token-muted hover:text-token-text border border-transparent'
                      }`}
                    title="Switch preview to Light Mode"
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleThemeModeChange('dark')}
                    className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentThemeMode === 'dark'
                      ? 'bg-token-accent/20 text-token-accent border border-token-accent/40 shadow-sm font-bold'
                      : 'text-token-muted hover:text-token-text border border-transparent'
                      }`}
                    title="Switch preview to Dark Mode"
                  >
                    <Moon className="w-3.5 h-3.5 text-token-accent" />
                  </button>
                </div>
              </div>
            )}

            {/* Compact Export & Share Dropdown Menu */}
            <div className="relative inline-block" ref={exportDropdownRef}>
              <button
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="px-3.5 py-1.5 rounded-xl border border-token-border bg-token-card hover:bg-token-card-hover text-xs font-semibold text-token-text flex items-center gap-1.5 transition shadow-sm active:scale-95 cursor-pointer"
                title="Export and sharing options"
              >
                <Share2 className="w-3.5 h-3.5 text-token-accent" />
                <span>Export & Share</span>
                <ChevronDown className={`w-3.5 h-3.5 text-token-muted transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Floating Panel */}
              {isExportMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-token-border bg-token-card shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={handleExportHtml}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-token-text hover:bg-token-card-hover flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-token-accent flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Download HTML</div>
                      <div className="text-[10px] text-token-muted">Standalone styled site</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      exportProfileAsJson(profile);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-token-text hover:bg-token-card-hover flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Export JSON Backup</div>
                      <div className="text-[10px] text-token-muted">Full profile data</div>
                    </div>
                  </button>

                  <label className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-token-text hover:bg-token-card-hover flex items-center gap-2.5 transition cursor-pointer">
                    <Upload className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Import JSON</div>
                      <div className="text-[10px] text-token-muted">Restore from file</div>
                    </div>
                    <input type="file" accept=".json" onChange={handleFileInputChange} className="hidden" />
                  </label>

                  <button
                    onClick={handleCopyMarkdown}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-token-text hover:bg-token-card-hover flex items-center gap-2.5 transition cursor-pointer"
                  >
                    {copiedMarkdown ? (
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Copy className="w-4 h-4 text-token-muted flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold">{copiedMarkdown ? 'Copied!' : 'Copy Markdown'}</div>
                      <div className="text-[10px] text-token-muted">Plaintext ATS resume</div>
                    </div>
                  </button>

                  <div className="my-1 border-t border-token-border" />

                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      handlePrint();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-token-text hover:bg-token-card-hover flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-token-accent flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Print / Save PDF</div>
                      <div className="text-[10px] text-token-muted">Direct browser print</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-token-accent hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Streamlined Privacy Guarantee Row */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl border border-token-border bg-token-card text-[11px] font-mono text-token-muted">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-token-accent inline-block animate-pulse" />
            <span className="text-token-text">100% Client-Side Privacy: LocalStorage Encrypted • No Remote Storage</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-token-muted text-[10px]">
            <span>Theme: {activeTemplateObj.name} ({currentAccent.toUpperCase()} • {currentThemeMode.toUpperCase()})</span>
          </div>
        </div>

        {/* 2. Compact ATS Compliance Banner (Resume View Only) */}
        {activeView === 'resume' && (
          <div className="p-3.5 sm:p-4 rounded-2xl border border-token-border bg-token-card shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 font-extrabold flex items-center justify-center text-sm font-mono border border-emerald-500/30 shadow-sm flex-shrink-0">
                {atsScore.score}%
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-token-text">ATS Compatibility:</span>
                  <span className="text-xs font-bold font-mono text-emerald-500">{atsScore.rating}</span>
                  <span className="text-xs text-token-muted">•</span>
                  <span className="text-xs text-token-muted">{atsScore.metricsFound} of {atsScore.totalBullets} metrics included</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {atsScore.strengths.slice(0, 2).map((s, idx) => (
                    <span key={idx} className="text-[11px] text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{s}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-auto flex-shrink-0">
              {atsScore.improvements.some(imp => imp.toLowerCase().includes('metric') || imp.toLowerCase().includes('quantifiable')) && (
                <button
                  type="button"
                  onClick={handleAutoFixMetrics}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-500 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Auto-Fix Metrics (AI)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => navigate(ROUTES.PROFILE)}
                className="text-xs font-semibold text-token-accent hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Edit in Profile</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Document Preview Frame: ATS-Friendly Resume Sheet */}
      {activeView === 'resume' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-4">
          <ResumeExport profile={profile} density={resumeDensity} />
        </div>
      )}

      {/* 4. Web Portfolio Preview Container: Authentic Browser Chassis */}
      {activeView === 'portfolio' && (
        <div className="max-w-6xl mx-auto px-3 sm:px-6 mt-4">
          <div className={`rounded-2xl sm:rounded-3xl border shadow-xl overflow-hidden transition-colors ${isDark ? 'border-token-border bg-[#0c0e14]' : 'border-token-border bg-slate-100 shadow-xl'
            }`}>
            {/* Minimalist Browser Window Bar */}
            <div className={`flex items-center justify-between px-4 py-3 border-b select-none text-xs transition-colors ${isDark ? 'bg-black/60 border-white/[0.08]' : 'bg-slate-200/90 border-slate-300 text-slate-700'
              }`}>
              {/* macOS Window Controls */}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              </div>

              {/* Clean Simulated SSL URL Bar */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[11px] font-mono max-w-[260px] sm:max-w-xs truncate ${isDark ? 'bg-white/[0.04] border-white/[0.06] text-slate-400' : 'bg-white border-slate-300 text-slate-700 shadow-sm'
                }`}>
                <Lock className="w-3 h-3 text-cyan-500 flex-shrink-0" />
                <span className={`truncate ${isDark ? 'text-slate-300' : 'text-slate-800 font-medium'}`}>
                  https://{(profile.personal?.fullName || 'alexrivera').toLowerCase().replace(/\s+/g, '')}.dev
                </span>
              </div>

              {/* Active Theme Badge & Quick Action */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium hidden sm:inline-flex items-center gap-1">
                  <Palette className="w-3 h-3 text-token-accent" />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700 font-semibold'}>{activeTemplateObj.name}</span>
                </span>
                <button
                  onClick={handleExportHtml}
                  className="px-2.5 py-1 rounded-lg border border-token-border bg-token-card hover:bg-token-card-hover text-[11px] font-semibold text-token-accent flex items-center gap-1 transition shadow-sm cursor-pointer"
                  title="Download static HTML file of this portfolio"
                >
                  <Download className="w-3 h-3" />
                  <span className="hidden xs:inline">HTML</span>
                </button>
              </div>
            </div>

            {/* Inner Portfolio Frame with dynamic theme & accent */}
            <div className="w-full overflow-x-hidden min-h-[500px]">
              <PortfolioRenderer
                profile={profile}
                templateId={templateId}
                isEditable={false}
                themeMode={currentThemeMode}
                accentColor={currentAccent}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
