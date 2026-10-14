import React from "react";

export function OfferNotIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M33.2493 20.583C34.1994 20.583 34.991 20.8997 35.466 21.533C36.0993 22.1663 36.416 22.958 36.416 23.7497L23.7493 28.4997L12.666 25.333V11.083H15.6743L27.2327 15.358C28.0244 15.6747 28.4993 16.308 28.4993 17.0997C28.4993 17.5747 28.341 18.0497 28.0244 18.3663C27.7077 18.683 27.2327 18.9997 26.5993 18.9997H22.166L19.4743 17.8913L18.9993 19.3163L22.166 20.583H33.2493ZM3.16602 11.083H9.49935V28.4997H3.16602V11.083Z"
        fill="#004A19"
      />
    </svg>
  );
}
