import { RegisterInput } from "../types/auth";
import { MedicationInput } from "../types/medication";
import { Stats } from "../types/stats";

// Backend default port in src/main.py is 8080. Update here if backend uses a different port.
// Backend routers are mounted at root (e.g. /login, /register, /stats)
const API_BASE = "http://localhost:8080";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// Decode JWT without verifying to extract 'sub' (user id) for client-side use
export function getUserIdFromToken() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload?.sub || null;
  } catch (e) {
    return null;
  }
}

export async function getAllMeds() {
  const res = await fetch(`${API_BASE}/lijekovi`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch medications");
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/user/me`, { headers: getAuthHeaders() });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}
  if (!res.ok) {
    const detail = data?.detail || text || 'Failed to fetch current user';
    throw new Error(detail);
  }
  return data;
}

export async function getUserReminders() {
  const res = await fetch(`${API_BASE}/korisnik-lijek`, { headers: getAuthHeaders() });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}
  if (!res.ok) {
    const detail = data?.detail || text || 'Failed to fetch reminders';
    throw new Error(detail);
  }
  return data;
}

export async function updateKorisnikLijek(lijek_id: number, entry: any) {
  const res = await fetch(`${API_BASE}/korisnik-lijek/${lijek_id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(entry)
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}
  if (!res.ok) {
    const detail = data?.detail || text || 'Failed to update reminder';
    throw new Error(detail);
  }
  return data;
}

export async function deleteKorisnikLijek(lijek_id: number) {
  const res = await fetch(`${API_BASE}/korisnik-lijek/${lijek_id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}
  if (!res.ok) {
    const detail = data?.detail || text || 'Failed to delete reminder';
    throw new Error(detail);
  }
  return data;
}

export async function createKorisnikLijek(entry: any) {
  const res = await fetch(`${API_BASE}/korisnik-lijek`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(entry)
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}
  if (!res.ok) {
    const detail = data?.detail || text || 'Failed to create reminder';
    throw new Error(detail);
  }
  return data;
}

export async function login(email: string, password: string) {
  // Backend expects field name `lozinka` for password
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, lozinka: password })
  });
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    // not JSON
  }
  if (!res.ok) {
    const detail = data?.detail || data?.message || text || "Login failed";
    throw new Error(detail);
  }
  // backend may return { access_token, token_type } or { user, access_token }
  const token = data?.access_token || (data && data.access_token) || null;
  if (token) {
    localStorage.setItem("access_token", token);
  }
  return data;
}

export async function register(data: RegisterInput) {
  // Backend expects fields: ime, prezime, email, lozinka
  const payload = {
    ime: (data as any).name || (data as any).ime || "",
    prezime: (data as any).surname || "",
    email: data.email,
    lozinka: data.password
  };
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  let resp: any = null;
  try { resp = text ? JSON.parse(text) : null; } catch (e) {}
  if (!res.ok) {
    const detail = resp?.detail || text || "Register failed";
    throw new Error(detail);
  }
  // store token if returned
  const token = resp?.access_token || null;
  if (token) localStorage.setItem("access_token", token);
  return resp;
}

export async function getStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/stats`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Stats fetch failed");
  return res.json();
}

export async function submitMedication(data: MedicationInput) {
  const res = await fetch(`${API_BASE}/medication`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Medication submit failed");
  return res.json();
}

export async function medicationTaken() {
  const res = await fetch(`${API_BASE}/medication/taken`, { method: "POST", headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to mark as taken");
  return res.json();
}

export async function snoozeReminder() {
  const res = await fetch(`${API_BASE}/medication/snooze`, { method: "POST", headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to snooze");
  return res.json();
}

export async function dontRemindToday() {
  const res = await fetch(`${API_BASE}/medication/dont-remind`, { method: "POST", headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to set don't remind");
  return res.json();
}
