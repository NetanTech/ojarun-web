import React from "react";

export function Edit({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.8474 6.48826L11.4858 10.8498C10.6147 11.7209 10.1792 12.1564 9.64842 12.453C9.11768 12.7496 7.86442 13.048 6.66602 13.3333C6.95135 12.1349 7.24974 10.8817 7.54632 10.3509C7.8429 9.82018 8.27845 9.38463 9.14954 8.51354L13.5111 4.15199L14.6792 2.98386C15.3244 2.33871 16.3703 2.33871 17.0155 2.98386C17.6606 3.629 17.6606 4.67498 17.0155 5.32013L15.8474 6.48826ZM13.5111 4.15199L15.8474 6.48826"
        stroke="black"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 10C17.5 13.5355 17.5 15.3033 16.4016 16.4016C15.3033 17.5 13.5355 17.5 10 17.5C6.46447 17.5 4.6967 17.5 3.59835 16.4016C2.5 15.3033 2.5 13.5355 2.5 10C2.5 6.46447 2.5 4.6967 3.59835 3.59835C4.6967 2.5 6.46447 2.5 10 2.5"
        stroke="black"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
