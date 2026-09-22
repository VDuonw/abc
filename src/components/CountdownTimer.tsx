import React, { useEffect, useState } from "react";

type Props = {
  active: boolean;
  onTimeout: () => void;
  resetKey: number;
};

/**
 * Circular countdown timer with urgency animations.
 * Pulses when under 5s, red glow when under 3s.
 */
export const CountdownTimer = ({ active, onTimeout, resetKey }: Props) => {
  const [seconds, setSeconds] = useState(15);
  const maxSeconds = 15;

  // Reset when resetKey changes
  useEffect(() => {
    setSeconds(15);
  }, [resetKey]);

  // Tick down while active
  useEffect(() => {
    if (!active) return;
    if (seconds === 0) {
      onTimeout();
      return;
    }
    const id = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [active, seconds, onTimeout]);

  const progress = seconds / maxSeconds;
  const isUrgent = seconds <= 5;
  const isCritical = seconds <= 3;

  // SVG circular progress
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const getColor = () => {
    if (isCritical) return "#ef4444";
    if (isUrgent) return "#f59e0b";
    return "#60a5fa";
  };

  return (
    <div
      className={`relative flex items-center justify-center ${
        isCritical ? "animate-urgency" : isUrgent ? "animate-bounce-subtle" : ""
      }`}
    >
      {/* Glow backdrop */}
      {isUrgent && (
        <div
          className="absolute inset-0 rounded-full blur-lg opacity-40"
          style={{ backgroundColor: getColor() }}
        />
      )}

      {/* Circular SVG */}
      <svg width="56" height="56" viewBox="0 0 56 56" className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
        />
        {/* Progress ring */}
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
          style={{
            filter: isUrgent ? `drop-shadow(0 0 6px ${getColor()})` : "none",
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-mono font-extrabold text-lg ${
            isCritical ? "text-red-400" : isUrgent ? "text-amber-400" : "text-white/80"
          }`}
          style={{
            textShadow: isUrgent ? `0 0 10px ${getColor()}` : "none",
          }}
        >
          {seconds}
        </span>
      </div>
    </div>
  );
};
