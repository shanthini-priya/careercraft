/**
 * Offline Mock Engine for PortfolioAI
 * Provides instant, intelligent, context-aware content generation
 * without requiring any internet connection or API keys.
 */

// Robust Regex for detecting quantifiable metrics in bullet points
export const METRIC_REGEX = /(?:\d+(?:\.\d+)?%|\b\d{1,3}(?:,\d{3})*\+?|\b\d+(?:\.\d+)?\s*(?:ms|s|sec|min|hours?|x|k|m|users?|endpoints?|requests?|events?|bugs?)\b|\$\d+|\b\d+\/\d+\b)/i;

export function hasQuantifiableMetric(text = '') {
  return METRIC_REGEX.test(text);
}

/**
 * Automatically enriches a plain bullet point with realistic quantifiable metrics
 */
export function mockQuantifyBullet(bullet = '', targetRole = 'Software Engineer', index = 0) {
  if (!bullet || !bullet.trim()) {
    return 'Architected core application logic and services, improving performance by 35% across 1,000+ users.';
  }

  // If it already has quantifiable metrics, clean up and return
  if (hasQuantifiableMetric(bullet)) {
    return bullet.trim();
  }

  const category = detectRoleCategory(targetRole);
  const cleanBullet = bullet.trim().replace(/[.;,]+$/, '');

  const metricAdditions = {
    fullstack: [
      ', cutting API turnaround time by 38% and supporting 1,500+ daily active users.',
      ', reducing bundle size by 34% and achieving sub-90ms endpoint latency.',
      ', improving automated test coverage to 88% and cutting bug triage time by 25%.',
      ', handling 10,000+ webhook events daily with zero transaction deadlocks.'
    ],
    frontend: [
      ', boosting Lighthouse accessibility and performance scores to 98/100.',
      ', reducing client-side load times by 1.4s across 10+ viewport resolutions.',
      ', slashing redundant network re-renders by 42% via optimized memoization.',
      ', accelerating user task completion speeds by 28% through intuitive UX workflows.'
    ],
    backend: [
      ', scaling throughput to 500+ requests/sec with <80ms P95 response times.',
      ', slashing heavy analytical SQL query latency from 1.6s down to 120ms.',
      ', processing 50,000+ daily queued background events with 99.9% delivery reliability.',
      ', cutting server memory consumption by 30% through connection pooling.'
    ],
    data: [
      ', processing and sanitizing 40,000+ daily transactional records via automated pipelines.',
      ', improving predictive model accuracy to 92.4% with cross-validation scoring.',
      ', reducing pipeline execution runtime by 45% using optimized vector operations.',
      ', delivering automated executive dashboards serving 15+ internal stakeholders.'
    ]
  };

  const pool = metricAdditions[category] || metricAdditions.fullstack;
  const addition = pool[index % pool.length];

  return `${cleanBullet}${addition}`;
}

/**
 * Intelligent role detection helper
 */
function detectRoleCategory(role = '') {
  const normalized = role.toLowerCase();
  if (normalized.includes('design') || normalized.includes('graphic') || normalized.includes('ui') || normalized.includes('ux') || normalized.includes('creative')) {
    return 'design';
  }
  if (normalized.includes('data') || normalized.includes('machine learning') || normalized.includes('ai') || normalized.includes('analyst')) {
    return 'data';
  }
  if (normalized.includes('front') || normalized.includes('web')) {
    return 'frontend';
  }
  if (normalized.includes('back') || normalized.includes('cloud') || normalized.includes('devops') || normalized.includes('system')) {
    return 'backend';
  }
  if (normalized.includes('product') || normalized.includes('manager') || normalized.includes('scrum')) {
    return 'product';
  }
  if (normalized.includes('mobile') || normalized.includes('ios') || normalized.includes('android')) {
    return 'mobile';
  }
  return 'fullstack';
}

/**
 * Generates rich professional summaries tailored to the user's role and skills
 */
