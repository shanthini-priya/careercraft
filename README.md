# CareerCraft

AI-powered portfolio and career identity generator for students, freshers, and job seekers.

One conversation generates a complete professional identity — portfolio website, resume, LinkedIn content, GitHub README, and cover letter.

## Features

**Phase 1 — Landing & Onboarding**
- Responsive landing page with hero, features, testimonials, and CTA
- Hash-based SPA routing
- AI conversational onboarding (chat-style)
- Login / Register pages with Google OAuth support

**Phase 2 — Backend & Authentication**
- Express.js REST API with Prisma ORM
- PostgreSQL database
- JWT authentication with refresh tokens
- User registration, login, and session management
- Input validation with express-validator

**Phase 3 — Profile Builder**
- Multi-step profile form (personal info, skills, education, experience)
- Project portfolio with rich descriptions
- Skill proficiency tracking
- Certification and achievement management

**Phase 4 — Portfolio Builder**
- Live portfolio preview editor
- 5 theme templates (Modern Developer, Professional, Creative, Minimal, Student)
- Real-time template switching
- Custom CSS overrides
- Public portfolio URL generation

**Phase 5 — AI Assistant**
- Natural-language portfolio editing commands
- AI-powered content enhancement
- Context-aware follow-up questions
- Conversational refinement workflow

**Phase 6 — Asset Generation**
- ATS-optimized resume generation
- LinkedIn headline, about, and experience copy
- GitHub README generation
- Personalized cover letter generation
- PDF export for all documents

**Phase 7 — Portfolio Scoring**
- Portfolio score (0–100) with breakdown
- Recruiter simulation with feedback
- Keyword density analysis
- Improvement suggestions
- Score history tracking

**Phase 8 — Settings & Profile**
- Account settings (email, password, preferences)
- Privacy controls
- Notification preferences
- Data export and deletion

**Phase 9 — Testing & Deployment**
- Vitest + React Testing Library test suite
- React Error Boundary with fallback UI
- Toast notification system
- Custom hooks (useLocalStorage, useDebounce, useApi)
- Docker + docker-compose full-stack deployment
- Vercel and Netlify deployment configs
- ESLint configuration

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5 |
| Backend | Express.js, Node.js |
| Database | PostgreSQL 15, Prisma ORM |
| Auth | JWT, bcryptjs |
| Testing | Vitest, React Testing Library |
| Deployment | Docker, Vercel, Netlify |

## Project Structure

```
mini Project/
├── index.html                    # Vite entry HTML
├── package.json                  # Frontend dependencies
├── vite.config.js                # Vite + Vitest config
├── .eslintrc.cjs                 # ESLint config
├── .gitignore
├── vercel.json                   # Vercel deployment
├── netlify.toml                  # Netlify deployment
├── Dockerfile                    # Frontend Docker build
├── nginx.conf                    # Nginx config for Docker
├── docker-compose.yml            # Full-stack Docker setup
├── README.md
│
├── public/
│   └── vite.svg                  # Favicon
│
├── src/
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # App wrapper
│   │
│   ├── components/
│   │   ├── ErrorBoundary.jsx     # React error boundary
│   │   ├── LoadingSpinner.jsx    # Reusable spinner
│   │   └── Toast.jsx             # Toast notification system
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.js    # LocalStorage hook
│   │   ├── useDebounce.js        # Debounce hook
│   │   └── useApi.js             # API fetch hook
│   │
│   └── test/
│       ├── setup.js              # Test setup (jest-dom)
│       ├── App.test.jsx          # App smoke tests
│       ├── components/
│       │   └── ErrorBoundary.test.jsx
│       └── hooks/
│           └── useLocalStorage.test.jsx
│
├── portfolio-generator-phase1.jsx  # Main app (Phase 1)
│
└── server/
    ├── package.json
    ├── .env.example
    ├── Dockerfile
    ├── docker-compose.yml
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.js
    └── src/
        ├── index.js              # Express entry
        ├── routes/
        ├── middleware/
        └── utils/
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd "mini Project"

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### Environment Setup

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your database credentials and a secure JWT secret.

### Database Setup

```bash
cd server

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### Running Development Servers

```bash
# Terminal 1 — Frontend (Vite dev server on port 5173)
cd "mini Project"
npm run dev

# Terminal 2 — Backend (Express on port 5000)
cd server
npm run dev
```

The frontend proxies `/api` requests to `localhost:5000` automatically.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/profile` | Update user profile |
| GET | `/api/portfolio` | Get user's portfolio |
| POST | `/api/portfolio` | Create portfolio |
| PUT | `/api/portfolio/:id` | Update portfolio |
| GET | `/api/portfolio/:slug` | Get public portfolio by slug |
| POST | `/api/ai/chat` | Send message to AI assistant |
| POST | `/api/assets/generate` | Generate career assets |
| GET | `/api/score` | Get portfolio score |

All authenticated endpoints require `Authorization: Bearer <token>` header.

## Deployment

### Vercel (Frontend)

```bash
npm run build
vercel --prod
```

Frontend build output goes to `dist/`. Configure environment variables in the Vercel dashboard.

### Docker (Full Stack)

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Services:
- `frontend` — Nginx serving built React app (port 80)
- `api` — Express backend (port 5000)
- `db` — PostgreSQL 15 (port 5432)

### Netlify (Frontend)

```bash
npm run build
netlify deploy --prod --dir=dist
```

Or connect your Git repo to Netlify for automatic deployments.

## Environment Variables

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `/api` (via Vite proxy) |

### Backend (server/.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | Secret for JWT signing | — |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `PORT` | Server port | `5000` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

## Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run with coverage
npm run coverage
```

Tests are located in `src/test/`. The test setup file `src/test/setup.js` imports `@testing-library/jest-dom` for DOM matchers.

### Writing Tests

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Linting

```bash
npm run lint
```

ESLint is configured with React and React Hooks plugins. See `.eslintrc.cjs` for the full configuration.

## License

MIT
