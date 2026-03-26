export function AshokaBg() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Tricolor vertical gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(255,153,51,0.10) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(19,136,8,0.10) 100%)",
        }}
      />

      {/* Ashoka Chakra watermark */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(70vw, 70vh)",
          height: "min(70vw, 70vh)",
          opacity: 0.035,
          animation: "chakra-spin 120s linear infinite",
        }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none">
          <circle cx="100" cy="100" r="95" stroke="#000080" strokeWidth="6" />
          <circle cx="100" cy="100" r="8" fill="#000080" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + 8 * Math.cos(rad);
            const y1 = 100 + 8 * Math.sin(rad);
            const x2 = 100 + 88 * Math.cos(rad);
            const y2 = 100 + 88 * Math.sin(rad);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#000080"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
