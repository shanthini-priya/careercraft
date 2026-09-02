const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }
  return data;
}

export const api = {
  // Auth
  login: (email, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name, email, password) => request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  getMe: () => request("/auth/me"),
  
  // Profile
  getProfile: () => request("/profile"),
  updateProfile: (data) => request("/profile", { method: "PUT", body: JSON.stringify(data) }),
  addSkill: (name, category) => request("/profile/skills", { method: "POST", body: JSON.stringify({ name, category }) }),
  removeSkill: (id) => request(`/profile/skills/${id}`, { method: "DELETE" }),
  addProject: (project) => request("/profile/projects", { method: "POST", body: JSON.stringify(project) }),
  removeProject: (id) => request(`/profile/projects/${id}`, { method: "DELETE" }),
  addEducation: (edu) => request("/profile/education", { method: "POST", body: JSON.stringify(edu) }),
  removeEducation: (id) => request(`/profile/education/${id}`, { method: "DELETE" }),
  
  // Portfolio
  getPortfolio: () => request("/portfolio"),
  updateTemplate: (templateId) => request("/portfolio/template", { method: "PUT", body: JSON.stringify({ templateId }) }),
  updateSection: (type, data) => request(`/portfolio/sections/${type}`, { method: "PUT", body: JSON.stringify(data) }),
  publishPortfolio: () => request("/portfolio/publish", { method: "POST" }),
  
  // Score
  getScore: () => request("/score"),
  getScoreHistory: () => request("/score/history"),
  calculateScore: () => request("/score/calculate", { method: "POST" }),
  getRecruiterSim: () => request("/score/recruiter-simulation"),
  
  // Generators
  generateResume: () => request("/generate/resume", { method: "POST" }),
  generateLinkedIn: () => request("/generate/linkedin", { method: "POST" }),
  generateGithubReadme: () => request("/generate/github-readme", { method: "POST" }),
  generateCoverLetter: (data) => request("/generate/cover-letter", { method: "POST", body: JSON.stringify(data) }),
};

export default api;