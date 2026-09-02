import { useState } from 'react';

const COLORS = {
  indigo: '#3B82F6',
  violet: '#A855F7',
  teal: '#06B6D4',
  amber: '#F0A320',
  coral: '#E8644A',
};

const STYLE_ID = 'portfolioai-spinner-keyframes';

function injectKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes portfolioai-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

export default function LoadingSpinner({ size = 40, color = 'indigo', text = '' }) {
  const strokeColor = COLORS[color] || COLORS.indigo;
  const r = (size / 2) - 4;
  const circ = 2 * Math.PI * r;

  injectKeyframes();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ animation: 'portfolioai-spin 0.8s linear infinite' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#293252"
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={3}
          strokeDasharray={`${circ * 0.3} ${circ * 0.7}`}
          strokeLinecap="round"
        />
      </svg>
      {text && (
        <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>
          {text}
        </span>
      )}
    </div>
  );
}
