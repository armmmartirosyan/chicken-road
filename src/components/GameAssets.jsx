// Legacy static chicken icon - kept for reference
export function ChickenIcon() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow */}
      <ellipse cx="70" cy="125" rx="30" ry="5" fill="rgba(0,0,0,0.2)" />

      {/* Body */}
      <ellipse
        cx="70"
        cy="80"
        rx="38"
        ry="35"
        fill="#FEFEFE"
        stroke="#2a2a2a"
        strokeWidth="2.5"
      />

      {/* Head */}
      <circle
        cx="70"
        cy="50"
        r="22"
        fill="#FEFEFE"
        stroke="#2a2a2a"
        strokeWidth="2.5"
      />

      {/* Comb */}
      <path
        d="M58 35 Q60 26 62 35 Q64 26 66 35 Q68 24 70 35 Q72 26 74 35 Q76 26 78 35 Q80 26 82 35"
        fill="#E74C3C"
        stroke="#C0392B"
        strokeWidth="1.8"
      />

      {/* Beak */}
      <path
        d="M80 50 L92 52 L80 54 Z"
        fill="#F39C12"
        stroke="#D68910"
        strokeWidth="1.2"
      />

      {/* Eye */}
      <circle cx="75" cy="46" r="5" fill="#2C3E50" />
      <circle cx="77" cy="44" r="2" fill="#ECF0F1" />

      {/* Wattle */}
      <ellipse
        cx="75"
        cy="62"
        rx="5"
        ry="8"
        fill="#E74C3C"
        stroke="#C0392B"
        strokeWidth="1.2"
      />

      {/* Wing */}
      <ellipse
        cx="88"
        cy="80"
        rx="18"
        ry="24"
        fill="#F8F8F8"
        stroke="#2a2a2a"
        strokeWidth="2"
        transform="rotate(15 88 80)"
      />

      {/* Tail feathers */}
      <path
        d="M40 75 Q35 65 38 60 Q36 70 40 75"
        fill="#F8F8F8"
        stroke="#2a2a2a"
        strokeWidth="1.5"
      />
      <path
        d="M38 80 Q32 72 34 66 Q33 76 38 80"
        fill="#F8F8F8"
        stroke="#2a2a2a"
        strokeWidth="1.5"
      />

      {/* Feet */}
      <g>
        <path
          d="M58 108 L56 120 M58 108 L60 120 M58 108 L58 120"
          stroke="#F39C12"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M82 108 L80 120 M82 108 L84 120 M82 108 L82 120"
          stroke="#F39C12"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function CarIcon() {
  return (
    <svg
      width="120"
      height="70"
      viewBox="0 0 120 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow */}
      <ellipse cx="60" cy="65" rx="35" ry="3" fill="rgba(0,0,0,0.2)" />

      {/* Car body */}
      <rect
        x="15"
        y="30"
        width="90"
        height="28"
        rx="6"
        fill="#FFB300"
        stroke="#F57C00"
        strokeWidth="2.5"
      />

      {/* Car roof/cabin */}
      <path
        d="M30 30 L38 12 L82 12 L90 30 Z"
        fill="#FFB300"
        stroke="#F57C00"
        strokeWidth="2.5"
      />

      {/* Windshield */}
      <path
        d="M40 14 L44 28 L65 28 L69 14 Z"
        fill="#64B5F6"
        stroke="#1976D2"
        strokeWidth="2"
      />

      {/* Side window */}
      <path
        d="M72 14 L76 28 L88 28 L87 14 Z"
        fill="#64B5F6"
        stroke="#1976D2"
        strokeWidth="2"
      />

      {/* Wheels */}
      <circle
        cx="32"
        cy="58"
        r="10"
        fill="#424242"
        stroke="#212121"
        strokeWidth="2.5"
      />
      <circle cx="32" cy="58" r="5" fill="#757575" />
      <circle
        cx="88"
        cy="58"
        r="10"
        fill="#424242"
        stroke="#212121"
        strokeWidth="2.5"
      />
      <circle cx="88" cy="58" r="5" fill="#757575" />

      {/* Headlight */}
      <circle
        cx="103"
        cy="42"
        r="4"
        fill="#FFF9C4"
        stroke="#F9A825"
        strokeWidth="1.5"
      />

      {/* Side detail line */}
      <line x1="15" y1="45" x2="105" y2="45" stroke="#F57C00" strokeWidth="2" />

      {/* Door handle */}
      <rect x="78" y="38" width="10" height="3" rx="1.5" fill="#E65100" />

      {/* Text "IN OUT" on roof */}
      <text
        x="60"
        y="24"
        fontSize="7"
        fill="#1565C0"
        fontWeight="bold"
        textAnchor="middle"
      >
        IN OUT
      </text>
    </svg>
  );
}
