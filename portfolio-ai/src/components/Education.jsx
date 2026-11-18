import React from 'react';
import { GraduationCap, Plus, Trash2, ArrowRight } from 'lucide-react';

export default function Education({
  education,
  onAddEducation,
  onUpdateEducation,
  onRemoveEducation,
  onBack,
  onNext
}) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-token-text flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-token-accent" />
            <span>Academic History</span>
          </h3>
          <p className="text-xs text-token-muted mt-0.5">
            Degrees, universities, graduating years, GPA, and academic honors.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddEducation}
          className="px-3.5 py-1.5 rounded-xl border border-token-border bg-token-card hover:bg-token-card-hover text-token-accent text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      {/* Education Cards */}
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div 
            key={edu.id || index} 
            className="p-6 rounded-2xl border border-token-border bg-token-card space-y-4 shadow-sm transition-all"
          >
            {/* Entry Header */}
            <div className="flex items-center justify-between pb-3 border-b border-token-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-token-accent font-mono tracking-wider">
                  #0{index + 1}
                </span>
                <span className="text-xs text-token-text font-medium">
                  {edu.institution || 'New Institution'}
                </span>
              </div>

              {education.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveEducation(index)}
                  className="text-token-muted hover:text-red-500 text-xs flex items-center gap-1 transition"
                  title="Remove this education entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {/* 2-Column Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-token-muted mb-1.5">
                  Institution / University
                </label>
                <input
                  type="text"
                  value={edu.institution || ''}
                  onChange={(e) => onUpdateEducation(index, 'institution', e.target.value)}
                  placeholder="e.g. University of California, Berkeley"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-token-muted mb-1.5">
                  Degree
                </label>
                <input
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => onUpdateEducation(index, 'degree', e.target.value)}
                  placeholder="e.g. Bachelor of Science (B.S.)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-token-muted mb-1.5">
                  Field of Study / Major
                </label>
                <input
                  type="text"
                  value={edu.fieldOfStudy || ''}
                  onChange={(e) => onUpdateEducation(index, 'fieldOfStudy', e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-token-muted mb-1.5">
                    Start
                  </label>
                  <input
                    type="text"
                    value={edu.startDate || ''}
                    onChange={(e) => onUpdateEducation(index, 'startDate', e.target.value)}
                    placeholder="2020"
                    className="w-full px-3 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-token-muted mb-1.5">
                    End / Expected
                  </label>
                  <input
                    type="text"
                    value={edu.endDate || ''}
                    onChange={(e) => onUpdateEducation(index, 'endDate', e.target.value)}
                    placeholder="2024"
                    className="w-full px-3 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-token-muted mb-1.5">
                    GPA
                  </label>
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => onUpdateEducation(index, 'gpa', e.target.value)}
                    placeholder="3.85"
                    className="w-full px-3 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent font-mono transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-token-muted mb-1.5">
                Academic Honors / Relevant Coursework
              </label>
              <input
                type="text"
                value={edu.highlights || ''}
                onChange={(e) => onUpdateEducation(index, 'highlights', e.target.value)}
                placeholder="e.g. Dean's Honor List (3 Semesters), Algorithms & Data Structures, Distributed Systems"
                className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
              />
            </div>
          </div>
        ))}
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
          <span>Next: Skills Matrix</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}