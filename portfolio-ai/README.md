# PortfolioAI — AI-Assisted Career Asset Generator

A complete, production-ready web application built for students and early-career job seekers to generate modern developer portfolios and ATS-compliant resumes with AI assistance and an offline mock capability.

---

## 🌟 Key Features

1. **Clean Landing Page**: Introduction with custom color-token design system, feature highlights, and a 1-click sample demo.
2. **Profile Input Form**: Real-time validated form capturing identity, summary, education, categorized skills matrix, projects, experience, and certifications. Includes real-time profile completeness tracking.
3. **Provider-Adapter AI Layer**:
   - **Offline Mock Engine**: Instant, intelligent content generation tailored to student roles (Full-Stack, Frontend, Backend, Data/AI) without requiring any internet connection or API keys.
   - **Live AI Support**: Connect OpenAI (`gpt-4o-mini`) or Google Gemini (`gemini-1.5-flash`) via user-provided API key.
   - **Graceful Fallback**: Automatically and seamlessly falls back to offline mock mode on network failures or invalid keys.
   - **Google XYZ Formula**: Generates high-impact ATS bullet points: *"Accomplished [X], as measured by [Y], by doing [Z]"*.
4. **Template Gallery & Live Preview**:
   - 4 distinct responsive portfolio templates:
     - **Modern Minimalist**: Clean typography, monochrome elegance, tech-forward.
     - **Tech Neo-Slate**: Terminal aesthetic, code badges, high contrast.
     - **Creative Indigo**: Soft atmospheric gradients, glowing borders, modern SaaS feel.
     - **Executive Classic**: Structured corporate layout with refined typography.
   - Device viewport selector: Desktop, Tablet, and Mobile frames.
   - Custom color token picker (Indigo, Emerald, Violet, Cyan, Amber, Rose).
   - In-place live text editing with instant preview updates.
5. **ATS-Friendly Resume Generator**:
   - Single-column standard layout designed for automated applicant tracking systems (Greenhouse, Lever, Workday).
   - Real-time ATS compliance score evaluator (0-100%) with actionable feedback and metric density analysis.
   - Print-to-PDF ready (`@media print` styling).
   - Copy or download as clean Markdown (`.md`).
6. **Export & Persistence**:
   - **Client-Side Export**: Download a self-contained, standalone HTML portfolio website, print to PDF, or export a JSON backup.
   - **Browser Persistence**: Auto-saves state to browser `localStorage` with real-time reactivity and zero login requirements.

---

## 📂 Project Directory Structure

```
portfolio-ai/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.jsx              # App entrypoint, global navbar & AI settings modal
    ├── index.css             # Tailwind CSS & color tokens
    ├── router.js             # Hash-based routing (#/, #/profile, #/templates, #/preview)
    ├── storage.js            # LocalStorage persistence, sample profiles, JSON export/import
    ├── ai/
    │   ├── adapter.js        # Provider adapter (OpenAI / Gemini / Offline fallback)
    │   ├── prompts.js        # Google XYZ prompt templates & system instructions
    │   └── mock.js           # Context-aware offline mock engine & ATS evaluator
    ├── components/
    │   └── Icons.jsx         # Lightweight SVG icons
    └── pages/
        ├── Landing.jsx       # Landing page with feature showcases and demo CTA
        ├── ProfileForm.jsx   # Multi-section form with real-time validation & AI assists
        ├── Templates.jsx     # Template gallery, viewport switchers, in-place edit
        └── Preview.jsx       # ATS resume view, ATS score meter, HTML/PDF/JSON export
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd portfolio-ai
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```
Build output will be generated in `dist/`.

---

## 🧠 AI Configuration

- **Offline Mock Mode (Default)**: Out-of-the-box zero-setup mode. Generates professional summaries, Google XYZ bullet points, and skill recommendations offline.
- **Live AI Mode**: Click the **Settings** (gear icon) in the top-right navbar to enter an OpenAI or Google Gemini API key. All keys remain strictly client-side inside your browser's `localStorage`.