export function mockGenerateSummary(profile) {
  const targetRole = profile.personal?.targetRole || 'Software Engineer';
  const name = profile.personal?.fullName || 'Early-Career Professional';
  const roleCategory = detectRoleCategory(targetRole);

  const primarySkills = [
    ...(profile.skills?.technical || []),
    ...(profile.skills?.frameworks || [])
  ].slice(0, 4).join(', ') || 'modern frameworks and scalable architectures';

  const degree = profile.education?.[0]?.degree || 'Bachelor of Science';
  const field = profile.education?.[0]?.fieldOfStudy || 'Computer Science';

  const variants = {
    fullstack: [
      `Results-oriented ${targetRole} with a strong academic foundation in ${field} and hands-on experience developing full-cycle web applications. Proficient in ${primarySkills}, with a proven track record of designing high-performance RESTful APIs, responsive interfaces, and scalable database schemas. Eager to leverage rapid problem-solving abilities and cross-functional team leadership in high-velocity product teams.`,
      `Passionate ${targetRole} skilled at bridging complex backend logic with elegant, accessible user interfaces. Experienced with ${primarySkills}, automated CI/CD workflows, and agile development methodologies. Demonstrated ability to quickly master new technologies, optimize runtime performance, and deliver reliable features that drive user engagement.`,
      `Detail-driven ${targetRole} and recent ${degree} graduate in ${field}. Combines deep algorithmic problem-solving with practical experience in ${primarySkills}. Seeking an early-career software engineering position to contribute to mission-critical infrastructure, optimize system latency, and engineer intuitive user experiences.`
    ],
    frontend: [
      `Creative and detail-oriented ${targetRole} specialized in crafting responsive, pixel-perfect user interfaces and accessible web experiences. Proficient in ${primarySkills}, modern component design systems, and state management patterns. Passionate about web performance, sub-second load times, and transforming intricate user stories into seamless digital products.`,
      `User-centric ${targetRole} with hands-on expertise building interactive frontend architectures using ${primarySkills}. Proven ability to implement design tokens, optimize Core Web Vitals, and collaborate seamlessly with backend engineers and product designers to deliver engaging consumer products.`
    ],
    backend: [
      `Performance-focused ${targetRole} with dedicated expertise in distributed backend systems, microservice architectures, and relational database design. Proficient in ${primarySkills}, with strong competencies in query optimization, asynchronous message queues, and containerized deployments. Committed to building robust, resilient cloud services with high uptime and strict security standards.`,
      `Reliability-driven ${targetRole} with a passion for scalable data pipelines, fault-tolerant APIs, and cloud infrastructure. Hands-on experience deploying services using ${primarySkills} and monitoring production telemetry to maintain sub-100ms response latencies.`
    ],
    data: [
      `Analytical ${targetRole} with a strong mathematical and computational foundation in ${field}. Hands-on experience with ${primarySkills}, statistical modeling, predictive analytics, and exploratory data visualization. Adept at translating messy, unstructured data into clean pipelines and actionable executive insights that guide product decisions.`,
      `Data-driven ${targetRole} passionate about turning complex datasets into strategic value. Proficient in ${primarySkills}, query tuning, and building reproducible machine learning workflows with rigorous validation metrics.`
    ],
    product: [
      `Product-minded ${targetRole} combining technical fluency in ${field} with a sharp eye for user empathy and data-informed decision making. Experienced in customer discovery, user story mapping, and feature prioritization. Strong collaborator across engineering, design, and marketing to execute product roadmaps on schedule.`,
      `Dynamic ${targetRole} focused on shipping software that solves real user pain points. Skilled at metric analysis, backlog management, and working alongside developers using ${primarySkills} to accelerate product-market fit.`
    ],
    mobile: [
      `Motivated ${targetRole} dedicated to building fluid, high-performance mobile applications with native and cross-platform technologies. Proficient in ${primarySkills}, clean architecture, offline-first local storage, and seamless RESTful integration. Driven to engineer 60fps animations and robust crash-free user experiences.`
    ]
  };

  const pool = variants[roleCategory] || variants.fullstack;
  // Pick random variant or return primary
  const selected = pool[Math.floor(Math.random() * pool.length)];

  return {
    content: selected,
    variants: pool,
    metadata: {
      provider: 'Offline Mock Engine (Deterministic AI)',
      tokensUsed: 185,
      cached: true
    }
  };
}

/**
 * Enhances raw project descriptions into standard Google XYZ formula ATS bullets
 */
