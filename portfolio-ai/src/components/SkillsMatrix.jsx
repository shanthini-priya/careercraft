import React from 'react';
import { Code, Sparkles, Plus, ArrowRight } from 'lucide-react';

export default function SkillsMatrix({
  skills,
  skillInput,
  onSkillInputChange,
  onAddSkill,
  onRemoveSkill,
  onRecommendSkills,
  isLoading,
  onBack,
  onNext
}) {
  const categories = [
    {
      key: 'technical',
      label: 'Design Specializations & Core Tech',
      placeholder: 'e.g. Graphic Design, Poster Design, Typography, HTML5, CSS3, JavaScript, React (Press Enter to add)'
    },
    {
      key: 'frameworks',
      label: 'UI/UX & Frontend Competencies',
      placeholder: 'e.g. Wireframing, Prototyping, Responsive Web Design, Design Systems (Press Enter to add)'
    },
    {
      key: 'tools',
      label: 'Design & Creative Tools',
      placeholder: 'e.g. Figma, Canva, Adobe Photoshop, Adobe Premiere Pro, Visily, GitHub (Press Enter to add)'
    },
    {
      key: 'soft',
      label: 'Core Professional Competencies',
      placeholder: 'e.g. Visual Storytelling, Color Theory, Visual Hierarchy, Team Collaboration'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Container Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-token-border bg-token-card shadow-sm space-y-6 transition-colors">
        {/* Header with Title & AI Recommendation CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-token-border">
          <div>
            <h3 className="text-base font-bold text-token-text flex items-center gap-2">
              <Code className="w-4 h-4 text-token-accent" />
              <span>Technical & Soft Skills Matrix</span>
            </h3>
            <p className="text-xs text-token-muted mt-0.5">
              Categorized skills parsed by applicant tracking systems and technical screeners.
            </p>
          </div>

          <button
            type="button"
            onClick={onRecommendSkills}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-xl border border-token-border bg-token-bg hover:bg-token-card-hover text-token-accent disabled:opacity-50 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm self-start sm:self-auto flex-shrink-0 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Recommending...' : 'AI Recommend Skills'}</span>
          </button>
        </div>

        {/* Skill Categories Grid */}
        <div className="space-y-5">
          {categories.map((cat) => {
            const list = skills[cat.key] || [];
            return (
              <div key={cat.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-token-muted">
                    {cat.label}
                  </label>
                  <span className="text-[11px] text-token-muted font-mono">
                    {list.length} added
                  </span>
                </div>

                {/* Pill Tags */}
                {list.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {list.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-token-bg border border-token-border text-xs font-medium text-token-text hover:border-token-accent transition-colors shadow-2xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => onRemoveSkill(cat.key, skill)}
                          className="text-token-muted hover:text-red-500 font-bold ml-0.5 transition-colors"
                          title="Remove skill"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Inline Add Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={skillInput[cat.key] || ''}
                    onChange={(e) => onSkillInputChange(cat.key, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        onAddSkill(cat.key);
                      }
                    }}
                    placeholder={cat.placeholder}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-token-border bg-token-bg text-token-text text-xs placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => onAddSkill(cat.key)}
                    className="px-3.5 py-2 rounded-xl border border-token-border bg-token-card hover:bg-token-card-hover text-token-accent font-semibold text-xs transition shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 inline mr-1" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
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
          <span>Next: Projects</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}