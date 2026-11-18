/**
 * Structured Prompt Templates for Live AI Providers
 * Formatted for standard LLM completions & chat models (OpenAI, Gemini, Anthropic)
 */

export const SYSTEM_PROMPTS = {
  CAREER_ARCHITECT: `You are an elite Tech Career Coach, ATS Resume Specialist, and Senior Engineering Hiring Manager.
Your goal is to turn early-career and student achievements into high-impact, professional career assets.
Rules to strictly adhere to:
1. Always apply the Google XYZ Formula: "Accomplished [X], as measured by [Y], by doing [Z]".
2. Begin every bullet point with a powerful past-tense action verb (e.g., Architected, Engineered, Optimized, Automated).
3. Never use passive voice or weak phrasing ("Worked on", "Helped with", "Responsible for").
4. Never use first-person pronouns ("I", "my", "we").
5. Incorporate realistic, plausible quantifiable metrics (percentages, latency, throughput, scale) when enhancing student projects.
6. Return only the requested content without chat fluff or meta commentary.`,

  SUMMARY_WRITER: `You are an executive resume writer specializing in tech talent. Write a concise, 3-to-4 sentence professional summary tailored for an ATS-compliant resume and portfolio header. Emphasize technical strengths, academic foundations, and high potential.`
};

/**
 * Builds prompt for generating or enhancing a professional career summary
 */
export function buildSummaryPrompt(profile) {
  const role = profile.personal?.targetRole || 'Software Engineer';
  const name = profile.personal?.fullName || 'Candidate';
  const skills = [
    ...(profile.skills?.technical || []),
    ...(profile.skills?.frameworks || [])
  ].slice(0, 8).join(', ');
  const education = profile.education?.[0]
    ? `${profile.education[0].degree} in ${profile.education[0].fieldOfStudy} from ${profile.education[0].institution}`
    : 'Computer Science & Engineering graduate';

  return `Write a high-converting, ATS-optimized 3-sentence professional summary for an early-career job applicant.
Candidate Profile:
- Name: ${name}
- Target Role: ${role}
- Academic Background: ${education}
- Core Skills: ${skills || 'Full-stack software development, REST APIs, Git'}
- Key Highlights: ${profile.summary || 'Passionate about building scalable modern web applications'}

Requirements:
- Sentence 1: Hook stating their identity, target role, education, and primary technical competencies.
- Sentence 2: Concrete value proposition highlighting architectures, database optimization, or frontend excellence.
- Sentence 3: Forward-looking statement stating readiness to contribute to high-impact production engineering teams.
- Keep output under 80 words. Return only the summary paragraph.`;
}

/**
 * Builds prompt for enhancing project bullet points
 */
export function buildProjectBulletsPrompt(project, targetRole = 'Software Engineer') {
  const stack = (project.techStack || []).join(', ') || 'Modern tech stack';
  return `Convert this project into 3 ATS-friendly, metric-driven resume bullet points following the Google XYZ formula.

Target Role: ${targetRole}
Project Title: ${project.title || 'Software Project'}
Technologies Used: ${stack}
Project Context/Raw Notes:
${project.description || 'Built a responsive web application with user authentication and database persistence.'}

Requirements:
- Exactly 3 bullet points starting with strong action verbs (e.g. Engineered, Architected, Deployed).
- Include realistic engineering metrics (e.g. latency reduction, query optimization, test coverage, concurrent users).
- Return each bullet point on a new line prefixed with a hyphen (-). No introductory text.`;
}

/**
 * Builds prompt for enhancing work or internship experience
 */
export function buildExperienceBulletsPrompt(experience, targetRole = 'Software Engineer') {
  const existingBullets = (experience.bullets || []).filter(Boolean).join('\n') || 'Worked with team on software features.';
  return `Rewrite the following work/internship experience bullet points into high-impact, professional resume achievements.

Target Role: ${targetRole}
Company: ${experience.company || 'Tech Company'}
Role: ${experience.role || 'Software Intern'}
Current Raw Notes / Bullets:
${existingBullets}

Requirements:
- 3 to 4 polished bullet points using past-tense action verbs.
- Highlight collaboration, code review quality, performance improvements, and automated testing.
- Return each bullet on a new line prefixed with a hyphen (-). No introductory text.`;
}

/**
 * Builds prompt for recommending high-value missing industry skills
 */
export function buildSkillRecommendationsPrompt(targetRole, currentSkills = []) {
  return `Analyze current skills for an applicant targeting the role: "${targetRole}".
Current Skills: ${currentSkills.join(', ') || 'None provided'}

Recommend the top 6 most in-demand technical skills, tools, or frameworks that recruiters and ATS scanners look for this year.
Return as a simple JSON array of strings, for example: ["Docker", "TypeScript", "PostgreSQL", "Next.js"]`;
}
