import { RegisterInput } from "../types/auth";
import { MedicationInput } from "../types/medication";
import { Stats } from "../types/stats";

const API_BASE = "http://localhost:8080";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

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

export function getCurrentUser() {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload || null;
  } catch (e) {
    return null;
  }
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
  }
  if (!res.ok) {
    const detail = data?.detail || data?.message || text || "Login failed";
    throw new Error(detail);
  }
  const token = data?.access_token || (data && data.access_token) || null;
  if (token) {
    localStorage.setItem("access_token", token);
  }
  return data;
}

export async function register(data: RegisterInput) {
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
  const token = resp?.access_token || null;
  if (token) localStorage.setItem("access_token", token);
  return resp;
}

export async function getStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/stats`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Stats fetch failed");
  return res.json();
}

export async function getMedicationRequests() {
  const res = await fetch(`${API_BASE}/lijekovi/requests`, { headers: getAuthHeaders() });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}
  if (!res.ok) {
    const detail = data?.detail || text || 'Failed to fetch requests';
    throw new Error(detail);
  }
  return data;
}

export async function approveRequest(requestId: number) {
  const res = await fetch(`${API_BASE}/lijekovi/${requestId}/approve`, { method: 'PUT', headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to approve request');
  return res.json();
}

export async function rejectRequest(requestId: number) {
  const res = await fetch(`${API_BASE}/lijekovi/${requestId}/reject`, { method: 'PUT', headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to reject request');
  return res.json();
}
export async function getUserInfo() {
  const res = await fetch(`${API_BASE}/korisnici/me`, { headers: getAuthHeaders() });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {
  }
  if (!res.ok) {
    const detail = data?.detail || text || 'Failed to fetch user info';
    throw new Error(detail);
  }
  return data;
}
    
export async function updateUserInfo(payload: { ime?: string; prezime?: string; email?: string, lozinka?: string }) {
  if (payload.email) {
    const email = String(payload.email).trim();
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) throw new Error('Invalid email format');
    payload.email = email;
  }
  if (payload.ime) payload.ime = String(payload.ime).trim();
  if (payload.prezime) payload.prezime = String(payload.prezime).trim();


  const tokenUserId = getUserIdFromToken();
  const useIdPath = typeof tokenUserId === 'string' && /^\d+$/.test(tokenUserId);
  const path = useIdPath ? `/korisnici/${tokenUserId}` : `/korisnici/me`;
  console.debug('updateUserInfo: using path', path);

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { }

  if (data && data.access_token) {
    try { localStorage.setItem('access_token', data.access_token); } catch (e) {}
  }

  if (!res.ok) {
    console.log('updateUserInfo error response', res.status, text);
    const detail = data?.detail || text || `Failed to update user (status ${res.status})`;
    const err = new Error(detail) as any;
    err.status = res.status;
    err.responseText = text;
    throw err;
  }

  return data?.user || data || null;
}

export async function createMedicationRequest(payload: { naziv: string; DjelatnaTvar?: string, nestasica?: boolean, accepted?: boolean }) {
  const res = await fetch(`${API_BASE}/lijekovi`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}
  if (!res.ok) {
    const detail = data?.detail || text || 'Failed to create request';
    throw new Error(detail);
  }
  return data;
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

export async function medicationTaken(lijek_id?: number) {
  const res = await fetch(`${API_BASE}/korisnik-lijek/${lijek_id}/confirm`, { method: "POST", headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to mark as taken");
  return res.json();
}

export async function snoozeReminder(lijek_id?: number) {
  const res = await fetch(`${API_BASE}/korisnik-lijek/${lijek_id}/snooze`, { method: "POST", headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to snooze");
  return res.json();
}

export async function dontRemindToday(lijek_id?: number) {
  const res = await fetch(`${API_BASE}/korisnik-lijek/${lijek_id}/skip`, { method: "POST", headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to set don't remind");
  return res.json();
}

export function logout() {
  try {
    localStorage.removeItem("access_token");
  } catch (e) {
  }
}
