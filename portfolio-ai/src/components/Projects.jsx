import React, { useState } from 'react';
import { 
  FolderGit2, 
  Sparkles, 
  Plus, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  Code
} from 'lucide-react';
import { GithubIcon } from './Icons.jsx';
import { mockQuantifyBullet, hasQuantifiableMetric } from '../ai/adapter.js';

export default function Projects({
  projects,
  onAddProject,
  onUpdateProject,
  onRemoveProject,
  onEnhanceProject,
  onAutoQuantifyAll,
  targetRole,
  isLoading,
  onBack,
  onNext
}) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  // Clamp index if projects change
  const currentIdx = Math.min(Math.max(activeProjectIndex, 0), Math.max(projects.length - 1, 0));
  const currentProj = projects[currentIdx] || projects[0];

  const handleAdd = () => {
    onAddProject();
    setActiveProjectIndex(projects.length);
  };

  const handleRemove = (index) => {
    onRemoveProject(index);
    if (activeProjectIndex >= projects.length - 1) {
      setActiveProjectIndex(Math.max(0, projects.length - 2));
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h3 className="text-base font-bold text-token-text flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-token-accent" />
            <span>Featured Technical Projects</span>
          </h3>
          <p className="text-xs text-token-muted mt-0.5">
            Showcase your best builds with Google XYZ metrics and live links.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={onAutoQuantifyAll}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Auto-Fix All Metrics</span>
          </button>

          <button
            type="button"
            onClick={handleAdd}
            className="px-3.5 py-1.5 rounded-xl border border-token-border bg-token-card hover:bg-token-card-hover text-token-accent text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Project Selector Tabs */}
      {projects.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {projects.map((proj, pIdx) => {
            const isActive = pIdx === currentIdx;
            const hasTitle = proj.title && proj.title.trim().length > 0;
            return (
              <button
                key={proj.id || pIdx}
                type="button"
                onClick={() => setActiveProjectIndex(pIdx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-token-accent text-white font-bold shadow-sm'
                    : 'bg-token-card text-token-muted border-token-border hover:text-token-text hover:bg-token-card-hover'
                }`}
              >
                <span className={`font-mono text-[10px] ${isActive ? 'text-white' : 'text-token-accent'}`}>#0{pIdx + 1}</span>
                <span className="truncate max-w-[150px]">
                  {hasTitle ? proj.title : `Project ${pIdx + 1}`}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Project Editor Card */}
      {currentProj && (
        <div className="p-6 sm:p-8 rounded-2xl border border-token-border bg-token-card space-y-6 shadow-sm transition-all">
          {/* Card Top Row */}
          <div className="flex items-center justify-between pb-3 border-b border-token-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-token-accent font-mono tracking-wider">
                #0{currentIdx + 1}
              </span>
              <span className="text-sm font-bold text-token-text truncate max-w-xs">
                {currentProj.title || 'Untitled Project'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEnhanceProject(currentIdx)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-token-accent/10 hover:bg-token-accent/20 text-token-accent border border-token-border text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enhance Bullets (AI)</span>
              </button>

              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(currentIdx)}
                  className="text-token-muted hover:text-red-500 text-xs p-1.5 rounded-lg hover:bg-red-500/10 transition"
                  title="Delete this project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 2-Column Responsive Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-token-muted mb-1.5">
                Project Title
              </label>
              <input
                type="text"
                value={currentProj.title || ''}
                onChange={(e) => onUpdateProject(currentIdx, 'title', e.target.value)}
                placeholder="e.g. Poster Design Series or Restaurant Website UI"
                className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-token-muted mb-1.5">
                Your Role / Headline
              </label>
              <input
                type="text"
                value={currentProj.role || ''}
                onChange={(e) => onUpdateProject(currentIdx, 'role', e.target.value)}
                placeholder="e.g. Lead Full-Stack Developer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-token-muted mb-1.5 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-token-muted" />
                <span>Live Demo URL</span>
              </label>
              <input
                type="url"
                value={currentProj.liveUrl || ''}
                onChange={(e) => onUpdateProject(currentIdx, 'liveUrl', e.target.value)}
                placeholder="https://myproject.web.app"
                className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-token-muted mb-1.5 flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5 text-token-muted" />
                <span>GitHub Repository URL</span>
              </label>
              <input
                type="url"
                value={currentProj.githubUrl || ''}
                onChange={(e) => onUpdateProject(currentIdx, 'githubUrl', e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
              />
            </div>
          </div>

          {/* Tech Stack Input */}
          <div>
            <label className="block text-xs font-semibold text-token-muted mb-1.5">
              Tech Stack (comma separated)
            </label>
            <input
              type="text"
              value={Array.isArray(currentProj.techStack) ? currentProj.techStack.join(', ') : currentProj.techStack || ''}
              onChange={(e) => {
                const tags = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                onUpdateProject(currentIdx, 'techStack', tags);
              }}
              placeholder="React, TypeScript, Node.js, PostgreSQL, Docker"
              className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-token-muted mb-1.5">
              Description & Highlights
            </label>
            <textarea
              rows={2}
              value={currentProj.description || ''}
              onChange={(e) => onUpdateProject(currentIdx, 'description', e.target.value)}
              placeholder="1-2 sentences on core functionality, technical problems resolved, and architecture."
              className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
            />
          </div>

          {/* Google XYZ Formula Bullets */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-bold text-token-text uppercase tracking-wider">
                Google XYZ Formula Resume Bullets
              </label>
              <button
                type="button"
                onClick={() => {
                  const updated = [...(currentProj.bullets || []), ''];
                  onUpdateProject(currentIdx, 'bullets', updated);
                }}
                className="text-xs text-token-accent font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>

            <div className="space-y-3">
              {(currentProj.bullets || []).map((bullet, bIndex) => {
                const hasMetric = hasQuantifiableMetric(bullet);
                return (
                  <div key={bIndex} className="p-3.5 rounded-xl border border-token-border bg-token-bg space-y-2.5">
                    <div className="flex gap-2.5 items-start">
                      <span className="text-xs text-token-muted font-mono pt-2">•</span>
                      <textarea
                        rows={2}
                        value={bullet || ''}
                        onChange={(e) => {
                          const updated = [...currentProj.bullets];
                          updated[bIndex] = e.target.value;
                          onUpdateProject(currentIdx, 'bullets', updated);
                        }}
                        placeholder="Architected [feature] using [tech], improving [metric] by [X]%..."
                        className="flex-1 px-3.5 py-2 rounded-xl border border-token-border bg-token-card text-token-text text-xs sm:text-sm font-sans placeholder:text-token-muted focus:outline-none focus:border-token-accent transition-all"
                      />
                      {currentProj.bullets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = currentProj.bullets.filter((_, i) => i !== bIndex);
                            onUpdateProject(currentIdx, 'bullets', updated);
                          }}
                          className="text-token-muted hover:text-red-500 p-1 rounded-md transition pt-1.5"
                          title="Remove bullet"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Metric Helpers & Health Indicator */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-token-border text-[11px]">
                      <div className="flex flex-wrap items-center gap-1.5 text-token-muted">
                        <span className="text-[10px] font-medium">Quick Metric:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const base = (bullet || '').trim().replace(/[.,;]+$/, '');
                            const updated = [...currentProj.bullets];
                            updated[bIndex] = `${base}, reducing API response latency by 35%.`;
                            onUpdateProject(currentIdx, 'bullets', updated);
                          }}
                          className="px-2 py-0.5 rounded bg-token-card hover:bg-token-card-hover border border-token-border text-[10px] font-mono text-token-text transition"
                        >
                          + 35% latency
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const base = (bullet || '').trim().replace(/[.,;]+$/, '');
                            const updated = [...currentProj.bullets];
                            updated[bIndex] = `${base}, supporting 1,500+ active users.`;
                            onUpdateProject(currentIdx, 'bullets', updated);
                          }}
                          className="px-2 py-0.5 rounded bg-token-card hover:bg-token-card-hover border border-token-border text-[10px] font-mono text-token-text transition"
                        >
                          + 1,500+ users
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const base = (bullet || '').trim().replace(/[.,;]+$/, '');
                            const updated = [...currentProj.bullets];
                            updated[bIndex] = `${base}, boosting Lighthouse performance to 98/100.`;
                            onUpdateProject(currentIdx, 'bullets', updated);
                          }}
                          className="px-2 py-0.5 rounded bg-token-card hover:bg-token-card-hover border border-token-border text-[10px] font-mono text-token-text transition"
                        >
                          + 98/100 score
                        </button>
                      </div>

                      <div>
                        {hasMetric ? (
                          <span className="text-emerald-500 flex items-center gap-1 text-[11px] font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Metric Included
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...currentProj.bullets];
                              updated[bIndex] = mockQuantifyBullet(bullet, targetRole, bIndex);
                              onUpdateProject(currentIdx, 'bullets', updated);
                            }}
                            className="text-amber-500 hover:underline flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" /> Auto-Add Metric
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-token-border bg-token-card hover:bg-token-card-hover text-xs font-semibold text-token-text transition shadow-sm"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-token-accent hover:opacity-90 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
        >
          <span>Next: Experience</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}