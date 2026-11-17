"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "../../../../../public/svg/svg";
import { ChevronDown } from "../../../../../public/svg/svg";
import { Check, ChevronUp } from "lucide-react";
import dynamic from "next/dynamic";
import { useCustomerSession } from "@/lib/customerAuth";
import { fetchMyOrder } from "@/lib/orders";
import ErrorState from "@/components/ui/ErrorState";

const TrackingMap = dynamic(() => import("./components/TrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-3xl bg-grey-50 animate-pulse" />
  ),
});

const container = {
  open: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const item = {
  closed: {
    opacity: 0,
    y: -4,
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
    },
  },
};

// Bodija Market, Ibadan. Used until the API sends the order's own pickup point.
const DEFAULT_PICKUP = { name: "Bodija Market, Ibadan", lat: 7.4359015, lng: 3.9157404 };

function stageFromTimeline(
  status: OrderProperties["status"],
  t: OrderTimeline,
): TrackingStage {
  if (status === "failed") return "cancelled";
  if (t.delivered) return "delivered";
  if (t.readyForPickup) return "ready";
  if (t.shoppingInProgress) return "shopping";
  return "received";
}

function stageMessage(stage: TrackingStage, market: string): string {
  switch (stage) {
    case "shopping":
      return `Your agent is shopping at ${market}`;
    case "ready":
      return "Your items are bought and packed for delivery";
    case "on_the_way":
      return "Your order is on the way";
    case "delivered":
      return "Delivered. Enjoy your meal!";
    case "cancelled":
      return "This order was cancelled";
    default:
      return "Order received. An agent will start shopping soon";
  }
}

const orderTimelines = [
  {
    title: "Order received",
    key: "orderReceived",
    time: "11:42 am",
  },
  {
    title: "Shopping in progress",
    key: "shoppingInProgress",
  },
  {
    title: "Ready for pickup",
    key: "readyForPickup",
  },
  {
    title: "Delivered",
    key: "delivered",
  },
];

const Page = () => {
  const { orderID } = useParams();
  const router = useRouter();
  const { customer, ready } = useCustomerSession();
  const [order, setOrder] = useState<OrderProperties | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSub, setShowSub] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 764);
  }, []);

  const loadOrder = () => {
    if (typeof orderID !== "string") return;
    setLoading(true);
    setError(null);
    fetchMyOrder(orderID)
      .then(setOrder)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Could not load this order.",
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!ready) return;
    if (!customer) {
      router.replace("/login");
      return;
    }
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, customer, orderID, router]);

  const timeline: OrderTimeline = order?.timeline ?? {
    orderReceived: false,
    shoppingInProgress: false,
    readyForPickup: false,
    delivered: false,
  };

  const timelineContent = (
    <div className="flex flex-col items-start w-full">
      {orderTimelines.map((item, index) => {
        const completed = timeline[item.key as keyof OrderTimeline];
        const isLast = index === orderTimelines.length - 1;

        return (
          <div key={item.key} className="flex items-start w-full gap-3">
            <div className="flex flex-col items-center">
              {completed ? (
                <div className="w-7 h-7 p-0.5 flex items-center justify-center border border-primary rounded-full">
                  <div className="w-5 h-5 rounded-full bg-green-700 flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                </div>
              ) : (
                <div
                  className={`${isMobile ? "w-7 h-7" : "w-7 h-7"} rounded-full border border-gray-300 bg-white`}
                />
              )}

              {!isLast && (
                <div
                  className={`w-px h-10 ${completed ? "bg-primary" : "bg-gray-200"}`}
                />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="font-medium">{item.title}</p>
                {index === 0 && (
                  <>
                    <div className="flex-1 border-t border-dashed border-gray-200" />
                    <p className="text-sm text-gray-500">{item.time}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-grey-300 body-medium">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <ErrorState
          message={error || "Order not found."}
          onRetry={loadOrder}
        />
      </div>
    );
  }

  const pickup = order.tracking?.pickup ?? DEFAULT_PICKUP;
  const destination: [number, number] | null = order.tracking?.destination
    ? [order.tracking.destination.lng, order.tracking.destination.lat]
    : null;
  const stage = order.tracking?.stage ?? stageFromTimeline(order.status, timeline);

  return (
    <div className="relative w-full h-screen">
      <motion.div
        layout
        transition={{
          layout: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
        className="fixed lg:absolute z-20 bottom-[3%] lg:bottom-auto inset-x-0 mx-3 lg:top-10 lg:left-10 lg:w-110 p-4 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.04)] rounded-lg flex items-start flex-col gap-4 cursor-pointer"
        onClick={() => setShowSub(!showSub)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowSub(!showSub);
          }
        }}
      >
        <AnimatePresence initial={false}>
          {isMobile && showSub && (
            <motion.div
              layout
              key="timeline"
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full overflow-hidden"
            >
              {timelineContent}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-green-50 p-2 flex items-center justify-center rounded-md shrink-0">
              <ShoppingBag />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-lg font-medium truncate">{order?.orderId}</p>
              <p className="text-sm text-grey-400">
                {stageMessage(stage, pickup.name)}
              </p>
            </div>
          </div>

          <button
            aria-label={showSub ? "Hide order progress" : "Show order progress"}
            className={`shrink-0 transition duration-150 ${showSub ? "rotate-180" : ""}`}
          >
            {isMobile ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {!isMobile && showSub && (
            <motion.div
              layout
              key="timeline"
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full overflow-hidden"
            >
              {timelineContent}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <TrackingMap pickup={[pickup.lng, pickup.lat]} destination={destination} />
    </div>
  );
};

export default Page;