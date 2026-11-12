import React from "react";

export function ChevronRight({
  size,
  className,
  ...props
}: { size?: number | string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size ? size : "8"}
      height={size ? size : "14"}
      viewBox="0 0 8 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M0.900391 12.9L6.19328 7.60711C6.52662 7.27377 6.69328 7.10711 6.69328 6.9C6.69328 6.69289 6.52662 6.52623 6.19328 6.19289L0.900391 0.900001"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
