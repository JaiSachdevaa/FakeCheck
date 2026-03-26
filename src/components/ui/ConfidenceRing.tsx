interface ConfidenceRingProps {
  confidence: number
  isFake: boolean
  size?: number
}

export function ConfidenceRing({ confidence, isFake, size = 120 }: ConfidenceRingProps) {
  const radius = 44
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius
  const progress = (confidence / 100) * circumference
  const color = isFake ? '#f43f5e' : '#22c55e'
  const glowId = `glow-${isFake ? 'red' : 'green'}`

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Track */}
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#292524" strokeWidth="8" />
      {/* Progress */}
      <circle
        cx={cx} cy={cy} r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        filter={`url(#${glowId})`}
        style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1)' }}
      />
      {/* Center text */}
      <text
        x={cx} y={cy - 7}
        textAnchor="middle"
        fontSize="20"
        fontWeight="600"
        fill={color}
        fontFamily="JetBrains Mono, monospace"
      >
        {confidence}%
      </text>
      <text
        x={cx} y={cy + 11}
        textAnchor="middle"
        fontSize="9"
        fill="#78716c"
        fontFamily="Syne, sans-serif"
        letterSpacing="1"
      >
        CONFIDENCE
      </text>
    </svg>
  )
}
