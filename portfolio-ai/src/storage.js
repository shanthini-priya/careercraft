/**
 * LocalStorage and Data Persistence Layer for PortfolioAI
 */

export const STORAGE_KEYS = {
  PROFILE: 'portfolio_ai_profile_v1',
  SETTINGS: 'portfolio_ai_settings_v1',
  SELECTED_TEMPLATE: 'portfolio_ai_selected_template_v1',
  ATS_ANALYSIS: 'portfolio_ai_ats_analysis_v1'
};

export const DEFAULT_BLANK_PROFILE = {
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
  skills: {
    technical: [],
    frameworks: [],
    tools: [],
    soft: []
  },
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
      role: '',
      company: '',
      location: '',
      type: 'Internship', // Internship | Part-time | Freelance | Full-time
      startDate: '',
      endDate: '',
      current: false,
      bullets: ['']
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: '',
      issuer: '',
      issueDate: '',
      url: ''
    }
  ]
};

export const SAMPLE_PROFILE = {
  personal: {
    fullName: 'M. Shanthini Priya',
    targetRole: 'Graphic Designer | UI/UX Designer | Frontend Developer',
    email: 'shanthinipriya.design@gmail.com',
    phone: '+91 86109 64026',
    location: 'Ammapettai, Thanjavur, Tamil Nadu',
    website: 'https://shanthinipriya.design',
    github: 'https://github.com/shanthinipriya',
    linkedin: 'https://linkedin.com/in/shanthinipriya',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Creative and detail-oriented Graphic Designer and UI/UX Designer with hands-on internship experience in UI/UX design and frontend development. Skilled in creating posters, advertisements, social media creatives, website interfaces, and interactive prototypes.'
  },
  summary: 'Creative and detail-oriented Graphic Designer and UI/UX Designer with hands-on internship experience in UI/UX design and frontend development. Skilled in creating posters, advertisements, social media creatives, website interfaces, and interactive prototypes. Proficient in Figma, Canva, Adobe Photoshop, and Adobe Premiere Pro. Strong foundation in typography, color theory, visual hierarchy, and user-centered design principles. Passionate about crafting visually engaging and meaningful digital experiences.',
  education: [
    {
      id: 'edu-1',
      institution: 'Kings College of Engineering, Tamil Nadu',
      degree: 'Bachelor of Computer Science & Engineering',
      fieldOfStudy: 'Computer Science & Engineering',
      startDate: '2024',
      endDate: '2028 (Expected)',
      gpa: '8.6 / 10',
      highlights: 'Presented research at ICEST-2K26; Participated in Shield & Nurture National-Level Hackathon 2026; Completed Unity 3D AR/VR training at MSME Technology Development Centre.'
    }
  ],
  skills: {
    technical: [
      'Graphic Design',
      'Poster & Advertisement Design',
      'Social Media Creatives & Branding',
      'Typography & Layout',
      'Color Theory & Visual Hierarchy',
      'Visual Identity & Communication',
      'HTML5',
      'CSS3',
      'JavaScript',
      'React',
      'Python'
    ],
    frameworks: [
      'UI/UX Design',
      'User Research & Wireframing',
      'UI Design & Prototyping',
      'User Flow & Navigation Design',
      'Responsive Web Design',
      'Design Systems & Consistency',
      'Interactive Micro-Interactions'
    ],
    tools: [
      'Figma',
      'Canva',
      'Adobe Photoshop',
      'Adobe Premiere Pro',
      'Visily',
      'GitHub',
      'AI Creative Tools',
      'Unity 3D'
    ],
    soft: [
      'Visual Storytelling',
      'User-Centered Design',
      'Creative Content Design',
      'Agile Team Collaboration',
      'Tamil (Native)',
      'English (Professional)'
    ]
  },
  projects: [
    {
      id: 'proj-1',
      title: 'Poster Design Series — Multi-Brand Creative Campaign',
      role: 'Lead Graphic & Visual Designer',
      techStack: ['Figma', 'Adobe Photoshop', 'Canva', 'Color Psychology'],
      liveUrl: 'https://figma.com/@shanthini/posters',
      githubUrl: 'https://github.com/shanthinipriya/poster-design-series',
      description: 'Product advertisement poster series engineered for sportswear, culinary gastronomy, and high-tech brand campaigns with tailored brand identities.',
      bullets: [
        'Designed high-impact product advertisement posters for sportswear, food, and technology brand concepts.',
        'Applied typography hierarchy, color psychology, composition, and visual flow principles to maximize viewer retention and brand recall.',
        'Adapted visual design language according to diverse industries, establishing distinctive visual assets and commercial social creatives.'
      ]
    },
    {
      id: 'proj-2',
      title: 'Restaurant Website UI — Modern Culinary Experience',
      role: 'UI/UX Designer & Prototyper',
      techStack: ['Figma', 'UI/UX Prototyping', 'Design Systems', 'Responsive Layouts'],
      liveUrl: 'https://figma.com/@shanthini/restaurant-ui',
      githubUrl: 'https://github.com/shanthinipriya/restaurant-website-ui',
      description: 'End-to-end interactive restaurant web platform crafted with appetizing visual hierarchy, seamless table booking journeys, and digital menus.',
      bullets: [
        'Designed and prototyped a modern restaurant website with clean visuals, appetizing food presentations, and intuitive customer navigation.',
        'Focused on responsive layouts, strict visual hierarchy, and cohesive UI styling across mobile, tablet, and desktop viewports.',
        'Structured interactive user journeys that reduced menu navigation friction and streamlined online reservation paths.'
      ]
    },
    {
      id: 'proj-3',
      title: 'Retroscope — Vintage Website Concept',
      role: 'UI/UX & Visual Designer',
      techStack: ['Figma', 'Visual Storytelling', 'Vintage Aesthetics', 'Interactive Prototyping'],
      liveUrl: 'https://figma.com/@shanthini/retroscope',
      githubUrl: 'https://github.com/shanthinipriya/retroscope-vintage-concept',
      description: 'Vintage-inspired interactive web prototype celebrating the golden age of cinema through warm retro aesthetics and contemporary UX standards.',
      bullets: [
        'Designed a vintage-inspired website prototype based on the golden age of film aesthetics with curated typography.',
        'Combined warm cinematic color palettes, classic editorial typography, and visual storytelling with modern UX usability principles.',
        'Built dynamic interactive micro-interactions and screen transitions in Figma demonstrating seamless historical narrative navigation.'
      ]
    }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'UI/UX Design Intern',
      company: 'Digital Product Design Studio',
      location: 'Tamil Nadu, India',
      type: 'Internship',
      startDate: 'Jun 2024',
      endDate: 'Present',
      current: true,
      bullets: [
        'Conducted user research, wireframing, high-fidelity prototyping, and interface design for end-to-end digital products.',
        'Designed user-centered interfaces with rigorous emphasis on usability, visual appeal, accessibility standards, and intuitive interactions.',
        'Applied visual hierarchy, typography scales, layout spacing, color schemes, and navigation principles across all product deliverables.',
        'Created comprehensive UI concepts and interactive prototypes using Figma, validating user flows through iterative design reviews.',
        'Developed responsive design systems and multi-device layouts, elevating overall user experience and visual consistency.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Frontend Development Intern',
      company: 'Web Solutions Lab',
      location: 'Tamil Nadu, India',
      type: 'Internship',
      startDate: 'Jan 2024',
      endDate: 'May 2024',
      current: false,
      bullets: [
        'Built responsive web interfaces using HTML, CSS, and modern JavaScript based on high-fidelity design prototypes.',
        'Translated UI/UX design concepts into functional, pixel-perfect web components with cross-browser compatibility.',
        'Maintained strict visual fidelity and style guide consistency between design prototypes and production-ready code.',
        'Optimized responsive layouts, component modularity, and frontend interface implementation for fluid user experiences.'
      ]
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'UI/UX Design Internship Certification',
      issuer: 'Digital Product Design Studio',
      issueDate: '2024',
      url: '#'
    },
    {
      id: 'cert-2',
      name: 'Frontend Development Internship Certification',
      issuer: 'Web Solutions Lab',
      issueDate: '2024',
      url: '#'
    },
    {
      id: 'cert-3',
      name: 'Research Presenter — ICEST-2K26',
      issuer: 'International Conference on Engineering, Science and Technology',
      issueDate: '2026',
      url: '#'
    },
    {
      id: 'cert-4',
      name: 'Shield & Nurture National Hackathon Participant',
      issuer: 'National Level Hackathon',
      issueDate: '2026',
      url: '#'
    },
    {
      id: 'cert-5',
      name: 'Unity 3D Training for AR/VR',
      issuer: 'MSME Technology Development Centre',
      issueDate: '2025',
      url: '#'
    }
  ]
};

