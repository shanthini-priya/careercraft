import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { useHashRoute, navigate, ROUTES } from './router.js';
import { getSettings, saveSettings, applyThemeSettings } from './storage.js';
import { testConnection } from './ai/adapter.js';

// Pages
import Landing from './pages/Landing.jsx';
import ProfileForm from './pages/ProfileForm.jsx';
import Templates, { COLOR_THEMES } from './pages/Templates.jsx';
import Preview from './pages/Preview.jsx';

// Icons
import { 
  Sparkles, 
  User, 
  Layout, 
  FileText, 
  Settings, 
  Sun, 
  Moon, 
  Zap, 
  Check, 
  AlertCircle, 
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

function App() {
  const { route, params } = useHashRoute();
  const [settings, setSettings] = useState(() => getSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [toast, setToast] = useState(null);

  // Apply saved theme settings on mount
  useEffect(() => {
    applyThemeSettings(settings);
  }, [settings]);

  // Listen for AI status notifications
  useEffect(() => {
    const handleStatus = (e) => {
      setToast(e.detail);
      setTimeout(() => {
        setToast(current => (current?.timestamp === e.detail.timestamp ? null : current));
      }, 4000);
    };

    window.addEventListener('portfolio-ai-status', handleStatus);
    return () => window.removeEventListener('portfolio-ai-status', handleStatus);
  }, []);

  const handleToggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    const updated = { ...settings, theme: newTheme };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveSettings(settings);
    setIsSettingsOpen(false);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const result = await testConnection(settings);
      setTestResult(result);
    } catch (err) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setTestingConnection(false);
    }
  };

  // Route selector
  const renderCurrentPage = () => {
    switch (route) {
      case ROUTES.PROFILE:
        return <ProfileForm />;
      case ROUTES.TEMPLATES:
        return <Templates />;
      case ROUTES.PREVIEW:
        return <Preview />;
      case ROUTES.HOME:
      default:
        return <Landing onOpenSettings={() => setIsSettingsOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-token-bg text-token-text flex flex-col font-sans transition-colors duration-200">
      {/* Global Navbar (Hidden during resume print) */}
      <header className="no-print sticky top-0 z-40 bg-token-card/85 backdrop-blur-md border-b border-token-border/80 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div 
            onClick={() => navigate(ROUTES.HOME)} 
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-token-accent text-white flex items-center justify-center font-extrabold text-sm shadow-subtle group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-token-text">PortfolioAI</span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-token-muted ml-2 px-1.5 py-0.5 rounded bg-token-bg border border-token-border">
                Career Engine
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className={`px-3 py-1.5 rounded-lg transition ${
                route === ROUTES.HOME
                  ? 'bg-token-accent/15 text-token-accent font-bold'
                  : 'text-token-muted hover:text-token-text hover:bg-token-card-hover'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => navigate(ROUTES.PROFILE)}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                route === ROUTES.PROFILE
                  ? 'bg-token-accent/15 text-token-accent font-bold'
                  : 'text-token-muted hover:text-token-text hover:bg-token-card-hover'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile Form</span>
            </button>
            <button
              onClick={() => navigate(ROUTES.TEMPLATES)}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                route === ROUTES.TEMPLATES
                  ? 'bg-token-accent/15 text-token-accent font-bold'
                  : 'text-token-muted hover:text-token-text hover:bg-token-card-hover'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Templates</span>
            </button>
            <button
              onClick={() => navigate(ROUTES.RESUME, { tab: 'resume' })}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                route === ROUTES.PREVIEW
                  ? 'bg-token-accent/15 text-token-accent font-bold'
                  : 'text-token-muted hover:text-token-text hover:bg-token-card-hover'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume & Export</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* AI Status Badge */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 transition ${
                settings.provider === 'mock' || !settings.apiKey
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-token-accent/15 border-token-accent/30 text-token-accent hover:bg-token-accent/25'
              }`}
              title="Click to configure AI Provider"
            >
              <Zap className="w-3 h-3" />
              <span className="hidden sm:inline">
                {settings.provider === 'mock' || !settings.apiKey ? 'Offline Mock Mode' : `Live: ${settings.provider}`}
              </span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-xl border border-token-border bg-token-card hover:bg-token-card-hover text-token-muted hover:text-token-text shadow-subtle transition"
              title="Toggle theme"
            >
              {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Settings Dialog Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl border border-token-border bg-token-card hover:bg-token-card-hover text-token-muted hover:text-token-text shadow-subtle transition"
              title="AI & App Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Real-time Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm p-3.5 rounded-2xl border shadow-elevated bg-token-card border-token-border text-xs flex items-center gap-2.5 animate-bounce">
          {toast.mode === 'mock' && <Zap className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
          {toast.mode === 'live' && <Sparkles className="w-4 h-4 text-token-accent flex-shrink-0" />}
          {toast.mode === 'fallback' && <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
          <span className="font-medium text-token-text">{toast.message}</span>
        </div>
      )}

      {/* AI & App Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-token-border bg-token-card p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-token-border">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-token-accent" />
                <h3 className="font-bold text-base text-token-text">AI Provider & App Settings</h3>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-token-muted hover:text-token-text p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-token-muted mb-1.5">
                  AI Mode / Provider
                </label>
                <select
                  value={settings.provider}
                  onChange={(e) => setSettings({ ...settings, provider: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-token-border bg-token-bg text-sm focus:outline-none focus:ring-2 focus:ring-token-accent"
                >
                  <option value="mock">Offline Mock Engine (Recommended — Zero setup, 100% free)</option>
                  <option value="gemini">Google Gemini API (gemini-1.5-flash)</option>
                  <option value="openai">OpenAI API (gpt-4o-mini)</option>
                  <option value="custom">Custom OpenAI-Compatible Endpoint</option>
                </select>
                <p className="text-[11px] text-token-muted mt-1">
                  Offline mode drafts rich, role-tailored summaries and XYZ bullet points without an internet connection or API cost.
                </p>
              </div>

              {/* API Key (if not mock) */}
              {settings.provider !== 'mock' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-token-muted mb-1">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={settings.apiKey}
                      onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                      placeholder="sk-..."
                      className="w-full px-3.5 py-2 rounded-xl border border-token-border bg-token-bg text-sm font-mono focus:border-token-accent focus:ring-token-accent"
                    />
                    <p className="text-[11px] text-token-muted mt-1">
                      Stored only in your browser's LocalStorage. Never uploaded to any external server.
                    </p>
                  </div>

                  {settings.provider === 'custom' && (
                    <div>
                      <label className="block text-xs font-semibold text-token-muted mb-1">
                        Custom API Base URL
                      </label>
                      <input
                        type="url"
                        value={settings.apiEndpoint}
                        onChange={(e) => setSettings({ ...settings, apiEndpoint: e.target.value })}
                        placeholder="https://your-custom-llm.com/v1"
                        className="w-full px-3.5 py-2 rounded-xl border border-token-border bg-token-bg text-sm font-mono focus:border-token-accent focus:ring-token-accent"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-token-muted mb-1">
                      Model Identifier
                    </label>
                    <input
                      type="text"
                      value={settings.modelName}
                      onChange={(e) => setSettings({ ...settings, modelName: e.target.value })}
                      placeholder={settings.provider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini'}
                      className="w-full px-3.5 py-2 rounded-xl border border-token-border bg-token-bg text-sm font-mono focus:border-token-accent focus:ring-token-accent"
                    />
                  </div>
                </div>
              )}

              {/* Accent Color Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-token-muted mb-2">
                  Theme Accent Color
                </label>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-token-bg border border-token-border">
                  {COLOR_THEMES.map(theme => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        const updated = { ...settings, accentColor: theme.id };
                        setSettings(updated);
                        applyThemeSettings(updated);
                      }}
                      className={`relative w-7 h-7 rounded-full transition-all duration-150 flex items-center justify-center cursor-pointer ${
                        settings.accentColor === theme.id 
                          ? 'ring-2 ring-token-accent ring-offset-2 ring-offset-token-card scale-110 shadow-md' 
                          : 'opacity-75 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: theme.color }}
                      title={theme.name}
                    >
                      {settings.accentColor === theme.id && (
                        <span className="w-2 h-2 rounded-full bg-white shadow-sm inline-block" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Test Connection Button & Result */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  className="w-full py-2 rounded-xl border border-token-border bg-token-bg hover:bg-token-border text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{testingConnection ? 'Testing Connection...' : 'Test Provider Configuration'}</span>
                </button>

                {testResult && (
                  <div className={`mt-2 p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                    testResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                      : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
                  }`}>
                    {testResult.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>

              {/* Footer Save & Close */}
              <div className="flex justify-end gap-2 pt-3 border-t border-token-border">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 rounded-xl border border-token-border text-xs font-semibold hover:bg-token-card-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-token-accent hover:opacity-90 text-white text-xs font-bold shadow-subtle transition"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
