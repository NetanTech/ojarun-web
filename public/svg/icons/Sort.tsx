import React from "react";

export function Sort({
  size,
  className,
  ...props
}: { size?: number | string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size ? size : "20"}
      height={size ? size : "20"}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M2.5 5.83325H17.5"
        stroke="#212121"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M5 10H15"
        stroke="#212121"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M8.33301 14.1667H11.6663"
        stroke="#212121"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
