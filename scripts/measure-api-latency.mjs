/**
 * Measures public/key API endpoint latency.
 * Usage:
 *   node scripts/measure-api-latency.mjs
 *   node scripts/measure-api-latency.mjs https://api.example.com
 *   node scripts/measure-api-latency.mjs http://localhost:4000
 *
 * Authed endpoints (cart, orders) are skipped without API_TOKEN.
 *   set API_TOKEN=... before running for those.
 */

const base =
  process.argv[2] ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";
const token = process.env.API_TOKEN || "";
const RUNS = 20;

const endpoints = [
  { name: "products (catalog)", path: "/storefront-products", auth: false },
  {
    name: "products (search)",
    path: "/storefront-products?search=rice",
    auth: false,
  },
  { name: "cart", path: "/customer-cart", auth: true },
  { name: "orders list", path: "/customer-orders", auth: true },
];

function percentile(sorted, p) {
  if (!sorted.length) return null;
  const idx = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((p / 100) * sorted.length) - 1),
  );
  return sorted[idx];
}

async function timeOnce(url, auth) {
  const headers = {};
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  const t0 = performance.now();
  const res = await fetch(url, { headers });
  const ms = performance.now() - t0;
  await res.arrayBuffer().catch(() => {});
  return { ms, status: res.status, ok: res.ok };
}

async function measure(ep) {
  if (ep.auth && !token) {
    return { skipped: true, reason: "API_TOKEN not set" };
  }
  const url = `${base.replace(/\/$/, "")}${ep.path}`;
  const samples = [];
  let lastStatus = 0;
  for (let i = 0; i < RUNS; i++) {
    try {
      const { ms, status } = await timeOnce(url, ep.auth);
      samples.push(ms);
      lastStatus = status;
    } catch (err) {
      return { error: err.message || String(err) };
    }
  }
  samples.sort((a, b) => a - b);
  return {
    status: lastStatus,
    p50: Math.round(percentile(samples, 50)),
    p95: Math.round(percentile(samples, 95)),
    min: Math.round(samples[0]),
    max: Math.round(samples[samples.length - 1]),
  };
}

console.log(`API base: ${base}`);
console.log(`Runs per endpoint: ${RUNS}`);
console.log(`Auth token: ${token ? "set" : "not set (auth endpoints skipped)"}`);
console.log("---");

const rows = [];
for (const ep of endpoints) {
  const result = await measure(ep);
  rows.push({ name: ep.name, ...result });
  if (result.skipped) {
    console.log(`${ep.name}: SKIPPED (${result.reason})`);
  } else if (result.error) {
    console.log(`${ep.name}: ERROR ${result.error}`);
  } else {
    console.log(
      `${ep.name}: status=${result.status} p50=${result.p50}ms p95=${result.p95}ms (min=${result.min} max=${result.max})`,
    );
  }
}

const outPath = new URL("../docs/api-latency-latest.json", import.meta.url);
const fs = await import("fs");
fs.writeFileSync(
  outPath,
  JSON.stringify({ base, at: new Date().toISOString(), rows }, null, 2),
);
console.log(`Wrote ${outPath.pathname}`);
