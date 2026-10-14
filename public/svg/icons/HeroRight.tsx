import React from "react";

export function HeroRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="451"
      height="249"
      viewBox="0 0 450 449"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g opacity="0.4" filter="url(#filter0_n_221_397)">
        <g clipPath="url(#clip0_221_397)">
          <path
            d="M517.751 -33.1814L249.356 153.659C272.947 174.021 296.521 194.384 320.112 214.746C226.348 279.749 132.583 344.753 38.8186 409.756"
            stroke="url(#paint0_linear_221_397)"
            strokeWidth="83.64"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_n_221_397"
          x="0"
          y="-72"
          width="556.57"
          height="520.592"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="2 2"
            stitchTiles="stitch"
            numOctaves="3"
            result="noise"
            seed="8219"
          />
          <feColorMatrix
            in="noise"
            type="luminanceToAlpha"
            result="alphaNoise"
          />
          <feComponentTransfer in="alphaNoise" result="coloredNoise1">
            <feFuncA
              type="discrete"
              tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
            />
          </feComponentTransfer>
          <feComposite
            operator="in"
            in2="shape"
            in="coloredNoise1"
            result="noise1Clipped"
          />
          <feComponentTransfer in="alphaNoise" result="coloredNoise2">
            <feFuncA
              type="discrete"
              tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 "
            />
          </feComponentTransfer>
          <feComposite
            operator="in"
            in2="shape"
            in="coloredNoise2"
            result="noise2Clipped"
          />
          <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
          <feComposite
            operator="in"
            in2="noise1Clipped"
            in="color1Flood"
            result="color1"
          />
          <feFlood
            floodColor="rgba(255, 255, 255, 0.25)"
            result="color2Flood"
          />
          <feComposite
            operator="in"
            in2="noise2Clipped"
            in="color2Flood"
            result="color2"
          />
          <feMerge result="effect1_noise_221_397">
            <feMergeNode in="shape" />
            <feMergeNode in="color1" />
            <feMergeNode in="color2" />
          </feMerge>
        </filter>
        <linearGradient
          id="paint0_linear_221_397"
          x1="38.8186"
          y1="188.287"
          x2="517.751"
          y2="188.287"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0384615" stopColor="#336E47" stopOpacity="0" />
          <stop offset="0.5" stopColor="#336E47" stopOpacity="0.3" />
          <stop offset="0.855769" stopColor="#336E47" stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip0_221_397">
          <rect
            width="556.57"
            height="520.592"
            fill="white"
            transform="translate(0 -72)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