export function mockEnhanceProjectBullets(project, targetRole = 'Software Engineer') {
  const title = project.title || 'Project';
  const stack = (project.techStack || []).join(', ') || 'modern technologies';
  const roleCategory = detectRoleCategory(targetRole);

  const bulletSets = {
    fullstack: [
      `Architected full-stack architecture leveraging ${stack}, achieving sub-80ms API response times across 20+ REST/GraphQL endpoints.`,
      `Engineered real-time reactive state synchronization and cached query layer, slashing redundant database hits by 38%.`,
      `Implemented end-to-end user authentication with JWT/OAuth2 and role-based access control, safeguarding 100% of sensitive endpoint routes.`,
      `Containerized development environment via Docker and established automated GitHub Actions CI/CD pipeline with 85%+ test coverage.`
    ],
    frontend: [
      `Engineered modular, responsive component system using ${stack}, improving Lighthouse accessibility and performance scores to 98/100.`,
      `Integrated client-side state caching and debounced search indexing, reducing client-side network bandwidth consumption by 45%.`,
      `Designed seamless interactive micro-interactions and mobile-first responsive breakpoints supporting 10+ distinct viewport dimensions.`
    ],
    backend: [
      `Constructed fault-tolerant backend services in ${stack}, handling concurrent payload spikes of 500+ requests/sec with zero downtime.`,
      `Optimized database indexing and relational schema normalization, cutting heavy analytical query latency from 1.8s down to 140ms.`,
      `Designed automated event-driven asynchronous queues for heavy computation tasks, maintaining high reliability and retry mechanisms.`
    ],
    data: [
      `Constructed automated ETL data ingestion pipeline utilizing ${stack}, processing and cleaning 50,000+ daily record transactions.`,
      `Developed predictive machine learning pipeline with cross-validation scoring, achieving 91.4% precision on test datasets.`,
      `Designed interactive executive analytics dashboards highlighting conversion funnels and automated discrepancy reporting.`
    ]
  };

  const bullets = bulletSets[roleCategory] || bulletSets.fullstack;

  return {
    bullets,
    metadata: {
      provider: 'Offline Mock Engine (ATS Bullet Enhancer)',
      formula: 'Google XYZ: Accomplished [X], as measured by [Y], by doing [Z]'
    }
  };
}

/**
 * Enhances work or internship experience bullets
 */
export function mockEnhanceExperienceBullets(experience, targetRole = 'Software Engineer') {
  const role = experience.role || 'Software Intern';
  const company = experience.company || 'Technology Company';

  const bullets = [
    `Collaborated with cross-functional team of 6 engineers and product managers to deliver 8 high-priority feature epics ahead of quarterly deadline.`,
    `Refactored legacy customer-facing workflows into reusable modular components, reducing page load latency by 32% across 40,000+ weekly visits.`,
    `Authored unit, integration, and E2E automated test suites, expanding test coverage from 64% to 88% and eliminating recurring regression bugs.`,
    `Participated in daily agile standups, peer code reviews, and architectural sprint retrospectives adhering to industry-standard CI/CD practices.`
  ];

  return {
    bullets,
    metadata: {
      provider: 'Offline Mock Engine (Experience Polish)'
    }
  };
}

/**
 * Suggests high-value ATS industry skills based on the target role
 */
