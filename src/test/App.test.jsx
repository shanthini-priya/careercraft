import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('shows the navbar on home page', () => {
    window.location.hash = '#home';
    render(<App />);
    expect(screen.getAllByText('CareerCraft').length).toBeGreaterThan(0);
  });

  it('shows login page on #login route', () => {
    window.location.hash = '#login';
    render(<App />);
    expect(screen.getByText('Forgot password?')).toBeTruthy();
  });

  it('shows register page on #register route', () => {
    window.location.hash = '#register';
    render(<App />);
    expect(screen.getByText('Confirm password')).toBeTruthy();
  });
});
