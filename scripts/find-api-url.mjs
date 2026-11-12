const res = await fetch("https://www.ojarun.com/");
const html = await res.text();
const scripts = [...html.matchAll(/\/_next\/static\/[^"']+\.js/g)].map((m) => m[0]);
console.log("scripts", scripts.length);
const found = new Set();
for (const path of scripts.slice(0, 40)) {
  try {
    const js = await (await fetch(`https://www.ojarun.com${path}`)).text();
    const urls = js.match(/https?:\/\/[a-zA-Z0-9._:-]+/g) || [];
    for (const u of urls) {
      if (/api|4000|railway|render|fly\.io|heroku|amazonaws|onrender/i.test(u)) {
        found.add(u);
      }
    }
    if (js.includes("storefront-products")) {
      const near = js.match(/["']https?:[^"']+["']/g) || [];
      for (const n of near) {
        if (/storefront|api|4000/i.test(n)) found.add(n);
      }
      const lit = js.match(/NEXT_PUBLIC_API_URL|localhost:4000|[a-z0-9.-]+\.[a-z]{2,}\/storefront/gi);
      if (lit) lit.forEach((x) => found.add(x));
    }
  } catch {
    // ignore
  }
}
console.log([...found].join("\n") || "(none)");
