import React from "react";

export function CheckCheck({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M8 12.4852L12.243 16.7282L20.727 8.24316M3 12.4852L7.243 16.7282M15.728 8.24316L12.5 11.5002"
        stroke="#004A19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// this Search2 instead of the Search in the header
