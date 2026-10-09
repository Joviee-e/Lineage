import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export function Logo({ className = "", size = "md", showTagline = true }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Trademark SVG Emblem: Medical Cross + Traceable Branching Nodes */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0B2A1F] via-[#134E3A] to-[#1A634B] shadow-sm text-white shrink-0 p-1.5 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Central Medical Cross Root */}
          <rect x="15" y="6" width="6" height="24" rx="2" fill="#E2E8F0" fillOpacity="0.9" />
          <rect x="6" y="15" width="24" height="6" rx="2" fill="#E2E8F0" fillOpacity="0.9" />
          
          {/* Core Intersection Node */}
          <circle cx="18" cy="18" r="4.5" fill="#10B981" />
          
          {/* Branching Traceability Pathway */}
          <path
            d="M18 18L27 9M18 18L9 27M18 18L27 27"
            stroke="#6EE7B7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 2"
          />
          
          {/* Verification Nodes */}
          <circle cx="27" cy="9" r="2.5" fill="#34D399" />
          <circle cx="9" cy="27" r="2.5" fill="#34D399" />
          <circle cx="27" cy="27" r="2.5" fill="#34D399" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-[#0B2A1F] ${textSizes[size]}`}>
            LINEAGE
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            PROTOTYPE
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
            Find. Verify. Protect.
          </span>
        )}
      </div>
    </div>
  );
}
