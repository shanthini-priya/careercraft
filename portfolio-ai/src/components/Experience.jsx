import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  Plus, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  FileText,
  MapPin,
  Calendar
} from 'lucide-react';
import { mockQuantifyBullet, hasQuantifiableMetric } from '../ai/adapter.js';

export default function Experience({
  experience = [],
  onAddExperience,
  onUpdateExperience,
  onRemoveExperience,
  onEnhanceExperience,
  onAutoQuantifyAll,
  targetRole,
  isLoading,
  onBack,
  onGoTemplates,
  onGoResume
}) {
  const [activeExpIndex, setActiveExpIndex] = useState(0);

  // Clamp index safely if list changes
  const currentIdx = Math.min(Math.max(activeExpIndex, 0), Math.max(experience.length - 1, 0));
  const currentExp = experience[currentIdx] || experience[0];

  const handleAdd = () => {
    onAddExperience();
    setActiveExpIndex(experience.length);
  };

  const handleRemove = (index) => {
    onRemoveExperience(index);
    if (activeExpIndex >= experience.length - 1) {
      setActiveExpIndex(Math.max(0, experience.length - 2));
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Top Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-token-text flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-token-accent/10 border border-token-border flex items-center justify-center text-token-accent">
              <Briefcase className="w-4 h-4" />
            </div>
            <span>Work & Internship Experience</span>
          </h3>
          <p className="text-xs text-token-muted mt-1">
            Showcase internships, research roles, and full-time experience with quantifiable metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
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
            <span>Add Experience</span>
          </button>
        </div>
      </div>

      {/* 2. Horizontal Experience Tab Selector */}
      {experience.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {experience.map((exp, idx) => {
            const isActive = idx === currentIdx;
            return (
              <button
                key={exp.id || idx}
                type="button"
                onClick={() => setActiveExpIndex(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-token-accent text-white font-bold shadow-sm'
                    : 'bg-token-card text-token-muted border-token-border hover:text-token-text hover:bg-token-card-hover'
                }`}
              >
                <span className={`font-mono text-[10px] ${isActive ? 'text-white' : 'text-token-accent'}`}>#0{idx + 1}</span>
                <span className="truncate max-w-[150px]">
                  {exp.company ? `${exp.company} (${exp.role || 'Role'})` : `Role #${idx + 1}`}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Streamlined Modular Card Layout */}
      {currentExp && (
        <div className="p-6 sm:p-8 rounded-2xl border border-token-border bg-token-card space-y-6 shadow-sm transition-all">
          {/* Card Sub-Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-token-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-token-accent font-mono tracking-wider">
                #0{currentIdx + 1}
              </span>
              <span className="text-sm font-bold text-token-text truncate max-w-xs sm:max-w-md">
                {currentExp.role || 'New Role'} {currentExp.company ? `at ${currentExp.company}` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEnhanceExperience(currentIdx)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-token-accent/10 hover:bg-token-accent/20 text-token-accent border border-token-border text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enhance Bullets (AI)</span>
              </button>

              {experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(currentIdx)}
                  className="text-token-muted hover:text-red-500 text-xs p-1.5 rounded-lg hover:bg-red-500/10 transition"
                  title="Remove this role"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Clean 2-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-token-muted mb-1.5">
                Company / Organization
              </label>
              <input
                type="text"
                value={currentExp.company || ''}
                onChange={(e) => onUpdateExperience(currentIdx, 'company', e.target.value)}
                placeholder="e.g. Stripe, NASA JPL, Stealth Startup"
                className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-token-muted mb-1.5">
                Job Title / Role
              </label>
              <input
                type="text"
                value={currentExp.role || ''}
                onChange={(e) => onUpdateExperience(currentIdx, 'role', e.target.value)}
                placeholder="e.g. Software Engineer Intern"
                className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-token-muted mb-1.5">
                Employment Type
              </label>
              <select
                value={currentExp.type || 'Internship'}
                onChange={(e) => onUpdateExperience(currentIdx, 'type', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
              >
                <option value="Internship" className="bg-token-bg text-token-text">Internship</option>
                <option value="Full-Time" className="bg-token-bg text-token-text">Full-Time</option>
                <option value="Part-Time" className="bg-token-bg text-token-text">Part-Time</option>
                <option value="Research Assistant" className="bg-token-bg text-token-text">Research Assistant</option>
                <option value="Contract / Freelance" className="bg-token-bg text-token-text">Contract / Freelance</option>
                <option value="Open Source Contributor" className="bg-token-bg text-token-text">Open Source Contributor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-token-muted mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-token-muted" />
                <span>Location</span>
              </label>
              <input
                type="text"
                value={currentExp.location || ''}
                onChange={(e) => onUpdateExperience(currentIdx, 'location', e.target.value)}
                placeholder="San Francisco, CA (or Remote)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-token-muted mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-token-muted" />
                <span>Start Date</span>
              </label>
              <input
                type="text"
                value={currentExp.startDate || ''}
                onChange={(e) => onUpdateExperience(currentIdx, 'startDate', e.target.value)}
                placeholder="June 2023"
                className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent font-mono transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-token-muted flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-token-muted" />
                  <span>End Date</span>
                </label>
                <label className="text-[11px] text-token-muted flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={currentExp.endDate?.toLowerCase() === 'present'}
                    onChange={(e) => onUpdateExperience(currentIdx, 'endDate', e.target.checked ? 'Present' : '')}
                    className="rounded border-token-border text-token-accent focus:ring-token-accent"
                  />
                  <span>Currently work here</span>
                </label>
              </div>
              <input
                type="text"
                value={currentExp.endDate || ''}
                disabled={currentExp.endDate?.toLowerCase() === 'present'}
                onChange={(e) => onUpdateExperience(currentIdx, 'endDate', e.target.value)}
                placeholder="August 2023 or Present"
                className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent font-mono transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Key Achievements & Bullets */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-bold text-token-text uppercase tracking-wider">
                Key Impact & Achievements (Google XYZ Formula)
              </label>
              <button
                type="button"
                onClick={() => {
                  const updated = [...(currentExp.bullets || []), ''];
                  onUpdateExperience(currentIdx, 'bullets', updated);
                }}
                className="text-xs text-token-accent font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>

            <div className="space-y-3">
              {(currentExp.bullets || []).map((bullet, bIndex) => {
                const hasMetric = hasQuantifiableMetric(bullet);
                return (
                  <div key={bIndex} className="p-3.5 rounded-xl border border-token-border bg-token-bg space-y-2.5">
                    <div className="flex gap-2.5 items-start">
                      <span className="text-xs text-token-muted font-mono pt-2">•</span>
                      <textarea
                        rows={2}
                        value={bullet || ''}
                        onChange={(e) => {
                          const updated = [...currentExp.bullets];
                          updated[bIndex] = e.target.value;
                          onUpdateExperience(currentIdx, 'bullets', updated);
                        }}
                        placeholder="Built [feature] using [stack], reducing [metric] by [X]%..."
                        className="flex-1 px-3.5 py-2 rounded-xl border border-token-border bg-token-card text-token-text text-xs sm:text-sm font-sans placeholder:text-token-muted focus:outline-none focus:border-token-accent transition-all"
                      />
                      {currentExp.bullets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = currentExp.bullets.filter((_, i) => i !== bIndex);
                            onUpdateExperience(currentIdx, 'bullets', updated);
                          }}
                          className="text-token-muted hover:text-red-500 p-1 rounded-md transition pt-1.5"
                          title="Remove bullet"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Quick Metric Helpers */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-token-border text-[11px]">
                      <div className="flex flex-wrap items-center gap-1.5 text-token-muted">
                        <span className="text-[10px] font-medium">Quick Metric:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const base = (bullet || '').trim().replace(/[.,;]+$/, '');
                            const updated = [...currentExp.bullets];
                            updated[bIndex] = `${base}, reducing CI/CD pipeline build time by 42%.`;
                            onUpdateExperience(currentIdx, 'bullets', updated);
                          }}
                          className="px-2 py-0.5 rounded bg-token-card hover:bg-token-card-hover border border-token-border text-[10px] font-mono text-token-text transition"
                        >
                          + 42% build time
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const base = (bullet || '').trim().replace(/[.,;]+$/, '');
                            const updated = [...currentExp.bullets];
                            updated[bIndex] = `${base}, processing 25,000+ daily events.`;
                            onUpdateExperience(currentIdx, 'bullets', updated);
                          }}
                          className="px-2 py-0.5 rounded bg-token-card hover:bg-token-card-hover border border-token-border text-[10px] font-mono text-token-text transition"
                        >
                          + 25k daily events
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const base = (bullet || '').trim().replace(/[.,;]+$/, '');
                            const updated = [...currentExp.bullets];
                            updated[bIndex] = `${base}, increasing test code coverage from 62% to 94%.`;
                            onUpdateExperience(currentIdx, 'bullets', updated);
                          }}
                          className="px-2 py-0.5 rounded bg-token-card hover:bg-token-card-hover border border-token-border text-[10px] font-mono text-token-text transition"
                        >
                          + 94% coverage
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
                              const updated = [...currentExp.bullets];
                              updated[bIndex] = mockQuantifyBullet(bullet, targetRole, bIndex);
                              onUpdateExperience(currentIdx, 'bullets', updated);
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

      {/* 4. Bottom Footer Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-token-border bg-token-card hover:bg-token-card-hover text-xs font-semibold text-token-text transition shadow-sm"
        >
          Back to Projects
        </button>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onGoResume}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-token-border bg-token-card hover:bg-token-card-hover text-token-text font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-token-accent" />
            <span>Open ATS Resume</span>
          </button>

          <button
            type="button"
            onClick={onGoTemplates}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-token-accent hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Select Web Template</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}