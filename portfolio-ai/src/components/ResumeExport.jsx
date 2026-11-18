import React from 'react';

/**
 * ATS-Friendly Resume Document Component
 * Strictly structured according to recruiter ATS parsing standards:
 * - Single-column or standard semantic sections
 * - High-contrast monochrome typography
 * - Zero decorative tables/graphics that break screen readers & parsers
 * - Density toggling for 1-page fit
 */
export default function ResumeExport({ profile, density = 'normal' }) {
  if (!profile) return null;

  const personal = profile.personal || {};
  const education = profile.education || [];
  const skills = profile.skills || { technical: [], frameworks: [], tools: [], soft: [] };
  const projects = profile.projects || [];
  const experience = profile.experience || [];
  const certifications = profile.certifications || [];

  const isCompact = density === 'compact';

  return (
    <div className="w-full flex justify-center py-4 px-2 sm:px-4 overflow-x-hidden">
      <div 
        className={`ats-resume-sheet w-full max-w-[820px] bg-white text-neutral-900 rounded-xl sm:rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-neutral-200/80 font-sans print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none transition-all duration-300 ${
          isCompact 
            ? 'p-6 sm:p-9 text-[12.5px] leading-snug space-y-3.5' 
            : 'p-8 sm:p-12 text-[13.5px] leading-normal space-y-5'
        }`}
      >
        {/* 1. Header: Name & Contact Row */}
        <header className="text-center border-b-2 border-neutral-900 pb-3.5 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase text-neutral-950 font-sans">
            {personal.fullName || 'M. Shanthini Priya'}
          </h1>
          <p className="font-semibold text-xs sm:text-sm tracking-wide text-neutral-800">
            {personal.targetRole || 'Graphic Designer | UI/UX Designer | Frontend Developer'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-neutral-700 pt-1">
            {personal.location && <span>{personal.location}</span>}
            {personal.phone && <span>• {personal.phone}</span>}
            {personal.email && (
              <span>
                • <a href={`mailto:${personal.email}`} className="text-neutral-900 hover:underline">{personal.email}</a>
              </span>
            )}
            {personal.linkedin && (
              <span>
                • <a href={personal.linkedin} target="_blank" rel="noreferrer" className="text-neutral-900 hover:underline">LinkedIn</a>
              </span>
            )}
            {personal.github && (
              <span>
                • <a href={personal.github} target="_blank" rel="noreferrer" className="text-neutral-900 hover:underline">GitHub</a>
              </span>
            )}
            {personal.website && (
              <span>
                • <a href={personal.website} target="_blank" rel="noreferrer" className="text-neutral-900 hover:underline">Portfolio</a>
              </span>
            )}
          </div>
        </header>

        {/* 2. Professional Summary */}
        {profile.summary && (
          <section className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-neutral-800 pb-0.5 text-neutral-950">
              Professional Summary
            </h2>
            <p className="text-neutral-800 leading-relaxed pt-0.5">
              {profile.summary}
            </p>
          </section>
        )}

        {/* 3. Education & Honors */}
        {education.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-neutral-800 pb-0.5 text-neutral-950">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold text-neutral-950">
                    <span>{edu.institution}</span>
                    <span className="text-xs font-normal text-neutral-700">{edu.startDate} – {edu.endDate}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-neutral-800">
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                    {edu.gpa && <span className="font-medium text-neutral-700">GPA: {edu.gpa}</span>}
                  </div>
                  {edu.highlights && (
                    <p className="text-xs text-neutral-700 italic pt-0.5">{edu.highlights}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Technical & Core Skills */}
        <section className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-neutral-800 pb-0.5 text-neutral-950">
            Technical & Professional Skills
          </h2>
          <div className="space-y-1 text-xs">
            {skills.technical?.length > 0 && (
              <div>
                <span className="font-bold text-neutral-950">Programming Languages: </span>
                <span className="text-neutral-800">{skills.technical.join(', ')}</span>
              </div>
            )}
            {skills.frameworks?.length > 0 && (
              <div>
                <span className="font-bold text-neutral-950">Frameworks & Libraries: </span>
                <span className="text-neutral-800">{skills.frameworks.join(', ')}</span>
              </div>
            )}
            {skills.tools?.length > 0 && (
              <div>
                <span className="font-bold text-neutral-950">Developer Tools & Platforms: </span>
                <span className="text-neutral-800">{skills.tools.join(', ')}</span>
              </div>
            )}
            {skills.soft?.length > 0 && (
              <div>
                <span className="font-bold text-neutral-950">Core Competencies: </span>
                <span className="text-neutral-800">{skills.soft.join(', ')}</span>
              </div>
            )}
          </div>
        </section>

        {/* 5. Featured Technical Projects */}
        {projects.length > 0 && (
          <section className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-neutral-800 pb-0.5 text-neutral-950">
              Featured Technical Projects
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div className="font-bold text-neutral-950">
                      <span>{proj.title}</span>
                      {proj.techStack?.length > 0 && (
                        <span className="font-normal text-xs text-neutral-700"> | {Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack}</span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-600 flex gap-2">
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="underline hover:text-neutral-900">
                          Live Demo
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="underline hover:text-neutral-900">
                          Code Repo
                        </a>
                      )}
                    </div>
                  </div>
                  {proj.description && !isCompact && (
                    <p className="text-xs text-neutral-700 leading-normal">{proj.description}</p>
                  )}
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-xs text-neutral-800 pl-0.5">
                      {proj.bullets.map((b, bi) => (
                        <li key={bi} className="leading-snug">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Work & Internship Experience */}
        {experience.length > 0 && (
          <section className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-neutral-800 pb-0.5 text-neutral-950">
              Experience & Internships
            </h2>
            <div className="space-y-2.5">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline font-bold text-neutral-950 flex-wrap gap-1">
                    <span>
                      {exp.role} — <span className="font-normal italic text-neutral-800">{exp.company}</span>
                    </span>
                    <span className="text-xs font-normal text-neutral-700">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-xs text-neutral-800 pl-0.5">
                      {exp.bullets.map((b, bi) => (
                        <li key={bi} className="leading-snug">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Certifications */}
        {certifications.length > 0 && certifications[0]?.name && (
          <section className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-neutral-800 pb-0.5 text-neutral-950">
              Certifications & Credentials
            </h2>
            <div className="space-y-0.5 text-xs text-neutral-800">
              {certifications.map((c, idx) => (
                <div key={idx} className="flex justify-between">
                  <span><span className="font-bold text-neutral-950">{c.name}</span> — {c.issuer}</span>
                  <span className="text-neutral-700">{c.issueDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
