# CareerCraft (PortfolioAI)

> **AI-Assisted Career Asset Generator & Interactive Portfolio Engine**

CareerCraft is an enterprise-grade web application built to help designers, developers, and early-career talent craft high-converting portfolio websites and ATS-optimized resumes in seconds.

---

## 🌟 Highlights

- **Interactive Web Portfolio**: 4 responsive templates (*Creative Indigo*, *Tech Neo-Slate*, *Modern Minimalist*, *Executive Classic*) with live device preview (Desktop, Tablet, Mobile) and in-place editing.
- **ATS-Optimized Single-Page Resume**: Single-column layout engineered for applicant tracking systems (Greenhouse, Lever, Workday) with real-time ATS scoring and 1-click Print to PDF.
- **Dynamic Semantic Token System**: Real-time 6-accent color switcher (*Indigo, Emerald, Violet, Cyan, Teal, Amber, Rose*) and high-contrast Dark / Light mode switching across all components.
- **AI Career Engine (Live & Offline)**:
  - **Offline Mock Engine**: 100% free, zero-network career assistant that structures Google XYZ bullet points (*"Accomplished [X], as measured by [Y], by doing [Z]"*) and suggests role-tailored skills.
  - **Live AI Adapter**: Connect Google Gemini or OpenAI API keys directly from browser LocalStorage.
- **Zero-Friction Client-Side Architecture**: Auto-saves state to browser `localStorage` with JSON import/export and standalone HTML export.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/shanthini-priya/careercraft.git
cd careercraft

# Install dependencies
npm --prefix portfolio-ai install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
```

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Bundler**: Vite
- **Styling**: Tailwind CSS with custom CSS variables & semantic tokens
- **Icons**: Lucide React
- **Persistence**: Browser LocalStorage & JSON backup layer

---

## 👤 Featured Profile

Default demo profile showcases **M. Shanthini Priya** (*Graphic Designer | UI/UX Designer | Frontend Developer*), demonstrating multi-disciplinary design and engineering workflows.

---

## 📄 License

MIT License. Free for personal and commercial usage.
