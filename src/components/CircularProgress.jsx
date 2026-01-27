export function CircularProgress({ percentage, size = 140, strokeWidth = 10 }) {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (percentage / 100) * circumference

    return (
        <svg width={size} height={size}>
            <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
            </defs>
            <circle stroke="#e2e8f0" fill="none" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
            <circle stroke="url(#progressGradient)" fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} r={radius} cx={size / 2} cy={size / 2} style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-out' }} />
        </svg>
    )
}
