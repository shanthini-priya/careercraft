import React, { useState, useEffect } from 'react';
import { 
  User, 
  Sparkles, 
  GraduationCap, 
  Code, 
  FolderGit2, 
  Briefcase, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  RotateCcw, 
  Wand2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons.jsx';
import { 
  getProfile, 
  saveProfile, 
  getSettings, 
  calculateProfileCompleteness, 
  saveProfileHistory,
  SAMPLE_PROFILE as sampleProfile
} from '../storage.js';
import { 
  generateSummary, 
  recommendSkillsForRole, 
  autoQuantifyAllBullets, 
  improveBullet 
} from '../ai/adapter.js';
import { navigate, ROUTES, getRouteParams } from '../router.js';

// Modular Tab Components
import AISummary from '../components/AISummary.jsx';
import Education from '../components/Education.jsx';
import SkillsMatrix from '../components/SkillsMatrix.jsx';
import Projects from '../components/Projects.jsx';
import Experience from '../components/Experience.jsx';

export default function ProfileForm() {
  const [profile, setProfile] = useState(() => getProfile());
  const [activeTab, setActiveTab] = useState(() => {
    const params = getRouteParams();
    return params.step || 'personal';
  });
  const [saveStatus, setSaveStatus] = useState('All changes saved');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiNotice, setAiNotice] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Skill input state for inline entry
  const [skillInput, setSkillInput] = useState({
    technical: '',
    frameworks: '',
    tools: '',
    soft: ''
  });

  // Calculate completeness
  const completeness = calculateProfileCompleteness(profile);

  // Auto-save changes to LocalStorage with debounce
  useEffect(() => {
    setSaveStatus('Saving...');
    const timer = setTimeout(() => {
      saveProfile(profile);
      saveProfileHistory(profile);
      setSaveStatus('All changes saved');
    }, 400);

    return () => clearTimeout(timer);
  }, [profile]);

  // Load Full Sample Data
  const handleLoadSample = () => {
    if (window.confirm('Load sample profile data? (This will overwrite current inputs)')) {
      setProfile(sampleProfile);
      saveProfile(sampleProfile);
      setValidationErrors({});
    }
  };

  // Reset to blank
  const handleReset = () => {
    if (window.confirm('Reset profile to blank state?')) {
      const blank = {
        personal: {
          fullName: '',
          targetRole: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          github: '',
          linkedin: '',
          avatarUrl: '',
          bio: ''
        },
        summary: '',
        education: [
          {
            id: 'edu-1',
            institution: '',
            degree: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            gpa: '',
            highlights: ''
          }
        ],
        skills: { technical: [], frameworks: [], tools: [], soft: [] },
        projects: [
          {
            id: 'proj-1',
            title: '',
            role: '',
            techStack: [],
            liveUrl: '',
            githubUrl: '',
            description: '',
            bullets: ['']
          }
        ],
        experience: [
          {
            id: 'exp-1',
            company: '',
            role: '',
            type: 'Internship',
            location: '',
            startDate: '',
            endDate: '',
            bullets: ['']
          }
        ]
      };
      setProfile(blank);
      saveProfile(blank);
      setValidationErrors({});
    }
  };

  // Generic personal field updater
  const handlePersonalChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));

    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // AI Summary Generator
  const handleGenerateSummary = async () => {
    setIsAiLoading(true);
    setAiNotice(null);
    try {
      const settings = getSettings();
      const generated = await generateSummary(profile, settings);
      setProfile(prev => ({ ...prev, summary: generated }));
      setAiNotice({ type: 'success', message: 'Career summary drafted successfully!' });
    } catch (err) {
      setAiNotice({ type: 'error', message: 'Failed to draft summary: ' + err.message });
    } finally {
      setIsAiLoading(false);
    }
  };

  // Education Handlers
  const handleAddEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now()}`,
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          gpa: '',
          highlights: ''
        }
      ]
    }));
  };

  const handleUpdateEducation = (index, field, value) => {
    setProfile(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const handleRemoveEducation = (index) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Skills Handlers
  const handleAddSkill = (category) => {
    const raw = skillInput[category];
    if (!raw || !raw.trim()) return;

    const newSkills = raw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    setProfile(prev => {
      const existing = prev.skills[category] || [];
      const merged = Array.from(new Set([...existing, ...newSkills]));
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: merged
        }
      };
    });

    setSkillInput(prev => ({ ...prev, [category]: '' }));
  };

  const handleRemoveSkill = (category, skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: (prev.skills[category] || []).filter(s => s !== skillToRemove)
      }
    }));
  };

  const handleRecommendSkills = async () => {
    setIsAiLoading(true);
    try {
      const role = profile.personal.targetRole || 'Software Engineer';
      const settings = getSettings();
      const recommended = await recommendSkillsForRole(role, profile.skills, settings);
      setProfile(prev => ({
        ...prev,
        skills: {
          technical: Array.from(new Set([...(prev.skills.technical || []), ...(recommended.technical || [])])),
          frameworks: Array.from(new Set([...(prev.skills.frameworks || []), ...(recommended.frameworks || [])])),
          tools: Array.from(new Set([...(prev.skills.tools || []), ...(recommended.tools || [])])),
          soft: Array.from(new Set([...(prev.skills.soft || []), ...(recommended.soft || [])]))
        }
      }));
      setAiNotice({ type: 'success', message: `Recommended skills for "${role}" added!` });
    } catch (err) {
      setAiNotice({ type: 'error', message: 'Skill recommendation failed: ' + err.message });
    } finally {
      setIsAiLoading(false);
    }
  };

  // Projects Handlers
  const handleAddProject = () => {
    setProfile(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: `proj-${Date.now()}`,
          title: '',
          role: '',
          techStack: [],
          liveUrl: '',
          githubUrl: '',
          description: '',
          bullets: ['']
        }
      ]
    }));
  };

  const handleUpdateProject = (index, field, value) => {
    setProfile(prev => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const handleRemoveProject = (index) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleEnhanceProject = async (index) => {
    const proj = profile.projects[index];
    if (!proj) return;
    setIsAiLoading(true);
    try {
      const settings = getSettings();
      const enhancedBullets = await Promise.all(
        (proj.bullets || []).map(b => improveBullet(b, profile.personal.targetRole || 'Software Engineer', settings))
      );
      handleUpdateProject(index, 'bullets', enhancedBullets);
      setAiNotice({ type: 'success', message: `Bullets enhanced with metrics for "${proj.title || 'Project'}"` });
    } catch (err) {
      setAiNotice({ type: 'error', message: 'Enhancement failed: ' + err.message });
    } finally {
      setIsAiLoading(false);
    }
  };

  // Experience Handlers
  const handleAddExperience = () => {
    setProfile(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp-${Date.now()}`,
          company: '',
          role: '',
          type: 'Internship',
          location: '',
          startDate: '',
          endDate: '',
          bullets: ['']
        }
      ]
    }));
  };

  const handleUpdateExperience = (index, field, value) => {
    setProfile(prev => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const handleRemoveExperience = (index) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleEnhanceExperience = async (index) => {
    const exp = profile.experience[index];
    if (!exp) return;
    setIsAiLoading(true);
    try {
      const settings = getSettings();
      const enhancedBullets = await Promise.all(
        (exp.bullets || []).map(b => improveBullet(b, exp.role || 'Software Engineer', settings))
      );
      handleUpdateExperience(index, 'bullets', enhancedBullets);
      setAiNotice({ type: 'success', message: `Bullets enhanced for "${exp.company || 'Experience'}"` });
    } catch (err) {
      setAiNotice({ type: 'error', message: 'Enhancement failed: ' + err.message });
    } finally {
      setIsAiLoading(false);
    }
  };

  // Auto-Quantify All Bullets Across Profile
  const handleAutoQuantifyAll = () => {
    const { updatedProfile, quantifiedCount } = autoQuantifyAllBullets(profile);
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
    setAiNotice({
      type: 'success',
      message: `Successfully quantified ${quantifiedCount} bullet point${quantifiedCount === 1 ? '' : 's'} across projects and experience!`
    });
  };

  const tabs = [
    { id: 'personal', label: 'Personal & Contact', icon: User },
    { id: 'summary', label: 'AI Summary', icon: Sparkles },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills Matrix', icon: Code },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'experience', label: 'Experience', icon: Briefcase }
  ];

  return (
    <div className="min-h-screen bg-token-bg text-token-text py-8 px-4 sm:px-6 lg:px-8 selection:bg-token-accent selection:text-white transition-colors duration-200">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-30 dark:opacity-100 transition-opacity">
        <div className="absolute top-[5%] left-[20%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[10%] w-[450px] h-[450px] bg-purple-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header & Fast Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-token-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-token-text flex items-center gap-2.5">
              <span>Career Profile Editor</span>
            </h1>
            <p className="text-xs sm:text-sm text-token-muted mt-0.5">
              Real-time validation and AI assistance power your recruiter-ready assets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleLoadSample}
              className="px-3.5 py-1.5 rounded-xl border border-token-border bg-token-card hover:bg-token-card-hover text-token-accent text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Load Sample</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl border border-token-border bg-token-card hover:bg-red-500/10 hover:text-red-500 text-xs font-medium text-token-muted flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <div className="px-3 py-1.5 rounded-xl bg-token-card border border-token-border text-xs text-token-muted font-mono flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-token-accent inline-block animate-pulse" />
              <span>{saveStatus}</span>
            </div>
          </div>
        </div>

        {/* Profile Completeness Meter */}
        <div className="p-4 rounded-2xl border border-token-border bg-token-card shadow-sm space-y-2 transition-colors">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-token-muted">Profile Completeness</span>
              <span className="font-bold px-2 py-0.5 rounded-md bg-token-accent/15 border border-token-border text-token-accent font-mono">
                {completeness.percentage}%
              </span>
            </div>
            <span className="text-token-muted">
              {completeness.completedCount} of {completeness.totalCount} sections complete
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-token-border overflow-hidden">
            <div
              className="h-full bg-token-accent transition-all duration-500 rounded-full"
              style={{ width: `${completeness.percentage}%` }}
            />
          </div>
        </div>

        {/* Notification Toast */}
        {aiNotice && (
          <div className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 ${
            aiNotice.type === 'error'
              ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300'
          }`}>
            <div className="flex items-center gap-2">
              {aiNotice.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
              <span>{aiNotice.message}</span>
            </div>
            <button onClick={() => setAiNotice(null)} className="text-xs font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 border-b border-token-border">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-token-accent text-white font-bold shadow-sm border-transparent'
                    : 'bg-token-card text-token-muted hover:text-token-text hover:bg-token-card-hover border-token-border font-medium'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{idx + 1}. {tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Personal & Contact */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-token-border bg-token-card shadow-sm space-y-6 transition-colors">
              <h3 className="text-base font-bold text-token-text flex items-center gap-2">
                <User className="w-4 h-4 text-token-accent" />
                <span>Primary Identity & Contact</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-token-muted mb-1.5">
                    Full Name <span className="text-token-accent">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.personal.fullName}
                    onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                    placeholder="e.g. M. Shanthini Priya"
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all ${
                      validationErrors.fullName ? 'border-red-500 focus:border-red-500' : 'border-token-border'
                    }`}
                  />
                  {validationErrors.fullName && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {validationErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-token-muted mb-1.5">
                    Target Role / Title <span className="text-token-accent">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.personal.targetRole}
                    onChange={(e) => handlePersonalChange('targetRole', e.target.value)}
                    placeholder="e.g. Full-Stack Software Engineer"
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all ${
                      validationErrors.targetRole ? 'border-red-500 focus:border-red-500' : 'border-token-border'
                    }`}
                  />
                  {validationErrors.targetRole && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {validationErrors.targetRole}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-token-muted mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-token-muted" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={profile.personal.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                    placeholder="alex.dev@gmail.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all ${
                      validationErrors.email ? 'border-red-500 focus:border-red-500' : 'border-token-border'
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {validationErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-token-muted mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-token-muted" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    value={profile.personal.phone}
                    onChange={(e) => handlePersonalChange('phone', e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-token-muted mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-token-muted" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    value={profile.personal.location}
                    onChange={(e) => handlePersonalChange('location', e.target.value)}
                    placeholder="San Francisco, CA (Open to Remote)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-token-muted mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-token-muted" />
                    <span>Portfolio / Website</span>
                  </label>
                  <input
                    type="url"
                    value={profile.personal.website}
                    onChange={(e) => handlePersonalChange('website', e.target.value)}
                    placeholder="https://alexrivera.dev"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-token-muted mb-1.5 flex items-center gap-1.5">
                    <GithubIcon className="w-3.5 h-3.5 text-token-muted" />
                    <span>GitHub URL</span>
                  </label>
                  <input
                    type="url"
                    value={profile.personal.github}
                    onChange={(e) => handlePersonalChange('github', e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-token-muted mb-1.5 flex items-center gap-1.5">
                    <LinkedinIcon className="w-3.5 h-3.5 text-token-muted" />
                    <span>LinkedIn URL</span>
                  </label>
                  <input
                    type="url"
                    value={profile.personal.linkedin}
                    onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-token-muted mb-1.5">
                  Short Hero Bio (1-2 sentences for portfolio banner)
                </label>
                <textarea
                  rows={2}
                  value={profile.personal.bio}
                  onChange={(e) => handlePersonalChange('bio', e.target.value)}
                  placeholder="Computer Science graduate passionate about building scalable web applications and developer tooling."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-token-text text-sm placeholder:text-token-muted focus:outline-none focus:border-token-accent focus:ring-1 focus:ring-token-accent transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('summary')}
                className="px-6 py-2.5 rounded-xl bg-token-accent hover:opacity-90 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Next: AI Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: AI Summary */}
        {activeTab === 'summary' && (
          <AISummary
            summary={profile.summary}
            onChange={(val) => setProfile(prev => ({ ...prev, summary: val }))}
            onGenerate={handleGenerateSummary}
            isLoading={isAiLoading}
            onBack={() => setActiveTab('personal')}
            onNext={() => setActiveTab('education')}
          />
        )}

        {/* TAB 3: Education */}
        {activeTab === 'education' && (
          <Education
            education={profile.education}
            onAddEducation={handleAddEducation}
            onUpdateEducation={handleUpdateEducation}
            onRemoveEducation={handleRemoveEducation}
            onBack={() => setActiveTab('summary')}
            onNext={() => setActiveTab('skills')}
          />
        )}

        {/* TAB 4: Skills Matrix */}
        {activeTab === 'skills' && (
          <SkillsMatrix
            skills={profile.skills}
            skillInput={skillInput}
            onSkillInputChange={(cat, val) => setSkillInput(prev => ({ ...prev, [cat]: val }))}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
            onRecommendSkills={handleRecommendSkills}
            isLoading={isAiLoading}
            onBack={() => setActiveTab('education')}
            onNext={() => setActiveTab('projects')}
          />
        )}

        {/* TAB 5: Projects */}
        {activeTab === 'projects' && (
          <Projects
            projects={profile.projects}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onRemoveProject={handleRemoveProject}
            onEnhanceProject={handleEnhanceProject}
            onAutoQuantifyAll={handleAutoQuantifyAll}
            targetRole={profile.personal?.targetRole || 'Software Engineer'}
            isLoading={isAiLoading}
            onBack={() => setActiveTab('skills')}
            onNext={() => setActiveTab('experience')}
          />
        )}

        {/* TAB 6: Experience & Internships */}
        {activeTab === 'experience' && (
          <Experience
            experience={profile.experience}
            onAddExperience={handleAddExperience}
            onUpdateExperience={handleUpdateExperience}
            onRemoveExperience={handleRemoveExperience}
            onEnhanceExperience={handleEnhanceExperience}
            onAutoQuantifyAll={handleAutoQuantifyAll}
            targetRole={profile.personal?.targetRole || 'Software Engineer'}
            isLoading={isAiLoading}
            onBack={() => setActiveTab('projects')}
            onGoTemplates={() => navigate(ROUTES.TEMPLATES)}
            onGoResume={() => navigate(ROUTES.RESUME, { tab: 'resume' })}
          />
        )}
      </div>
    </div>
  );
}