export function mockRecommendSkills(targetRole, currentSkills = []) {
  const allCurrent = new Set(
    (currentSkills || []).map(s => s.toLowerCase().trim())
  );

  const recommendationsByRole = {
    design: [
      'Figma', 'Adobe Creative Cloud (Photoshop, Illustrator)', 'Design Systems', 'User Research & Testing',
      'Wireframing & Prototyping', 'Visual Hierarchy', 'Typography & Grid Systems', 'Color Theory & Branding',
      'Canva', 'Micro-Interactions & Animation', 'Responsive Layouts', 'Visily', 'UI Accessibility (WCAG)'
    ],
    fullstack: [
      'TypeScript', 'React.js', 'Node.js', 'PostgreSQL', 'Docker',
      'REST APIs', 'GraphQL', 'Tailwind CSS', 'Next.js', 'CI/CD Pipelines',
      'Redis', 'AWS (S3, Lambda)', 'Git & Version Control', 'Unit Testing (Jest/Vitest)'
    ],
    frontend: [
      'React.js', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Web Accessibility (a11y)',
      'Responsive Design', 'Vite', 'Redux / Zustand', 'HTML5/CSS3 Semantic Standards',
      'Browser DevTools', 'Core Web Vitals Optimization', 'Storybook'
    ],
    backend: [
      'Node.js', 'Python', 'Go', 'PostgreSQL', 'MongoDB',
      'Docker & Containerization', 'Microservices', 'Redis Caching', 'Kafka / RabbitMQ',
      'REST & gRPC APIs', 'Database Indexing', 'Linux CLI', 'Cloud Architecture (AWS/GCP)'
    ],
    data: [
      'Python', 'SQL (Advanced Window Functions)', 'Pandas & NumPy', 'Tableau / PowerBI',
      'Scikit-Learn', 'Data Cleaning & Preprocessing', 'Apache Spark', 'Statistical Analysis',
      'Git', 'Jupyter Notebooks', 'ETL Pipelines', 'BigQuery'
    ]
  };

  const category = detectRoleCategory(targetRole);
  const pool = recommendationsByRole[category] || recommendationsByRole.fullstack;

  // Filter out already added skills
  const missing = pool.filter(skill => !allCurrent.has(skill.toLowerCase()));

  return {
    suggestedSkills: missing.slice(0, 8),
    roleCategory: category
  };
}

/**
 * Real-time ATS Resume Scanner & Score Evaluator
 */
export function mockAnalyzeAtsScore(profile) {
  let score = 50;
  const strengths = [];
  const improvements = [];

  // 1. Contact Info Checks
  if (profile.personal?.fullName && profile.personal?.email && profile.personal?.phone) {
    score += 10;
    strengths.push('Complete contact information with email and phone provided.');
  } else {
    improvements.push('Add a phone number and verified email address to header.');
  }

  // 2. Links Check
  if (profile.personal?.github || profile.personal?.linkedin) {
    score += 8;
    strengths.push('Professional portfolio/LinkedIn and GitHub profiles linked.');
  } else {
    improvements.push('Include your LinkedIn or GitHub profile for recruiter credibility.');
  }

  // 3. Summary Check
  const summaryLen = profile.summary?.trim()?.length || 0;
  if (summaryLen >= 120 && summaryLen <= 450) {
    score += 12;
    strengths.push('Concise, well-scoped professional summary (optimal length).');
  } else if (summaryLen > 450) {
    improvements.push('Summary is too lengthy; condense down to 2-4 impactful sentences.');
  } else {
    improvements.push('Expand your summary with your target role and key technical strengths.');
  }

  // 4. Skills Density
  const totalSkills = (profile.skills?.technical?.length || 0) + (profile.skills?.frameworks?.length || 0);
  if (totalSkills >= 8) {
    score += 10;
    strengths.push(`Strong technical keyword density (${totalSkills} technical skills listed).`);
  } else {
    improvements.push('Add at least 8 relevant technical skills/frameworks to match ATS filters.');
  }

  // 5. Quantifiable Metrics in Projects & Experience
  const allBullets = [
    ...(profile.projects || []).flatMap(p => p.bullets || []),
    ...(profile.experience || []).flatMap(e => e.bullets || [])
  ].filter(b => b && b.trim().length > 0);

  const bulletsWithMetrics = allBullets.filter(b => hasQuantifiableMetric(b)).length;

  if (bulletsWithMetrics >= 3) {
    score += 10;
    strengths.push(`High metric density: ${bulletsWithMetrics} bullet points contain quantifiable numbers/results.`);
  } else {
    improvements.push('Incorporate quantifiable metrics (e.g. "% improvement", "ms latency", "number of users/records").');
  }

  // Cap score between 0 and 98
  score = Math.min(Math.max(score, 35), 98);

  let rating = 'Needs Improvement';
  if (score >= 85) rating = 'ATS-Ready (Excellent)';
  else if (score >= 70) rating = 'Competitive (Good)';
  else if (score >= 55) rating = 'Fair (Basic)';

  return {
    score,
    rating,
    strengths,
    improvements,
    metricsFound: bulletsWithMetrics,
    totalBullets: allBullets.length
  };
}
