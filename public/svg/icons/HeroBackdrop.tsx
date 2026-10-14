import React from "react";

export function HeroBackdrop(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1440 1000"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M 0 0 H 1440 V 920 Q 720 1060 0 920 Z" fill="#004a19" />
    </svg>
  );
}
