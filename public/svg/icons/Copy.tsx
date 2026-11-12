import React from "react";

export function Copy({
  size,
  className,
  ...props
}: { size?: number | string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size ? size : "16"}
      height={size ? size : "16"}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M10.6673 8.59998V11.4C10.6673 13.7333 9.73398 14.6666 7.40065 14.6666H4.60065C2.26732 14.6666 1.33398 13.7333 1.33398 11.4V8.59998C1.33398 6.26665 2.26732 5.33331 4.60065 5.33331H7.40065C9.73398 5.33331 10.6673 6.26665 10.6673 8.59998Z"
        stroke="#004A19"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6673 4.59998V7.39998C14.6673 9.73331 13.734 10.6666 11.4007 10.6666H10.6673V8.59998C10.6673 6.26665 9.73398 5.33331 7.40065 5.33331H5.33398V4.59998C5.33398 2.26665 6.26732 1.33331 8.60065 1.33331H11.4007C13.734 1.33331 14.6673 2.26665 14.6673 4.59998Z"
        stroke="#004A19"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// This instead of landmark
