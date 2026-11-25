/**
 * Delivery runs go out at 9 am, 12 pm, 3 pm and 6 pm WAT. Keep this in step
 * with getDeliveryWindow in ojarun-backend-whatsapp (src/webhooks/delivery.util.ts):
 *   7:00 am – 9:59 am  → 12 pm today
 *   10:00 am – 12:59 pm → 3 pm today
 *   1:00 pm – 3:59 pm  → 6 pm today
 *   4:00 pm – midnight → 9 am tomorrow
 *   midnight – 6:59 am → 9 am today (the "next day" run for overnight orders)
 */
export interface DeliverySlot {
  time: "9 am" | "12 pm" | "3 pm" | "6 pm";
  day: "today" | "tomorrow";
  /** e.g. "12 pm today" */
  label: string;
}

export const DELIVERY_TIMES = ["9 am", "12 pm", "3 pm", "6 pm"] as const;

/** Minutes since midnight in WAT (Africa/Lagos, UTC+1, no DST). */
function watMinutes(now: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

export function getDeliverySlot(now: Date = new Date()): DeliverySlot {
  const mins = watMinutes(now);
  const slot = (time: DeliverySlot["time"], day: DeliverySlot["day"]) => ({
    time,
    day,
    label: `${time} ${day}`,
  });

  if (mins < 7 * 60) return slot("9 am", "today");
  if (mins < 10 * 60) return slot("12 pm", "today");
  if (mins < 13 * 60) return slot("3 pm", "today");
  if (mins < 16 * 60) return slot("6 pm", "today");
  return slot("9 am", "tomorrow");
}
