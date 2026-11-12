import React from "react";

export function HourGlass({
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
        d="M11.0837 1.16669V2.91669C11.0837 5.17185 9.25549 7.00002 7.00033 7.00002M2.91699 1.16669V2.91669C2.91699 5.17185 4.74516 7.00002 7.00033 7.00002M7.00033 7.00002C9.25549 7.00002 11.0837 8.82819 11.0837 11.0834V12.8334M7.00033 7.00002C4.74516 7.00002 2.91699 8.82819 2.91699 11.0834V12.8334"
        stroke="#F3A218"
        strokeWidth="0.875"
      />
      <path
        d="M2.3335 1.16669H11.6668M11.6668 12.8334H2.3335"
        stroke="#F3A218"
        strokeWidth="0.875"
        strokeLinecap="round"
      />
    </svg>
  );
}
