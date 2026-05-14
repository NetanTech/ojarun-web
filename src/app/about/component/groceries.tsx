export default function GroceriesIllustration({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 401 409"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* ── Bowl / surface ─────────────────────────────────────── */}
      <rect x="40" y="290" width="320" height="40" rx="6" fill="#685842" />
      <rect x="40" y="298" width="320" height="8" fill="#A78C69" />

      {/* ── Bread loaf (right, tilted) ─────────────────────────── */}
      <g transform="translate(255 90) rotate(28)">
        <rect width="120" height="370" rx="48" fill="#FCA840" />
        <rect x="8" y="2" width="100" height="350" rx="40" fill="#FEB556" />
        <rect x="14" y="14" width="92" height="345" rx="38" fill="#F79D49" />
        {/* sesame seed / hole top */}
        <ellipse cx="92" cy="50" rx="22" ry="20" fill="#FED981" />
        <ellipse cx="92" cy="50" rx="18" ry="16" fill="#E6962D" opacity="0.85" />
        {/* circular bread-hole cross-sections down the middle */}
        {[120, 175, 230].map((cy) => (
          <g key={cy}>
            <circle cx="58" cy={cy} r="22" fill="#FED981" />
            <circle cx="58" cy={cy} r="18" fill="#E6962D" opacity="0.85" />
          </g>
        ))}
        {/* lighter streaks */}
        <rect x="10" y="14" width="6" height="340" rx="3" fill="#FDDA9C" opacity="0.5" />
        <rect x="100" y="30" width="6" height="320" rx="3" fill="#FDDA9C" opacity="0.4" />
      </g>

      {/* ── Cereal box (left) ──────────────────────────────────── */}
      <g transform="translate(40 70)">
        {/* box body */}
        <rect x="14" y="22" width="160" height="220" rx="2" fill="#FFD208" />
        {/* dark green cap */}
        <rect x="14" y="14" width="160" height="10" fill="#159F4A" />
        {/* green flap on top */}
        <path d="M2 0 L110 0 L114 14 L0 14 Z" fill="#21B844" />
        {/* green tab on left side */}
        <rect x="2" y="6" width="14" height="14" fill="#18AD3B" />
        {/* CEREAL label */}
        <text
          x="18"
          y="42"
          fontFamily="DM Sans, sans-serif"
          fontSize="14"
          fontWeight={700}
          fill="#FBE97C"
          letterSpacing="-0.04em"
        >
          CEREAL
        </text>
        {/* small thin yellow rim on left edge */}
        <rect x="2" y="14" width="14" height="50" fill="#DAAF15" />
        {/* cereal pieces inside top */}
        <ellipse cx="22" cy="32" rx="6" ry="11" fill="#94C83F" />
        <ellipse cx="20" cy="44" rx="6" ry="11" transform="rotate(-15 20 44)" fill="#67B946" />
        <ellipse cx="24" cy="56" rx="6" ry="11" transform="rotate(14 24 56)" fill="#873001" />
        {/* product art on the front of the box: bowl with cereal */}
        <ellipse cx="94" cy="160" rx="60" ry="14" fill="#FFFFFF" opacity="0.85" />
        <ellipse cx="94" cy="156" rx="60" ry="14" fill="#FFF2B8" />
        {[
          [70, 152], [86, 150], [102, 152], [118, 154], [78, 158], [110, 158], [94, 156],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="6" fill="#C66A1E" />
        ))}
        {/* logo placeholder strip */}
        <rect x="32" y="80" width="120" height="14" rx="2" fill="#FFFFFF" opacity="0.6" />
        <rect x="32" y="98" width="86" height="8" rx="2" fill="#FFFFFF" opacity="0.4" />
      </g>

      {/* ── Broccoli (left-front) ──────────────────────────────── */}
      <g transform="translate(150 200)">
        {/* stem */}
        <path
          d="M64 84 C 60 110, 56 130, 56 154 C 56 168, 80 168, 80 154 C 80 130, 78 110, 80 86 Z"
          fill="#94C83F"
        />
        <path
          d="M64 86 C 62 108, 60 130, 64 152 L 72 152 C 76 130, 76 108, 76 86 Z"
          fill="#67B946"
        />
        {/* florets — clustered circles to suggest broccoli head */}
        {[
          [40, 36, 28], [70, 22, 32], [104, 38, 28],
          [28, 60, 22], [56, 52, 28], [86, 56, 24], [114, 64, 22],
          [44, 78, 22], [76, 80, 24], [104, 84, 20],
        ].map(([cx, cy, r], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill="#226B36" />
            <circle cx={cx - r * 0.25} cy={cy - r * 0.25} r={r * 0.85} fill="#31A749" />
            <circle cx={cx - r * 0.35} cy={cy - r * 0.35} r={r * 0.5} fill="#67B946" />
            <circle
              cx={cx - r * 0.45}
              cy={cy - r * 0.45}
              r={r * 0.2}
              fill="#E0FF87"
              opacity="0.8"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
