import React from "react";

export function DisLike({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.0138 3.7666L8.94714 2.1666C8.68047 1.89993 8.08047 1.7666 7.68047 1.7666H5.14714C4.34714 1.7666 3.48047 2.3666 3.28047 3.1666L1.68047 8.03327C1.34714 8.9666 1.94714 9.7666 2.94714 9.7666H5.61381C6.01381 9.7666 6.34714 10.0999 6.28047 10.5666L5.94714 12.6999C5.81381 13.2999 6.21381 13.9666 6.81381 14.1666C7.34714 14.3666 8.01381 14.0999 8.28047 13.6999L11.0138 9.63327"
        stroke="white"
        strokeMiterlimit="10"
      />
      <path
        d="M14.4134 3.76667V10.3C14.4134 11.2333 14.0134 11.5667 13.0801 11.5667H12.4134C11.4801 11.5667 11.0801 11.2333 11.0801 10.3V3.76667C11.0801 2.83333 11.4801 2.5 12.4134 2.5H13.0801C14.0134 2.5 14.4134 2.83333 14.4134 3.76667Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
