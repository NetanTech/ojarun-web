import React from "react";

export function Repeat({ className, ...props }: React.SVGProps<SVGSVGElement>) {
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
        d="M2.9834 4.30005H14.5168C15.9001 4.30005 17.0168 5.41672 17.0168 6.80005V9.56672"
        stroke="white"
        strokeWidth="1.25"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.61673 1.66675L2.9834 4.30006L5.61673 6.93342"
        stroke="white"
        strokeWidth="1.25"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.0168 15.7H5.4834C4.10007 15.7 2.9834 14.5834 2.9834 13.2V10.4333"
        stroke="white"
        strokeWidth="1.25"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.3838 18.3333L17.0171 15.7L14.3838 13.0667"
        stroke="white"
        strokeWidth="1.25"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
