import React from "react";

export function Tag({
  size,
  className,
  ...props
}: { size?: number | string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size ? size : "20"}
      height={size ? size : "20"}
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M10.5371 10H10.5515M10.5407 16H10.555"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.70898 13H14.3757"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse
        cx="1.4375"
        cy="1.5"
        rx="1.4375"
        ry="1.5"
        transform="matrix(1 0 0 -1 15.334 8.00024)"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.65799 11.1439C1.69664 12.2643 1.67596 13.9546 2.55825 15.1437C4.30908 17.5033 6.22539 19.5029 8.48666 21.3298C9.62619 22.2505 11.2461 22.2289 12.3197 21.2258C15.2348 18.5022 17.9044 15.6559 20.4807 12.5279C20.7354 12.2187 20.8948 11.8397 20.9305 11.4336C21.0887 9.63798 21.4135 4.46467 20.0671 3.05974C18.7207 1.65481 13.7629 1.99377 12.0421 2.15876C11.653 2.19608 11.2898 2.36233 10.9934 2.62811C7.9958 5.31646 5.26808 8.10211 2.65799 11.1439Z"
        stroke="black"
        strokeWidth="1.5"
      />
    </svg>
  );
}
