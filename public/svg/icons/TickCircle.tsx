import React from "react";

export function TickCircle({
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
        d="M6.99984 12.8334C10.2082 12.8334 12.8332 10.2084 12.8332 7.00002C12.8332 3.79169 10.2082 1.16669 6.99984 1.16669C3.7915 1.16669 1.1665 3.79169 1.1665 7.00002C1.1665 10.2084 3.7915 12.8334 6.99984 12.8334Z"
        stroke="#0F973D"
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.521 7.00002L6.17183 8.65085L9.47933 5.34918"
        stroke="#0F973D"
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
