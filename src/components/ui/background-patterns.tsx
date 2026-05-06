export function DotPattern() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="dot-pattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
      </svg>
    </div>
  );
}

export function GridPattern() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid-pattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
}

export function WaveBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          fillOpacity="0.05"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </div>
  );
}

export function CircleDecoration({
  size = "lg",
  position = "top-right",
  color = "emerald",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: "emerald" | "amber" | "blue" | "purple";
}) {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
    xl: "w-96 h-96",
  };

  const positionClasses = {
    "top-left": "-top-16 -left-16",
    "top-right": "-top-16 -right-16",
    "bottom-left": "-bottom-16 -left-16",
    "bottom-right": "-bottom-16 -right-16",
  };

  const colorClasses = {
    emerald: "bg-gradient-to-br from-emerald-400 to-teal-500",
    amber: "bg-gradient-to-br from-amber-400 to-yellow-500",
    blue: "bg-gradient-to-br from-blue-400 to-cyan-500",
    purple: "bg-gradient-to-br from-purple-400 to-pink-500",
  };

  return (
    <div
      className={`absolute ${sizeClasses[size]} ${positionClasses[position]} ${colorClasses[color]} rounded-full opacity-20 blur-3xl -z-10`}
    />
  );
}

export function GradientBlob({
  variant = "emerald",
  className = "",
}: {
  variant?: "emerald" | "amber" | "blue" | "purple";
  className?: string;
}) {
  const variants = {
    emerald: "from-emerald-200/50 via-teal-200/50 to-emerald-300/50",
    amber: "from-amber-200/50 via-yellow-200/50 to-amber-300/50",
    blue: "from-blue-200/50 via-cyan-200/50 to-blue-300/50",
    purple: "from-purple-200/50 via-pink-200/50 to-purple-300/50",
  };

  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-60 animate-pulse ${variants[variant]} ${className}`}
      style={{ animationDuration: "8s" }}
    />
  );
}
