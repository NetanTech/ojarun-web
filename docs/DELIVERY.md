# Delivery (pin-first) — webapp notes

Full system doc (API, WhatsApp, fees, env, migrations):

→ **`ojarun-backend/docs/DELIVERY.md`**

## This repo’s role

Checkout collects a **map pin** (`lat`/`lng`), quotes `POST /delivery/quote`, and creates the order with those coords. Text is only a label/landmark for the rider.

## Key files

| File | Role |
|------|------|
| `src/app/(Marketplace)/checkout/page.tsx` | Pin + quote state |
| `src/app/(Marketplace)/checkout/components/AddressMapPicker.tsx` | MapLibre pin UI |
| `src/app/(Marketplace)/checkout/components/DeliveryAddress.tsx` | Save / select pin |
| `src/app/(Marketplace)/checkout/components/OrderSummary.tsx` | Live fees + place order |
| `src/lib/delivery.ts` | Quote client |
| `src/lib/addresses.ts` | Addresses with lat/lng |
| `src/lib/orders.ts` | Create order with lat/lng |

## Required env

```bash
NEXT_PUBLIC_API_URL=https://your-api.example.com
NEXT_PUBLIC_MAPTILER_KEY=your-maptiler-key
```

Same MapTiler key as order tracking.
