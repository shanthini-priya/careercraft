import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when nothing in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('reads from localStorage if value exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('updates localStorage when setter is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    act(() => result.current[1]('new value'));

    expect(result.current[0]).toBe('new value');
    expect(JSON.parse(localStorage.getItem('test-key'))).toBe('new value');
  });

  it('handles JSON parse errors gracefully', () => {
    localStorage.setItem('test-key', 'invalid-json{{{');
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 10));

    act(() => result.current[1]((prev) => prev + 5));

    expect(result.current[0]).toBe(15);
  });

  it('handles complex objects', () => {
    const initial = { name: 'test', items: [1, 2, 3] };
    const { result } = renderHook(() => useLocalStorage('test-obj', initial));

    expect(result.current[0]).toEqual(initial);

    const updated = { name: 'updated', items: [4, 5] };
    act(() => result.current[1](updated));

    expect(result.current[0]).toEqual(updated);
    expect(JSON.parse(localStorage.getItem('test-obj'))).toEqual(updated);
  });
});
