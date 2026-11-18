import React from 'react';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

export default function AISummary({
  summary,
  onChange,
  onGenerate,
  isLoading,
  onBack,
  onNext
}) {
  const wordCount = summary ? summary.trim().split(/\s+/).filter(Boolean).length : 0;
  const isOptimal = wordCount >= 40 && wordCount <= 75;

  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-2xl border border-token-border bg-token-card shadow-sm space-y-5 transition-colors">
        {/* Header with Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h3 className="text-base font-bold text-token-text flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-token-accent" />
              <span>Professional Career Summary</span>
            </h3>
            <p className="text-xs text-token-muted mt-1">
              A recruiter-focused 3-sentence summary highlighting your technical domain and impact.
            </p>
          </div>

          <button
            type="button"
            onClick={onGenerate}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-token-accent hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0 cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Drafting Summary...' : 'Draft / Enhance with AI'}</span>
          </button>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <textarea
            rows={5}
            value={summary || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Click 'Draft / Enhance with AI' or type your summary here..."
            className="w-full p-4 sm:p-5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent leading-relaxed font-sans min-h-[140px] transition-all"
          />

          {/* Understated Word Count & Status */}
          <div className="flex items-center justify-between text-xs px-1 pt-0.5 text-token-muted">
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-token-text">
                {wordCount} words
              </span>
              <span>•</span>
              <span className={`text-[11px] font-medium ${isOptimal ? 'text-token-accent font-semibold' : 'text-token-muted'}`}>
                {wordCount === 0 
                  ? 'Recommended: 40–75 words' 
                  : isOptimal 
                    ? 'Optimal length for ATS' 
                    : wordCount < 40 
                      ? 'Too brief (Aim for 40+ words)' 
                      : 'Slightly long (Aim for under 75 words)'}
              </span>
            </div>

            {summary && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-token-muted hover:text-red-500 text-xs flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
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
          <span>Next: Education</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}