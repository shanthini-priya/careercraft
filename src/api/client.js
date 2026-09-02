import { getSessionToken } from "./supabase";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "careercraft_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const isAuthenticated = () => !!getToken();

async function getAuthToken() {
  // Prefer a live Supabase session token; fall back to a legacy stored token.
  const supabaseToken = await getSessionToken();
  if (supabaseToken) return supabaseToken;
  return getToken();
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = await getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error("Network error. Please check your connection.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    // no JSON body
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
    }
    const message =
      data?.message || data?.error || data?.details?.[0]?.message || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.details = data?.details;
    throw error;
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  del: (path) => request(path, { method: "DELETE" }),
};

export default api;