export const DEFAULT_SETTINGS = {
  provider: 'mock', // 'mock' | 'openai' | 'gemini' | 'custom'
  apiKey: '',
  apiEndpoint: '',
  modelName: 'gpt-4o-mini',
  theme: 'dark', // 'light' | 'dark'
  accentColor: 'violet', // 'indigo' | 'emerald' | 'violet' | 'cyan' | 'teal' | 'amber' | 'rose'
  atsStrictLevel: 'medium'
};

/**
 * Get profile data from LocalStorage or initialize with default/sample
 */
export function getProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      return SAMPLE_PROFILE;
    }
    const parsed = JSON.parse(raw);
    // If the cached profile is the old placeholder or missing name, upgrade to Shanthini Priya's profile
    if (!parsed?.personal?.fullName || parsed.personal.fullName === 'Alex Rivera') {
      saveProfile(SAMPLE_PROFILE);
      return SAMPLE_PROFILE;
    }
    return { ...DEFAULT_BLANK_PROFILE, ...parsed };
  } catch (err) {
    console.error('Error loading profile from localStorage:', err);
    return SAMPLE_PROFILE;
  }
}

/**
 * Save profile to LocalStorage and broadcast update event
 */
export function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('portfolio-ai-profile-updated', { detail: profile }));
    return true;
  } catch (err) {
    console.error('Error saving profile to localStorage:', err);
    return false;
  }
}

