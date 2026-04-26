// Inline SVG Stroop grid — always perfectly spelled, no AI text artifacts.
const items: { word: string; ink: string }[] = [
  { word: 'RED', ink: '#1e6fdb' },
  { word: 'BLUE', ink: '#16a34a' },
  { word: 'GREEN', ink: '#dc2626' },
  { word: 'YELLOW', ink: '#db2777' },
  { word: 'PINK', ink: '#16a34a' },
  { word: 'ORANGE', ink: '#1e6fdb' },
  { word: 'PURPLE', ink: '#eab308' },
  { word: 'BROWN', ink: '#16a34a' },
  { word: 'BLACK', ink: '#dc2626' },
  { word: 'GREY', ink: '#1e6fdb' },
  { word: 'WHITE', ink: '#dc2626' },
  { word: 'TAN', ink: '#16a34a' },
];

export const StroopGrid = () => (
  <div className="grid grid-cols-3 gap-x-6 gap-y-4 p-6 bg-white rounded-md">
    {items.map((it, i) => (
      <div
        key={i}
        className="text-center font-extrabold text-lg sm:text-xl tracking-wide"
        style={{ color: it.ink }}
      >
        {it.word}
      </div>
    ))}
  </div>
);
