import React from "react";

export function HeroBg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="w-full h-full object-cover object-top"
      viewBox="0 0 1718 650"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 0C670.861 207.049 1046.95 223.586 1718 0V650C1044.49 447.659 668.441 458.524 0 650V0Z"
        fill="url(#paint0_linear_135_255)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_135_255"
          x1="-37.5812"
          y1="325"
          x2="1718"
          y2="325"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F5F7CF" />
          <stop offset="0.298077" stopColor="white" stopOpacity="0.5" />
          <stop offset="0.480769" stopColor="white" />
          <stop offset="0.668269" stopColor="white" stopOpacity="0.5" />
          <stop offset="1" stopColor="#F5F7CF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
