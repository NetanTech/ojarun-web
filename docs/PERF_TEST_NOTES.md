# Performance / UX acceptance test notes

Date: 2026-10-14  
Prod site: https://www.ojarun.com/  
Prod API: `https://ojarun-backend-whatsapp.onrender.com`  
Branch work: frontend criteria pass (SVG split, image compression, pagination, blur placeholders, ErrorState + retry, cart sync toasts, modal responsive widths, Button spinner, place-order double-submit guard).

Targets: LCP ≤ 2.5s · INP ≤ 200ms · CLS ≤ 0.1 · API p95 ≤ 800ms

---

## 1. Core Web Vitals (mobile Lighthouse lab)

Tool: Lighthouse 12.x, mobile form factor, headless Chrome.  
INP is a field metric; lab runs often omit it — TBT is recorded as a lab interactivity proxy.

### Before (production, before this branch is deployed)

| Page | Perf score | LCP | CLS | TBT | INP (lab) |
|------|------------|-----|-----|-----|-----------|
| `/` | **41** | **7.77s** | **0.000** | 845ms | n/a |
| `/marketplace` | **17** | **12.53s** | **0.844** | 764ms | n/a |

Raw JSON: `docs/lh-baseline-home.json`, `docs/lh-baseline-marketplace.json`.

**Verdict (before):** Does **not** meet LCP/CLS targets on marketplace; home LCP fails; CLS on home already OK.

### After (this branch — local `next build && next start` on localhost:3000)

| Page | Perf score | LCP | CLS | TBT | INP (lab) |
|------|------------|-----|-----|-----|-----------|
| Local `/` | **61** | **6.24s** | **0.000** | 356ms | n/a |
| Local `/marketplace` | **56** | **8.62s** | **0.022** | 482ms | n/a |
| Prod after deploy | _re-run Lighthouse on ojarun.com once shipped_ | | | | |

Raw JSON: `docs/lh-after-home.json`, `docs/lh-after-marketplace.json`.

**Delta (prod before → local after):**

| Page | Score | LCP | CLS |
|------|-------|-----|-----|
| Home | 41 → **61** | 7.77s → **6.24s** | 0 → 0 |
| Marketplace | 17 → **56** | 12.53s → **8.62s** | 0.844 → **0.022** |

**Verdict (after):** Marketplace **CLS now meets ≤ 0.1**. LCP improved but still above 2.5s (remaining cost is largely hero/marketing media + API/network; cold Render wake on prod also hurts). Re-check on ojarun.com after deploy.

**Frontend mitigations included in after run:**

- Blur placeholders + reserved `aspect-[5/3]` on product/meal images (CLS).
- Lazy/sizes/`fill` on meal cards; priority only on first product cards (LCP).
- Marketplace grid paginated (24 + Show more); SVG barrel split; compressed static assets; maps dynamic-imported.

---

## 2. Product images

| Check | Status |
|-------|--------|
| Lazy below the fold | Pass — `loading="lazy"` unless `priority` |
| Optimised formats/sizes | Pass — Next `avif`/`webp` + `sizes` on cards |
| Placeholder (no blank/jump) | Pass — `placeholder="blur"` + shared LQIP (`src/lib/imagePlaceholder.ts`); grey aspect box behind image |
| Meal cards aligned | Pass — `MealProductCard` uses `fill` + blur + sizes |

---

## 3. Action feedback / double-submit

| Flow | Status |
|------|--------|
| Button loading spinner | Pass — `Button` shows `Loader2` when `isLoading` |
| Place order | Pass — `isLoading` + early return if already `loading` |
| Cart add | Pass — toast “Added to cart”; quantity UI updates immediately |
| Cart sync failure | Pass — toast + refetch cart from server |
| Promo / login / register | Pass (pre-existing disable-while-loading) |

---

## 4. Responsive (360 / 768 / 1024 / 1440)

Code fixes:

- Modals: `w-[35%]` / `w-[600px]` / `w-225` → `w-full max-w-* mx-4` (checkout, shopping list, orders, meal detail, header location).
- Order history page: `mx-5` → `w-full px-4` + `overflow-x-hidden`.

Manual checklist (verify in browser DevTools device mode):

| Width | Home | Marketplace | Cart drawer | Checkout |
|------:|:----:|:-----------:|:-----------:|:--------:|
| 360 | [ ] | [ ] | [ ] | [ ] |
| 768 | [ ] | [ ] | [ ] | [ ] |
| 1024 | [ ] | [ ] | [ ] | [ ] |
| 1440 | [ ] | [ ] | [ ] | [ ] |

