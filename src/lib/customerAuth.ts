import { useEffect, useState } from "react";

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

// --- Session storage (browser-only) ---

const TOKEN_KEY = "ojarun_token";
const CUSTOMER_KEY = "ojarun_customer";
const PENDING_EMAIL_KEY = "ojarun_pending_email";

export function saveSession(token: string, customer: Customer) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
}

export function getStoredCustomer(): Customer | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CUSTOMER_KEY);
  return raw ? (JSON.parse(raw) as Customer) : null;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CUSTOMER_KEY);
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

/**
 * Reads the logged-in customer from localStorage on mount. `ready` stays
 * false for one render so pages don't briefly flash a "logged out" state
 * before the client has had a chance to check storage.
 */
export function useCustomerSession() {
  const [customer, setCustomerState] = useState<Customer | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCustomerState(getStoredCustomer());
    setReady(true);
  }, []);

  const logout = () => {
    clearSession();
    setCustomerState(null);
  };

  return { customer, ready, logout };
}
