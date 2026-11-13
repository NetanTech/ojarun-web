"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type Customer = {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  deliveryArea: string | null;
  emailVerified: boolean;
};

class ApiError extends Error {}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.message || "Something went wrong. Please try again.");
  }

  return data as T;
}

export function registerCustomer(input: {
  name: string;
  phone: string;
  email: string;
  password: string;
  deliveryArea: string;
  referralCode?: string;
}) {
  return request<{ message: string; email: string }>("/customer-auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function loginCustomer(input: { phone: string; password: string }) {
  return request<{ accessToken: string; customer: Customer }>("/customer-auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function resendOtp(email: string) {
  return request<{ message: string; email: string }>("/customer-auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifyOtp(email: string, code: string) {
  return request<{ accessToken: string; customer: Customer }>(
    "/customer-auth/verify-otp",
    { method: "POST", body: JSON.stringify({ email, code }) },
  );
}

export function forgotPassword(email: string) {
  return request<{ message: string }>("/customer-auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifyResetOtp(email: string, code: string) {
  return request<{ resetToken: string }>("/customer-auth/verify-reset-otp", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export function resetPassword(resetToken: string, password: string) {
  return request<{ message: string }>("/customer-auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ resetToken, password }),
  });
}

export function updateProfile(
  token: string,
  input: { name?: string; email?: string; deliveryArea?: string },
) {
  return request<Customer>("/customer-auth/me", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
}

export function changePassword(
  token: string,
  input: { currentPassword: string; newPassword: string },
) {
  return request<{ message: string }>("/customer-auth/change-password", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
}

export function deactivateAccount(token: string) {
  return request<{ message: string }>("/customer-auth/deactivate", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// --- Session storage (browser-only) ---

const TOKEN_KEY = "ojarun_token";
const CUSTOMER_KEY = "ojarun_customer";
const PENDING_EMAIL_KEY = "ojarun_pending_email";

function persistSession(token: string, customer: Customer) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
}

function getStoredCustomer(): Customer | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CUSTOMER_KEY);
  return raw ? (JSON.parse(raw) as Customer) : null;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function forgetSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CUSTOMER_KEY);
}

// Reads the `exp` claim (seconds since epoch) from the JWT payload. Returns
// null when the token is malformed. This only reads the token; the backend
// still verifies the signature on every request.
function getTokenExpiryMs(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const { exp } = JSON.parse(atob(padded)) as { exp?: number };
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
}

// A session is only valid when both the profile and an unexpired token exist.
function hasValidSession(): boolean {
  const token = getToken();
  if (!token || !getStoredCustomer()) return false;
  const expiresAt = getTokenExpiryMs(token);
  return expiresAt !== null && expiresAt > Date.now();
}

function isAuthorizedApiCall(input: RequestInfo | URL, init?: RequestInit): boolean {
  const url =
    typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (!url.startsWith(API_URL)) return false;
  // change-password returns 401 for a wrong *current* password, which is a
  // form error, not a dead session.
  if (url.includes("/customer-auth/change-password")) return false;
  const headers = new Headers(
    init?.headers ?? (input instanceof Request ? input.headers : undefined),
  );
  return (headers.get("Authorization") || "").startsWith("Bearer ");
}

// Carries the email from register into the verify-email screen without
// putting it in the URL.
export function setPendingEmail(email: string) {
  sessionStorage.setItem(PENDING_EMAIL_KEY, email);
}

export function getPendingEmail(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PENDING_EMAIL_KEY);
}

export function clearPendingEmail() {
  sessionStorage.removeItem(PENDING_EMAIL_KEY);
}

// --- Shared session state ---
//
// Every component that needs to know who's logged in shares this one
// context instead of each independently reading localStorage into its own
// state. Without that, logging out in one component (e.g. the header) left
// every other already-mounted component (checkout, order history, the
// favourites provider) still holding onto the old customer until it
// happened to remount — the "still works as if I'm logged in" bug.

type CustomerSessionValue = {
  customer: Customer | null;
  ready: boolean;
  login: (token: string, customer: Customer) => void;
  logout: () => void;
};

const CustomerSessionContext = createContext<CustomerSessionValue | null>(null);

export function CustomerSessionProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [ready, setReady] = useState(false);

  // On load: drop a stored session whose token has expired (or is missing),
  // instead of showing the user as logged in with a dead token.
  useEffect(() => {
    if (hasValidSession()) {
      setCustomer(getStoredCustomer());
    } else {
      forgetSession();
      setCustomer(null);
    }
    setReady(true);
  }, []);

  // While logged in: log out when the token expires (timer, plus a re-check
  // when the tab regains focus, since timers pause in background tabs).
  useEffect(() => {
    if (!customer) return;
    const token = getToken();
    const expiresAt = token ? getTokenExpiryMs(token) : null;

    const expire = () => {
      if (!hasValidSession()) {
        forgetSession();
        setCustomer(null);
      }
    };

    // setTimeout overflows above ~24.8 days, so cap the delay and re-check.
    const delay = expiresAt ? Math.min(Math.max(expiresAt - Date.now(), 0), 2 ** 31 - 1) : 0;
    const timer = window.setTimeout(expire, delay);
    const onVisible = () => {
      if (document.visibilityState === "visible") expire();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [customer]);

  // While logged in: if the backend rejects our token (401) on any API call,
  // the session is dead (expired, secret rotated, account deactivated), so
  // log out and send the user to the login page.
  useEffect(() => {
    if (!customer) return;
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const res = await originalFetch(input, init);
      if (res.status === 401 && isAuthorizedApiCall(input, init)) {
        forgetSession();
        setCustomer(null);
        if (!window.location.pathname.startsWith("/login")) {
          window.location.assign("/login");
        }
      }
      return res;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, [customer]);

  const login = (token: string, nextCustomer: Customer) => {
    persistSession(token, nextCustomer);
    setCustomer(nextCustomer);
  };

  const logout = () => {
    forgetSession();
    setCustomer(null);
  };

  return (
    <CustomerSessionContext.Provider value={{ customer, ready, login, logout }}>
      {children}
    </CustomerSessionContext.Provider>
  );
}

export function useCustomerSession(): CustomerSessionValue {
  const ctx = useContext(CustomerSessionContext);
  if (!ctx) {
    throw new Error("useCustomerSession must be used inside a CustomerSessionProvider");
  }
  return ctx;
}
