"use client";

import React, { useEffect, useState } from "react";
import { DELIVERY_TIMES, getDeliverySlot } from "@/lib/deliverySchedule";

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M12 7.5V12l3 2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Shows which delivery run an order placed now will go out on. The slot is
 * re-read every 30s so it moves on if the customer sits past a cutoff; the
 * order itself takes its slot at the moment "Place order" is pressed.
 */
const DeliveryTime = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const slot = getDeliverySlot(now);

  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <p className="font-medium">Delivery time</p>
      <div className="flex items-center gap-3 w-full border border-[#E7E7E7] rounded-xl p-4">
        <ClockIcon />
        <div className="flex flex-col">
          <p className="body-medium font-medium" suppressHydrationWarning>
            Scheduled for {slot.label}
          </p>
          <p className="text-grey-300 body-small">
            We deliver at {DELIVERY_TIMES.join(", ").replace(/, (?=[^,]*$)/, " and ")}.
            Orders placed after 4 pm go out at 9 am the next day.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTime;
