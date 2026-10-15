/**
 * Smoke-check that key routes return 200 and HTML has no obvious
 * fixed-width desktop-only modal classes we already replaced.
 */
const base = process.argv[2] || "http://localhost:3000";
const routes = ["/", "/marketplace", "/checkout", "/about", "/order-history"];

let failed = 0;
for (const route of routes) {
  const url = `${base.replace(/\/$/, "")}${route}`;
  try {
    const t0 = performance.now();
    const res = await fetch(url);
    const ms = Math.round(performance.now() - t0);
    const html = await res.text();
    const bad = [];
    if (/w-\[600px\]/.test(html)) bad.push("w-[600px]");
    if (/w-225/.test(html)) bad.push("w-225");
    console.log(
      `${res.status} ${ms}ms ${route}${bad.length ? ` WARN ${bad.join(",")}` : ""}`,
    );
    if (!res.ok) failed++;
  } catch (err) {
    console.log(`ERR ${route} ${err.message || err}`);
    failed++;
  }
}
process.exit(failed ? 1 : 0);
