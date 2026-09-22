import React from "react";

type Props = {
  affection: number;
};

/**
 * Affection bar with heart icon, gradient fill, and glow effects.
 * Color thresholds: green ≥50, yellow ≥20, red <20.
 */
export const AffectionBar = ({ affection }: Props) => {
  const percent = Math.max(0, Math.min(100, Math.round(affection)));

  const getBarColor = () => {
    if (affection >= 50) return "from-emerald-400 to-green-500";
    if (affection >= 20) return "from-yellow-400 to-amber-500";
    return "from-red-500 to-rose-600";
  };

  const getGlowColor = () => {
    if (affection >= 50) return "shadow-emerald-500/40";
    if (affection >= 20) return "shadow-amber-500/40";
    return "shadow-red-500/40";
  };

  return (
    <div className="flex items-center gap-2.5">
      {/* Heart icon */}
      <div className={`text-lg ${affection < 20 ? "animate-urgency" : "animate-bounce-subtle"}`}>
        {affection >= 50 ? "💖" : affection >= 20 ? "💛" : "💔"}
      </div>

      {/* Bar container */}
      <div className="flex flex-col gap-1">
        <div className={`w-36 h-3 bg-white/10 rounded-full overflow-hidden border border-white/20 shadow-lg ${getGlowColor()}`}>
          {/* Fill */}
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getBarColor()} transition-all duration-500 ease-out relative overflow-hidden`}
            style={{ width: `${percent}%` }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
          </div>
        </div>
        <span className="text-[10px] font-bold text-white/60 text-center tracking-wide">
          {affection}/100
        </span>
      </div>
    </div>
  );
};