Criteria: no horizontal scroll, no overlapping controls, no cut-off primary CTAs.

---

## 5. Throttled 3G (browse → cart → checkout)

Manual (Chrome DevTools → Network → Slow 3G):

| Step | Result |
|------|--------|
| Open `/marketplace` | [ ] usable / skeletons then content |
| Add item to cart | [ ] toast + qty within ~100ms |
| Open cart → checkout | [ ] no blank hang |
| Failed API (offline) | [ ] ErrorState + Try again where wired |

Frontend hang mitigations: ErrorState + Retry on marketplace/orders; cart sync errors toasted; product cache + inflight dedupe.

---

## 6. Slow / failed API UX

| Surface | Error + Retry |
|---------|----------------|
| Marketplace catalog/search | Pass — `ErrorState` + Try again (busts product cache) |
| Order history list | Pass |
| Order detail | Pass |
| Notifications / shopping lists | Pass (pre-existing) |
| Cart mutations | Pass — toast + server refetch (not silent) |

---

## 7. API latency (p95 ≤ 800ms)

Base: `https://ojarun-backend-whatsapp.onrender.com`  
Method: 12× curl wall-clock samples (see `docs/api-latency-latest.json`).

| Endpoint | p50 | p95 | Meets warm p95≤800ms? |
|----------|-----|-----|------------------------|
| `GET /storefront-products` | 342ms | **357ms** | **Yes** |
| `GET /storefront-products?search=rice` | 334ms | **363ms** | **Yes** |
| `GET /customer-cart` | — | — | Skipped (needs `API_TOKEN`) |
| `GET /customer-orders` | — | — | Skipped (needs token) |
| `GET /customer-orders/:id` | — | — | Skipped (needs token) |
| `POST /delivery/quote` | — | — | Skipped (needs token) |

**Cold start:** first catalog hit took **~33.4s** (Render free-tier wake). That blows any UX budget even though warm p95 is fine.

**Local backend:** `http://localhost:4000` was not running during measurement — re-run:

```bash
node scripts/measure-api-latency.mjs http://localhost:4000
# with auth:
# set API_TOKEN=... && node scripts/measure-api-latency.mjs http://localhost:4000
```

### Backend follow-up (implemented in `ojarun-backend-whatsapp`)

Cold-start mitigations added (deploy + enable GitHub Actions to take effect):

1. `GET /health` + `GET /ready`
2. Catalog cache warmup on boot
3. `.github/workflows/keep-alive.yml` — ping every 10 minutes
4. `docs/COLD_START.md` in the backend repo

Warm catalog/search already meet p95 ≤ 800ms. Authed cart/orders/quote still need `API_TOKEN` measurement locally after deploy.

---

## 8. Caching

| Behaviour | Status |
|-----------|--------|
| Products 60s in-memory cache + inflight dedupe | Pass (`src/lib/products.ts`) |
| Retry clears cache then refetches | Pass (marketplace Try again) |
| Back/forward within TTL avoids duplicate network | Pass (cache hit) |
| Cart wrong optimistic qty after failed sync | Mitigated — toast + refetch from server |
| Stale catalog up to 60s after admin edits | Accepted trade-off; Retry / TTL refresh |

---

## Sign-off summary

| Criterion | Met now? | Notes |
|-----------|----------|-------|
| CWV targets documented before/after | **Documented** | CLS target met on marketplace after; LCP still over 2.5s |
| Image lazy/optimised/placeholder | **Yes** | |
| Action feedback / no double order | **Yes** | |
| Responsive four widths | **Code yes** | Smoke HTTP 200 on core routes; tick table above in DevTools |
| 3G core flow | Checklist pending manual | Error/retry + skeletons in place |
| API error + retry | **Yes** | |
| API p95 ≤ 800ms documented | **Warm catalog/search yes** | Cold start ~33s on Render; authed skipped; **ask before backend changes** |
| Cache sensible | **Yes** | |

### Recommended next commands (on your machine)

```bash
npm run build && npm run start
# Lighthouse after (local):
npx lighthouse http://localhost:3000/ --form-factor=mobile --only-categories=performance --view
npx lighthouse http://localhost:3000/marketplace --form-factor=mobile --only-categories=performance --view

# API (local + authed):
node scripts/measure-api-latency.mjs http://localhost:4000
```
