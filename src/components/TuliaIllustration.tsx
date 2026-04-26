import { ReactNode } from 'react';

/**
 * Inline SVG illustrations of TULIA gestures.
 * Each illustration is keyed by the TULIA item id (1–12) and depicts the
 * specific hand/arm position the patient must produce, so the on-screen
 * picture matches the test instruction.
 *
 * Style: minimal line drawings (currentColor strokes) so they inherit the
 * card's text color and stay sharp at any size.
 */

const Frame = ({ children, label }: { children: ReactNode; label: string }) => (
  <svg
    viewBox="0 0 100 100"
    role="img"
    aria-label={label}
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <rect x="1" y="1" width="98" height="98" rx="8" fill="hsl(var(--muted))" />
    <g
      stroke="hsl(var(--foreground))"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      {children}
    </g>
  </svg>
);

// Reusable forearm "stub" rising into the frame
const Forearm = ({ x = 50 }: { x?: number }) => (
  <path d={`M ${x - 8} 100 L ${x - 8} 78 Q ${x - 8} 72 ${x - 2} 72 L ${x + 2} 72 Q ${x + 8} 72 ${x + 8} 78 L ${x + 8} 100`} />
);

const TULIA_ILLUSTRATIONS: Record<number, ReactNode> = {
  // 1. Thumb extended on forehead, other fingers point upwards
  1: (
    <Frame label="Thumb on forehead, fingers up">
      {/* head outline */}
      <ellipse cx="50" cy="36" rx="18" ry="22" />
      <line x1="44" y1="34" x2="46" y2="34" />
      <line x1="54" y1="34" x2="56" y2="34" />
      <Forearm />
      {/* palm at forehead */}
      <path d="M 42 70 Q 42 60 50 60 Q 58 60 58 70 Z" />
      {/* four fingers up */}
      <line x1="44" y1="60" x2="44" y2="46" />
      <line x1="48" y1="60" x2="48" y2="42" />
      <line x1="52" y1="60" x2="52" y2="42" />
      <line x1="56" y1="60" x2="56" y2="46" />
      {/* thumb extended toward forehead */}
      <path d="M 42 64 Q 36 56 40 50" />
    </Frame>
  ),
  // 2. Wipe dust from shoulder
  2: (
    <Frame label="Wipe dust from shoulder">
      {/* shoulder/torso */}
      <path d="M 18 100 L 18 70 Q 30 56 50 56 L 50 100" />
      {/* opposite hand brushing across */}
      <path d="M 80 100 L 80 70 Q 80 60 70 58" />
      <path d="M 70 58 Q 60 56 52 60" />
      {/* motion lines on shoulder */}
      <path d="M 30 50 L 38 46" />
      <path d="M 32 56 L 40 52" />
      <path d="M 34 62 L 42 58" />
    </Frame>
  ),
  // 3. Drink from a glass (cylindrical grip near mouth)
  3: (
    <Frame label="Drink from a glass">
      <ellipse cx="50" cy="30" rx="14" ry="18" />
      {/* mouth */}
      <path d="M 46 38 Q 50 41 54 38" />
      <Forearm x={58} />
      {/* C-grip hand at mouth */}
      <path d="M 44 56 Q 36 50 36 42 Q 36 36 42 36" />
      <path d="M 44 56 Q 52 56 56 50" />
      {/* implied glass */}
      <path d="M 41 40 L 41 60 L 53 60 L 53 40" style={{ strokeDasharray: "2 2" }} />
    </Frame>
  ),
  // 4. Smoke a cigarette (V between index & middle to mouth)
  4: (
    <Frame label="Smoke a cigarette">
      <ellipse cx="50" cy="30" rx="14" ry="18" />
      <path d="M 46 38 Q 50 41 54 38" />
      <Forearm x={55} />
      {/* fist */}
      <circle cx="50" cy="56" r="8" />
      {/* index + middle fingers extended toward mouth */}
      <line x1="50" y1="48" x2="48" y2="40" />
      <line x1="50" y1="48" x2="52" y2="40" />
      {/* implied cigarette */}
      <line x1="46" y1="38" x2="40" y2="34" style={{ strokeDasharray: "2 2" }} />
      {/* smoke curl */}
      <path d="M 38 30 Q 36 26 40 24 Q 44 22 42 18" style={{ strokeDasharray: "2 2" }} />
    </Frame>
  ),
  // 5. Use a hammer (overhead striking motion)
  5: (
    <Frame label="Use a hammer">
      <Forearm x={40} />
      {/* arm raised */}
      <path d="M 40 72 L 60 50" />
      {/* fist */}
      <circle cx="62" cy="48" r="7" />
      {/* implied hammer */}
      <line x1="62" y1="48" x2="80" y2="30" style={{ strokeDasharray: "2 2" }} />
      <rect x="74" y="24" width="12" height="6" rx="1" style={{ strokeDasharray: "2 2" }} />
      {/* motion arc */}
      <path d="M 30 30 Q 50 18 76 28" style={{ strokeDasharray: "3 3" }} />
    </Frame>
  ),
  // 6. Use scissors (index + middle opening/closing)
  6: (
    <Frame label="Use scissors">
      <Forearm />
      <circle cx="50" cy="56" r="9" />
      {/* two fingers forming scissors */}
      <line x1="50" y1="47" x2="42" y2="30" />
      <line x1="50" y1="47" x2="58" y2="30" />
      {/* implied blades */}
      <line x1="42" y1="30" x2="36" y2="18" style={{ strokeDasharray: "2 2" }} />
      <line x1="58" y1="30" x2="64" y2="18" style={{ strokeDasharray: "2 2" }} />
      {/* finger holes */}
      <circle cx="46" cy="62" r="2.5" />
      <circle cx="54" cy="62" r="2.5" />
    </Frame>
  ),
  // 7. Use a stamp to postmark (downward press)
  7: (
    <Frame label="Use a stamp">
      <Forearm />
      <circle cx="50" cy="50" r="9" />
      {/* implied stamp handle */}
      <rect x="46" y="58" width="8" height="10" style={{ strokeDasharray: "2 2" }} />
      <rect x="42" y="68" width="16" height="6" style={{ strokeDasharray: "2 2" }} />
      {/* surface */}
      <line x1="20" y1="82" x2="80" y2="82" />
      {/* downward motion arrows */}
      <path d="M 30 30 L 30 44 M 27 41 L 30 44 L 33 41" />
      <path d="M 70 30 L 70 44 M 67 41 L 70 44 L 73 41" />
    </Frame>
  ),
  // 8. "Crazy" — index finger tapping at temple
  8: (
    <Frame label="Crazy gesture at temple">
      <ellipse cx="50" cy="40" rx="18" ry="22" />
      <line x1="45" y1="38" x2="47" y2="38" />
      <line x1="53" y1="38" x2="55" y2="38" />
      <path d="M 46 48 Q 50 51 54 48" />
      <Forearm x={78} />
      {/* hand at temple */}
      <circle cx="74" cy="48" r="6" />
      {/* index finger tapping temple */}
      <line x1="70" y1="44" x2="62" y2="40" />
      {/* tap motion arcs */}
      <path d="M 60 36 Q 56 38 60 42" style={{ strokeDasharray: "2 2" }} />
      <path d="M 56 34 Q 50 38 56 44" style={{ strokeDasharray: "2 2" }} />
    </Frame>
  ),
  // 9. Threatening sign — upraised clenched fist
  9: (
    <Frame label="Upraised clenched fist">
      {/* arm raised vertically */}
      <path d="M 42 100 L 42 40 Q 42 30 50 30 Q 58 30 58 40 L 58 100" />
      {/* fist knuckles */}
      <circle cx="50" cy="26" r="10" />
      <line x1="44" y1="22" x2="56" y2="22" />
      <line x1="44" y1="26" x2="56" y2="26" />
      <line x1="44" y1="30" x2="56" y2="30" />
      {/* motion lines */}
      <line x1="30" y1="20" x2="36" y2="22" />
      <line x1="70" y1="20" x2="64" y2="22" />
      <line x1="32" y1="14" x2="38" y2="18" />
      <line x1="68" y1="14" x2="62" y2="18" />
    </Frame>
  ),
  // 10. Brush your teeth (back-and-forth at mouth)
  10: (
    <Frame label="Brush teeth">
      <ellipse cx="50" cy="30" rx="14" ry="18" />
      <path d="M 44 38 L 56 38" />
      <Forearm x={58} />
      <circle cx="56" cy="50" r="7" />
      {/* implied toothbrush */}
      <line x1="52" y1="44" x2="42" y2="36" style={{ strokeDasharray: "2 2" }} />
      <rect x="36" y="32" width="8" height="4" style={{ strokeDasharray: "2 2" }} />
      {/* motion arrows */}
      <path d="M 34 26 L 24 26 M 27 23 L 24 26 L 27 29" />
      <path d="M 46 22 L 56 22 M 53 19 L 56 22 L 53 25" />
    </Frame>
  ),
  // 11. Comb hair (over the head)
  11: (
    <Frame label="Comb hair">
      <ellipse cx="50" cy="48" rx="20" ry="24" />
      <path d="M 46 56 Q 50 59 54 56" />
      <Forearm x={76} />
      {/* hand above head */}
      <circle cx="68" cy="38" r="7" />
      {/* implied comb teeth */}
      <line x1="62" y1="34" x2="50" y2="22" style={{ strokeDasharray: "2 2" }} />
      <line x1="50" y1="22" x2="50" y2="14" style={{ strokeDasharray: "2 2" }} />
      <line x1="46" y1="22" x2="46" y2="14" style={{ strokeDasharray: "2 2" }} />
      <line x1="54" y1="22" x2="54" y2="14" style={{ strokeDasharray: "2 2" }} />
      {/* sweep arc */}
      <path d="M 30 24 Q 50 12 70 24" style={{ strokeDasharray: "3 3" }} />
    </Frame>
  ),
  // 12. Use a screwdriver (rotation)
  12: (
    <Frame label="Use a screwdriver">
      <Forearm />
      <circle cx="50" cy="48" r="9" />
      {/* implied screwdriver */}
      <line x1="50" y1="56" x2="50" y2="78" style={{ strokeDasharray: "2 2" }} />
      <line x1="46" y1="78" x2="54" y2="78" style={{ strokeDasharray: "2 2" }} />
      {/* rotation arrows */}
      <path d="M 36 38 Q 30 48 36 58 M 33 55 L 36 58 L 39 55" />
      <path d="M 64 38 Q 70 48 64 58 M 61 55 L 64 58 L 67 55" transform="scale(-1 1) translate(-100 0)" />
      {/* surface */}
      <line x1="20" y1="86" x2="80" y2="86" />
    </Frame>
  ),
};

interface TuliaIllustrationProps {
  itemId: number;
  className?: string;
}

export const TuliaIllustration = ({ itemId, className }: TuliaIllustrationProps) => {
  const svg = TULIA_ILLUSTRATIONS[itemId];
  if (!svg) return null;
  return (
    <div className={className}>
      {svg}
    </div>
  );
};
