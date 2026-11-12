import React from "react";

export function Home({
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
      <g clipPath="url(#clip0_1348_15960)">
        <path
          d="M9 13.5L9 11.25"
          stroke="#6C6C6C"
          strokeWidth="1.125"
          strokeLinecap="round"
        />
        <path
          d="M1.76354 9.91009C1.49878 8.18718 1.3664 7.32573 1.69212 6.56203C2.01785 5.79834 2.74052 5.27582 4.18585 4.2308L5.26574 3.45C7.06372 2.15 7.9627 1.5 9 1.5C10.0373 1.5 10.9363 2.15 12.7343 3.45L13.8141 4.2308C15.2595 5.27582 15.9821 5.79834 16.3079 6.56203C16.6336 7.32573 16.5012 8.18718 16.2365 9.91009L16.0107 11.3793C15.6353 13.8217 15.4477 15.0429 14.5717 15.7714C13.6958 16.5 12.4152 16.5 9.85411 16.5H8.14589C5.58475 16.5 4.30418 16.5 3.42825 15.7714C2.55232 15.0429 2.36465 13.8217 1.98932 11.3793L1.76354 9.91009Z"
          stroke="#6C6C6C"
          strokeWidth="1.125"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1348_15960">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

// Use this instead of Calendar in the checkout page
