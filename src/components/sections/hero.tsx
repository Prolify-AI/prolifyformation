"use client";

import Link from "next/link";
import { ArrowRight, Building2, Globe, Shield, Zap, TrendingUp, Users } from "lucide-react";
import { useEffect, useRef } from "react";

const STATS = [
  { value: "5,000+", label: "Founders Served" },
  { value: "50", label: "US States" },
  { value: "1 Week", label: "Avg. Formation" },
  { value: "100%", label: "Remote Process" },
];

const SERVICES = [
  { icon: Building2, label: "LLC Formation" },
  { icon: Shield, label: "Compliance" },
  { icon: TrendingUp, label: "Bookkeeping" },
  { icon: Zap, label: "Banking" },
  { icon: Users, label: "Taxes" },
  { icon: Globe, label: "Virtual Office" },
];

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.2 + 0.04,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,193,7,${p.alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,193,7,${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToPricing = () => {
    document.getElementById("prolify-pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-white overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(255,193,7,0.12) 0%, transparent 65%)",
        }}
      />

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFC107]/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/5 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-24 flex flex-col items-center text-center">

        <div className="mb-7 animate-[slideDown_0.5s_ease-out_both]">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/40 text-xs font-bold uppercase tracking-widest text-black/70">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-pulse" />
            Launch and run your US business, from anywhere
          </span>
        </div>

        <h1
          className="text-5xl sm:text-7xl md:text-[88px] font-black tracking-tighter text-black leading-[1.0] animate-[fadeInUp_0.7s_ease-out_0.15s_both]"
          style={{ letterSpacing: "-0.04em" }}
        >
          Your US Business,
          <span className="block mt-2">
            Built From{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Anywhere.</span>
              <span
                className="absolute bottom-1 left-0 w-full h-5 -z-0 opacity-50 rounded-sm"
                style={{ background: "#FFC107" }}
              />
            </span>
          </span>
        </h1>

        <p className="mt-8 text-lg sm:text-xl text-black/55 max-w-2xl leading-relaxed font-medium animate-[fadeInUp_0.7s_ease-out_0.3s_both] tracking-tight">
          Prolify is the{" "}
          <span className="font-bold text-black">all-in-one platform</span> for
          international founders — LLC formation, banking, bookkeeping, taxes,
          compliance, and analytics in one place.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 animate-[fadeInUp_0.7s_ease-out_0.45s_both]">
          <Link
            href="/signup"
            className="group relative inline-flex items-center justify-center gap-2 h-14 px-10 rounded-2xl bg-black text-white text-base font-bold tracking-tight overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(0,0,0,0.22)] active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-[#FFC107] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
              Start Your LLC Today
            </span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-black" />
          </Link>

          <button
            onClick={scrollToPricing}
            className="inline-flex items-center justify-center h-14 px-10 rounded-2xl border-2 border-black/10 bg-white/80 text-base font-bold text-black/70 tracking-tight transition-all duration-300 hover:border-black hover:text-black hover:bg-white hover:shadow-sm active:scale-[0.98]"
          >
            View Pricing
          </button>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2.5 animate-[fadeInUp_0.7s_ease-out_0.55s_both]">
          {SERVICES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-black/8 shadow-sm text-xs font-semibold text-black/65 transition-all duration-200 hover:border-[#FFC107]/60 hover:text-black hover:shadow-md cursor-default"
            >
              <span className="w-5 h-5 rounded-full bg-[#FFC107]/12 flex items-center justify-center flex-shrink-0">
                <Icon className="w-3 h-3 text-black/60" />
              </span>
              {label}
            </div>
          ))}
        </div>

        <div className="mt-16 w-full max-w-3xl animate-[fadeInUp_0.7s_ease-out_0.65s_both]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-black/6 rounded-2xl overflow-hidden border border-black/6 shadow-sm">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="bg-white px-6 py-5 flex flex-col items-center justify-center text-center"
              >
                <span className="text-2xl sm:text-3xl font-black text-black tracking-tight">{value}</span>
                <span className="text-xs font-semibold text-black/45 mt-1 uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
