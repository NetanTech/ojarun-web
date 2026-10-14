import React from "react";

export function ShoppingCart({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M6.66699 13.3333L13.9337 12.7278C16.2075 12.5383 16.7179 12.0417 16.9699 9.77406L17.5003 5"
        stroke="black"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M5 5L18.3333 5"
        stroke="black"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle
        cx="5.00065"
        cy="16.6667"
        r="1.66667"
        stroke="black"
        strokeWidth="1.25"
      />
      <circle
        cx="14.1667"
        cy="16.6667"
        r="1.66667"
        stroke="black"
        strokeWidth="1.25"
      />
      <path
        d="M6.66667 16.6667L12.5 16.6667"
        stroke="black"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M1.66699 1.66675L2.47199 1.66675C3.25923 1.66675 3.94544 2.18724 4.13637 2.92919L6.61576 12.5638C6.74105 13.0507 6.63383 13.5665 6.32386 13.968L5.5271 15.0001"
        stroke="black"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
