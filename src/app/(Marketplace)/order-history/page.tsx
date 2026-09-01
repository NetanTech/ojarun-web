"use client";

import React, { useState, useRef, useEffect } from "react";
import BreadCrumb from "../Acomponents/bread-crumb";
import {
  Search,
} from "../../../../public/svg/svg";
import { Funnel, Home, Sort } from "../../../../public/svg/svg";
import { usePathname } from "next/navigation";
import { MOCK_ORDERS } from "../../../../constants/data";
import OrderItemRow from "./components/OrderItemRow";
import Empty from "./components/Empty";


interface Filtertype {
  name: string;
  value: "all" | "in progress" | "completed";
}






const Page = () => {
  const pathName = usePathname();
  const [filter, setFilter] = useState<"all" | "in progress" | "completed">(
    "all",
  );

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

  const filters: Filtertype[] = [
    {
      name: "All orders",
      value: "all",
    },
    {
      name: "In progress",
      value: "in progress",
    },
    {
      name: "Completed",
      value: "completed",
    },
  ];
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
            title: "Order History",
            href: pathName,
          },
        ]}
      />
      <h6 className="text-green-500">Order history</h6>
      <div
        ref={filterRef}
        className="relative bg-[#F9F9F9] flex items-center p-1.5 rounded-xl overflow-hidden"
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

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="border border-[#E7E7E7] flex-1 w-full rounded-xl gap-2 px-1 py-2 flex items-center p-0">
            <Search />
            <input
              type="text"
              className="focus-within:border-0 focus-within:ring-0 text-black w-full"
              placeholder="Search...."
            />
          </div>
          <button className="border-[#E7E7E7] border p-2 rounded-xl flex items-center gap-2 text-black hover:bg-grey-50/50">
            <Funnel size={20} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        <button className="border-[#E7E7E7] border p-2 rounded-xl flex items-center gap-2 text-black hover:bg-grey-50/50 self-end sm:self-auto">
          <Sort size={20} />
          <span className="hidden sm:inline">Sort</span>
        </button>
      </div>

      <div className="flex flex-col my-3  gap-6 w-full">
        {(() => {
          const filtered = filter === 'all' ? MOCK_ORDERS : MOCK_ORDERS.filter(m => m.status === filter);
          return filtered.length > 0 ? (
            filtered.map((m) => <OrderItemRow {...m} key={m.orderId} />)
          ) : (
            <Empty />
          );
        })()}
      </div>
    </div>
  );
};

export default Page;
