import React from "react";
import Image from "next/image";

export default function Auth_footer() {
  return (
    <div className="w-full ">
      <Image
        src="/assets/Auth_footer.png"
        alt="Woman shopping for fresh tomatoes at a local market"
        width={1920}
        height={100}
        priority
        sizes="100vw"
        className="w-full h-auto object-cover object-bottom"
      />
    </div>
  );
}