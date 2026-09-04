"use client";

import React from "react";
import { getNotificationIcon } from "../../../../../lib/utils";

interface NotificationRowProps extends NotificationProps {
  onClick?: () => void;
}

const NotificationRow = ({ onClick, ...props }: NotificationRowProps) => {
  return (
    <div
      className="flex items-center gap-3 md:gap-5 w-full border border-[#E7E7E7] py-3 md:py-4 rounded-xl px-3 md:px-5 hover:bg-green-50/40 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        {getNotificationIcon(props.type)}

        {!props.isRead && (
          <div className="absolute bg-red-500 w-2.5 h-2.5 rounded-full -top-0.5 -right-0.5" />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="body-medium font-medium text-black">{props.title}</p>
        <p className="body-small text-grey-300">{props.message}</p>
      </div>
    </div>
  );
};

export default NotificationRow;
