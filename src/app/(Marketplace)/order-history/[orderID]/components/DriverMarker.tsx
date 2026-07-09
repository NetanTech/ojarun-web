interface DriverMarkerProps {
  bearing: number;
}

export function DriverMarker({
  bearing,
}: DriverMarkerProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-green-600/20 scale-[1.7]" />

      <div className="w-16 h-16 rounded-full bg-green-700 shadow-xl flex items-center justify-center">
        <div
          style={{
            transform: `rotate(${bearing}deg)`,
          }}
          className="text-white text-xl transition-transform duration-500"
        >
          ➤
        </div>
      </div>
    </div>
  );
}