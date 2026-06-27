import { motion, SVGMotionProps } from "framer-motion";

type FunSvgProps = SVGMotionProps<SVGSVGElement>;

export function SuccessIcon({
  className,
  ...props
}: FunSvgProps) {
  return (
    <motion.svg
      className={className}
      width="72"
      height="72"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ scale: 0, rotate: -90, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1, animationDuration: 'infinite'  }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 18,
      }}

      {...props}
    >
      <rect width="38" height="38" rx="19" fill="#004A19" />

      <motion.path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.95906 19.6259C9.34958 19.2354 9.98275 19.2354 10.3733 19.6259L14.9995 24.2521L27.6257 11.6259C28.0163 11.2354 28.6494 11.2354 29.0399 11.6259C29.4305 12.0164 29.4305 12.6496 29.0399 13.0401L15.7066 26.3734C15.3161 26.764 14.6829 26.764 14.2924 26.3734L8.95906 21.0401C8.56854 20.6496 8.56854 20.0164 8.95906 19.6259Z"
        fill="white"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          ease: "easeOut",
        }}
      />
    </motion.svg>
  );
}
