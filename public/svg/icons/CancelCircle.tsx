import React from "react";

export function CancelCircle({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.74963 8.75L5.25 5.25M5.25037 8.75L8.75 5.25"
        stroke="#D42620"
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.8332 7.00004C12.8332 3.77838 10.2215 1.16671 6.99984 1.16671C3.77818 1.16671 1.1665 3.77838 1.1665 7.00004C1.1665 10.2217 3.77818 12.8334 6.99984 12.8334C10.2215 12.8334 12.8332 10.2217 12.8332 7.00004Z"
        stroke="#D42620"
        strokeWidth="0.875"
      />
    </svg>
  );
}