/**
 * Save snapshot of profile state to history
 */
export function saveProfileHistory(profile) {
  try {
    const raw = localStorage.getItem('portfolio_ai_history_v1');
    const history = raw ? JSON.parse(raw) : [];
    const snapshot = { timestamp: Date.now(), profile };
    const updated = [snapshot, ...history.slice(0, 19)];
    localStorage.setItem('portfolio_ai_history_v1', JSON.stringify(updated));
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Reset profile back to blank state
 */
export function resetProfile() {
  const blank = JSON.parse(JSON.stringify(DEFAULT_BLANK_PROFILE));
  saveProfile(blank);
  return blank;
}

/**
 * Load sample profile for instant demonstration
 */
export function loadSampleProfile() {
  const sample = JSON.parse(JSON.stringify(SAMPLE_PROFILE));
  saveProfile(sample);
  return sample;
}

/**
 * Get application settings
 */
export function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save application settings & apply UI theme classes
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    applyThemeSettings(settings);
    window.dispatchEvent(new CustomEvent('portfolio-ai-settings-updated', { detail: settings }));
    return true;
  } catch (err) {
    console.error('Error saving settings:', err);
    return false;
  }
}

/**
 * Apply theme to document element
 */
export function applyThemeSettings(settings = getSettings()) {
  const root = document.documentElement;
  const isDark = settings.theme === 'dark';
  
  // Dark mode class toggle on <html> and <body>
  if (isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
    if (document.body) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    if (document.body) {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  }

  // Accent color mapping & CSS variables
  const colorId = settings.accentColor || 'cyan';
  root.setAttribute('data-theme', colorId);
  if (document.body) {
    document.body.setAttribute('data-theme', colorId);
  }

  const themeDefinitions = {
    indigo: {
      light: { primary: '#4f46e5', hover: '#4338ca', soft: 'rgba(79, 70, 229, 0.12)' },
      dark: { primary: '#6366f1', hover: '#818cf8', soft: 'rgba(99, 102, 241, 0.22)' }
    },
    emerald: {
      light: { primary: '#059669', hover: '#047857', soft: 'rgba(5, 150, 105, 0.12)' },
      dark: { primary: '#10b981', hover: '#34d399', soft: 'rgba(16, 185, 129, 0.22)' }
    },
    violet: {
      light: { primary: '#7c3aed', hover: '#6d28d9', soft: 'rgba(124, 58, 237, 0.12)' },
      dark: { primary: '#8b5cf6', hover: '#a78bfa', soft: 'rgba(139, 92, 246, 0.22)' }
    },
    cyan: {
      light: { primary: '#0891b2', hover: '#0e7490', soft: 'rgba(8, 145, 178, 0.12)' },
      dark: { primary: '#06b6d4', hover: '#22d3ee', soft: 'rgba(6, 182, 212, 0.22)' }
    },
    teal: {
      light: { primary: '#0d9488', hover: '#0f766e', soft: 'rgba(13, 148, 136, 0.12)' },
      dark: { primary: '#14b8a6', hover: '#2dd4bf', soft: 'rgba(20, 184, 166, 0.22)' }
    },
    amber: {
      light: { primary: '#d97706', hover: '#b45309', soft: 'rgba(217, 119, 6, 0.12)' },
      dark: { primary: '#f59e0b', hover: '#fbbf24', soft: 'rgba(245, 158, 11, 0.22)' }
    },
    rose: {
      light: { primary: '#e11d48', hover: '#be123c', soft: 'rgba(225, 29, 72, 0.12)' },
      dark: { primary: '#f43f5e', hover: '#fb7185', soft: 'rgba(244, 63, 94, 0.22)' }
    }
  };

  const currentTheme = themeDefinitions[colorId] || themeDefinitions.cyan;
  const tokens = isDark ? currentTheme.dark : currentTheme.light;

  root.style.setProperty('--token-accent', tokens.primary);
  root.style.setProperty('--token-accent-hover', tokens.hover);
  root.style.setProperty('--token-accent-soft', tokens.soft);
  root.style.setProperty('--color-primary', tokens.primary);
  root.style.setProperty('--color-primary-hover', tokens.hover);
  root.style.setProperty('--color-primary-soft', tokens.soft);
}

/**
 * Get currently selected template key
 */
export function getSelectedTemplate() {
  return localStorage.getItem(STORAGE_KEYS.SELECTED_TEMPLATE) || 'modern-minimalist';
}

/**
 * Save selected template key
 */
export function saveSelectedTemplate(templateId) {
  localStorage.setItem(STORAGE_KEYS.SELECTED_TEMPLATE, templateId);
  window.dispatchEvent(new CustomEvent('portfolio-ai-template-updated', { detail: templateId }));
}

/**
 * Calculate completeness percentage of user's profile
 */
export function calculateProfileCompleteness(profile) {
  if (!profile) return { percentage: 0, items: [] };

  const checks = [
    { label: 'Full Name & Target Role', done: Boolean(profile.personal?.fullName?.trim() && profile.personal?.targetRole?.trim()) },
    { label: 'Contact Details (Email & Location)', done: Boolean(profile.personal?.email?.trim() && profile.personal?.location?.trim()) },
    { label: 'Professional Summary', done: Boolean(profile.summary && profile.summary.trim().length > 30) },
    { label: 'Education Entry', done: Boolean(profile.education?.length > 0 && profile.education[0]?.institution?.trim()) },
    { label: 'Technical / Core Skills (at least 3)', done: Boolean((profile.skills?.technical?.length || 0) >= 3) },
    { label: 'Featured Projects (at least 1 with bullets)', done: Boolean(profile.projects?.length > 0 && profile.projects[0]?.title?.trim() && profile.projects[0]?.bullets?.length > 0) },
    { label: 'Experience or Internships', done: Boolean(profile.experience?.length > 0 && profile.experience[0]?.role?.trim()) },
    { label: 'Social Links (GitHub / LinkedIn)', done: Boolean(profile.personal?.github?.trim() || profile.personal?.linkedin?.trim()) }
  ];

  const completed = checks.filter(c => c.done).length;
  const percentage = Math.round((completed / checks.length) * 100);

  return { percentage, items: checks, completedCount: completed, totalCount: checks.length };
}

/**
 * Export full profile as downloadable JSON file
 */
export function exportProfileAsJson(profile = getProfile()) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const sanitizedName = (profile.personal?.fullName || 'portfolio-profile').toLowerCase().replace(/\s+/g, '-');
  downloadAnchor.setAttribute('download', `${sanitizedName}-career-profile.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Parse & import profile from a JSON file
 */
export function importProfileFromJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data.personal && !data.skills) {
          throw new Error('Invalid PortfolioAI profile format.');
        }
        const merged = { ...DEFAULT_BLANK_PROFILE, ...data };
        saveProfile(merged);
        resolve(merged);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}
