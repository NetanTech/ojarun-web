"use client";

import React, { useEffect, useRef, useState } from "react";
import BreadCrumb from "../Acomponents/bread-crumb";
import { CheckCheck, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import { MOCK_NOTIFICATIONS } from "../../../../constants/data";
import NotificationRow from "./components/NotificationRow";
import { NotificationBell } from "../../../../public/svg/svg";

interface FilterType {
  name: string;
  value: "all" | "unread";
}

const filters: FilterType[] = [
  {
    name: "All",
    value: "all",
  },
  {
    name: "Unread",
    value: "unread",
  },
];



const Page = () => {
  const pathName = usePathname();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const filterRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeButton = buttonRefs.current[activeIndex];
    if (!activeButton || !filterRef.current) return;

    const containerRect = filterRef.current.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    setIndicatorStyle({
      left: buttonRect.left - containerRect.left,
      width: buttonRect.width,
    });
  }, [activeIndex]);
  return (
    <div className="md:max-w-300 lg:mx-auto mx-5 md:w-full flex flex-col items-start gap-2 my-5">
      <BreadCrumb
        item={[
          {
            icon: <Home size={18} className="text-grey-300" />,
            title: "Home",
            href: "/",
          },
          {
            title: "Notifications",
            href: pathName,
          },
        ]}
      />
      <h6 className="text-green-500">Notifications</h6>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
        <div
          ref={filterRef}
          className="relative bg-[#F9F9F9] flex items-center gap-5 p-1.5 rounded-xl overflow-hidden"
        >
          <span
            className="absolute bottom-1.5 top-1.5 bg-green-500 rounded-lg z-0 transition-all duration-150 ease-in-out"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
          {filters.map((f, i) => (
            <button
              ref={(el) => {
                buttonRefs.current[i] = el;
              }}
              className={`relative z-10 body-medium px-3 py-2 flex items-center justify-center rounded-lg ${i === activeIndex ? "text-white font-medium" : "text-grey-400"}`}
              key={i}
              onClick={() => {
                setActiveIndex(i);
                setFilter(f.value);
              }}
            >
              {f.name}
            </button>
          ))}
        </div>

        <Button as="button" className="text-green-500" size="sm"variant="secondary" leftIcon={ <CheckCheck /> }>
            Mark all as read
        </Button>
      </div>

      <div className="flex flex-col gap-5 w-full my-3">
        {(() => {
          const filtered = filter === 'all' ? MOCK_NOTIFICATIONS : MOCK_NOTIFICATIONS.filter(n => !n.isRead);
          return filtered.length > 0 ? (
            filtered.map((notification, i) => (
              <NotificationRow { ...notification } key={i} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 w-full gap-3">
              <NotificationBell />
              <p className="text-grey-300 body-medium">No notifications to show</p>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default Page;
