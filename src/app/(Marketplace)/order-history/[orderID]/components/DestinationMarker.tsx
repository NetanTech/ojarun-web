export function DestinationMarker() {
  return (
    <div className="w-12 h-12 rounded-full bg-[#0B5D33] border-4 border-white flex items-center justify-center shadow-lg">
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="8"
          r="4"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d="M12 12v7"
          stroke="white"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}