"use client";

import React from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TickCircle, CancelCircle } from "../../../../../public/svg/svg";
import type { RewardTransaction } from "@/lib/rewards";

const statusVariants: Record<RewardTransaction["status"], string> = {
  successful: "bg-green-50 text-green-500",
  failed: "bg-red-50 text-red-500",
};

const statusIcon: Record<RewardTransaction["status"], React.ReactNode> = {
  successful: <TickCircle />,
  failed: <CancelCircle />,
};

interface ActivityTableProps {
  items: RewardTransaction[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ActivityTable = ({ items, loading, page, totalPages, onPageChange }: ActivityTableProps) => {
  return (
    <div className="border border-[#E7E7E7] rounded-[20px] bg-white w-full overflow-hidden">
      <div className="flex items-center justify-between px-6 py-6">
        <h6>Recent Activity</h6>
      </div>

      <div className="flex flex-col gap-3 px-6 pb-6">
        {loading ? (
          <p className="text-grey-300 body-medium">Loading your activity...</p>
        ) : items.length === 0 ? (
          <p className="text-grey-300 body-medium">
            No rewards activity yet — place an order to start earning points.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="border border-[#E7E7E7] rounded-xl px-4 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6"
            >
              <div className="flex flex-col md:w-24 shrink-0">
                <p className="text-grey-300 body-small">Date</p>
                <p className="body-medium font-medium">{item.date}</p>
              </div>
              <div className="flex flex-col flex-1">
                <p className="text-grey-300 body-small">Description</p>
                <p className="body-medium font-medium">{item.description}</p>
              </div>
              <div className="flex flex-col md:w-24 shrink-0">
                <p className="text-grey-300 body-small">Status</p>
                <p
                  className={clsx(
                    "py-0.5 px-1.5 rounded-full body-small capitalize flex items-center gap-1 w-fit",
                    statusVariants[item.status],
                  )}
                >
                  {statusIcon[item.status]}
                  {item.status}
                </p>
              </div>
              <div className="flex flex-col md:w-20 shrink-0 md:text-right">
                <p className="text-grey-300 body-small">Points</p>
                <p
                  className={clsx(
                    "body-medium font-medium",
                    item.points < 0 ? "text-red-500" : "text-grey-700",
                  )}
                >
                  {item.points > 0 ? "+" : ""}
                  {item.points.toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-4 border-t border-t-[#E7E7E7]">
          <button
            className="w-9 h-9 rounded-full bg-white border border-[#E7E7E7] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>
          <p className="body-small text-grey-400">
            Page {page} of {totalPages}
          </p>
          <button
            className="w-9 h-9 rounded-full bg-white border border-[#E7E7E7] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityTable;
