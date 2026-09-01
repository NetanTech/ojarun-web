"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "../../../../../public/svg/svg";
import { ChevronDown } from "../../../../../public/svg/svg";
import { Check, ChevronUp } from "lucide-react";
import TrackingMap from "./components/TrackingMap";
import { MOCK_ORDERS } from "../../../../../constants/data";

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

const route: [number, number][] = [
  [-97.744, 30.267],
  [-97.741, 30.27],
  [-97.736, 30.274],
  [-97.73, 30.278],
  [-97.724, 30.281],
];

const timelineStatus: OrderTimeline = {
  orderReceived: true,
  shoppingInProgress: false,
  readyForPickup: false,
  delivered: false,
};

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
  const order = MOCK_ORDERS.find((o) => o.orderId === orderID);
  const [showSub, setShowSub] = useState(false);
  const isMobile = window.innerWidth <= 764;

  const timelineContent = (
    <div className="flex flex-col items-start w-full">
      {orderTimelines.map((item, index) => {
        const completed = timelineStatus[item.key as keyof OrderTimeline];
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

        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 flex items-center justify-center rounded-md">
              <ShoppingBag />
            </div>
            <p className="text-lg font-medium">{order?.orderId}</p>
          </div>

          <button
            className={`transition duration-150 ${showSub ? "rotate-180" : ""}`}
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

      <TrackingMap
        routeCoordinates={route}
        pickup={route[0]}
        destination={route[route.length - 1]}
      />
    </div>
  );
};

export default Page;