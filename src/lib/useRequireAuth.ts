"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCustomerSession } from "@/lib/customerAuth";

/** Redirects a guest to /login. Use the returned `customer`/`ready` to gate
 * rendering until the redirect (or a confirmed session) resolves. */
export function useRequireAuth() {
  const router = useRouter();
  const { customer, ready } = useCustomerSession();

  useEffect(() => {
    if (!ready) return;
    if (!customer) router.replace("/login");
  }, [ready, customer, router]);

  return { customer, ready };
}
