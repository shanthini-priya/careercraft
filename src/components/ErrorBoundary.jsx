import React from 'react';

const C = {
  indigo: { 50: 'rgba(37, 99, 235, 0.15)', 100: 'rgba(37, 99, 235, 0.3)', 400: '#3B82F6', 600: '#2563EB', 800: '#93C5FD' },
  violet: { 50: 'rgba(124, 58, 237, 0.15)', 100: 'rgba(124, 58, 237, 0.3)', 400: '#A855F7', 600: '#7C3AED', 800: '#C4B5FD' },
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0F172A',
    padding: 24,
  },
  card: {
    background: '#151B2E',
    borderRadius: 20,
    border: '1px solid #293252',
    padding: '48px 40px',
    maxWidth: 480,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    background: 'rgba(239,68,68,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    fontSize: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: '#F8FAFC',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: 15,
    color: '#94A3B8',
    lineHeight: 1.6,
    margin: '0 0 24px',
  },
  detailsToggle: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid #293252',
    borderRadius: 10,
    padding: '10px 16px',
    fontSize: 13,
    color: '#CBD5E1',
    cursor: 'pointer',
    width: '100%',
    marginBottom: 16,
    textAlign: 'left',
  },
  detailsContent: {
    background: '#2B0A0A',
    border: '1px solid #EF4444',
    borderRadius: 10,
    padding: '12px 16px',
    fontSize: 12,
    color: '#FCA5A5',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    textAlign: 'left',
    marginBottom: 16,
    maxHeight: 160,
    overflowY: 'auto',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 28px',
    borderRadius: 10,
    background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`,
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.18s',
  },
  btnOutline: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 28px',
    borderRadius: 10,
    background: 'transparent',
    color: C.indigo[400],
    fontWeight: 600,
    fontSize: 15,
    border: `1.5px solid ${C.indigo[400]}`,
    cursor: 'pointer',
    transition: 'all 0.18s',
  },
  btnRow: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  reportLink: {
    display: 'block',
    marginTop: 16,
    fontSize: 13,
    color: '#94A3B8',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta?.env?.DEV || process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
  };

  handleGoHome = () => {
    window.location.hash = '#home';
    this.handleReset();
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.icon}>⚠️</div>
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.subtitle}>
              An unexpected error occurred. You can try again or go back to the home page.
            </p>

            <button style={styles.detailsToggle} onClick={this.toggleDetails}>
              {this.state.showDetails ? '▾ Hide error details' : '▸ Show error details'}
            </button>

            {this.state.showDetails && this.state.error && (
              <div style={styles.detailsContent}>
                {this.state.error.message || 'Unknown error'}
                {'\n\n'}
                {this.state.error.stack || ''}
              </div>
            )}

            <div style={styles.btnRow}>
              <button style={styles.btnPrimary} onClick={this.handleReset}>
                Try Again
              </button>
              <button style={styles.btnOutline} onClick={this.handleGoHome}>
                Go Home
              </button>
            </div>

            <a
              href="https://github.com/anomalyco/opencode/issues"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.reportLink}
            >
              Report Issue →
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
