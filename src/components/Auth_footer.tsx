import React from "react";
import Image from "next/image";

export default function Auth_footer() {
  return (
    <div className="w-full ">
      <Image
        src="/assets/Group 1215948444.png"
        alt="Fresh groceries laid out on a counter"
        width={4320}
        height={680}
        priority
        sizes="100vw"
        className="w-full h-auto object-cover object-bottom"
      />
    </div>
  );
}