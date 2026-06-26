"use client";

export default function RailroadTrack({ currentIndex, total }) {
  const stationSpacing = 90;
  const padding = 200;
  const svgWidth = total * stationSpacing + padding * 2;
  const centerY = 50;
  const amplitude = 28;
  const svgHeight = 100;
  const omega = Math.PI / (stationSpacing * 2.5);
  const activeX = padding + currentIndex * stationSpacing + stationSpacing / 2;

  function waveY(x) {
    return centerY - amplitude * Math.cos(omega * (x - activeX));
  }

  function waveDerivative(x) {
    return amplitude * omega * Math.sin(omega * (x - activeX));
  }

  // Sample points: extra segments before the first station
  // and after the last station, plus each station position.
  const sampleXs = [0, padding];
  for (let i = 0; i < total; i++) {
    sampleXs.push(padding + i * stationSpacing + stationSpacing / 2);
  }
  sampleXs.push(padding + total * stationSpacing);
  sampleXs.push(svgWidth);

  // Build the track as a single <path> of cubic bezier segments.
  let d = `M ${sampleXs[0]} ${waveY(sampleXs[0])}`;
  for (let i = 0; i < sampleXs.length - 1; i++) {
    const x0 = sampleXs[i];
    const x1 = sampleXs[i + 1];
    const p0y = waveY(x0);
    const p1y = waveY(x1);
    const m0 = waveDerivative(x0);
    const m1 = waveDerivative(x1);
    const dx = x1 - x0;
    const cp0x = x0 + dx / 3;
    const cp0y = p0y + m0 * (dx / 3);
    const cp1x = x1 - dx / 3;
    const cp1y = p1y - m1 * (dx / 3);
    d += ` C ${cp0x} ${cp0y}, ${cp1x} ${cp1y}, ${x1} ${p1y}`;
  }

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="block"
    >
      <defs>
        <radialGradient id="activeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c48a5a" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c48a5a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Subtle glow under the active node area */}
      <circle
        cx={activeX}
        cy={waveY(activeX)}
        r={30}
        fill="url(#activeGlow)"
      />

      {/* Sine-wave track */}
      <path
        d={d}
        fill="none"
        stroke="#c48a5a"
        strokeWidth={2.5}
        strokeOpacity={0.7}
        strokeLinecap="round"
      />

      {/* Station ticks and nodes */}
      {Array.from({ length: total }).map((_, i) => {
        const x = padding + i * stationSpacing + stationSpacing / 2;
        const y = waveY(x);
        const dy = waveDerivative(x);
        const isActive = i === currentIndex;
        const isVisited = i < currentIndex;

        // Perpendicular tick mark (8px total length)
        const len = Math.sqrt(1 + dy * dy);
        const nx = (-dy / len) * 4;
        const ny = (1 / len) * 4;

        return (
          <g key={`station-${i}`}>
            {/* Tick mark */}
            <line
              x1={x + nx}
              y1={y + ny}
              x2={x - nx}
              y2={y - ny}
              stroke="#c48a5a"
              strokeWidth={1.5}
              strokeOpacity={0.6}
              strokeLinecap="round"
            />

            {/* Double-ring pulse for active node */}
            {isActive && (
              <>
                <circle
                  cx={x}
                  cy={y}
                  r={14}
                  fill="none"
                  stroke="#c48a5a"
                  strokeWidth={2}
                  className="station-pulse"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={20}
                  fill="none"
                  stroke="#c48a5a"
                  strokeWidth={1.5}
                  className="station-pulse"
                />
              </>
            )}

            {/* Node */}
            <circle
              cx={x}
              cy={y}
              r={isActive ? 14 : isVisited ? 10 : 8}
              fill={isActive ? "#c48a5a" : isVisited ? "#c48a5a" : "#e2cdb8"}
              fillOpacity={isActive ? 1 : isVisited ? 0.8 : 1}
            />

            {/* Number label */}
            <text
              x={x}
              y={y + (isActive ? 26 : 22)}
              textAnchor="middle"
              fill="#c48a5a"
              fillOpacity={isActive ? 0.85 : 0.5}
              fontSize={10}
              fontFamily="var(--font-nunito), Nunito, sans-serif"
              fontWeight={isActive ? 700 : 400}
            >
              {String(i + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
