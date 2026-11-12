import React from "react";

export function Minus({
  size,
  className,
  ...props
}: { size?: number | string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size ? size : "18"}
      height={size ? size : "18"}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M4.5 9H13.5"
        stroke="white"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
