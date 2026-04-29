import React from "react";

/* ===== REFINED PARTICLES (unchanged) ===== */
const PARTICLES = [
  { x: 8,  y: 10, size: 50, opacity: 0.12, duration: 6,   delay: 0 },
  { x: 80, y: 8,  size: 40, opacity: 0.12, duration: 7,   delay: 0.5 },
  { x: 20, y: 45, size: 45, opacity: 0.12, duration: 8,   delay: 1 },
  { x: 70, y: 30, size: 38, opacity: 0.12, duration: 6.5, delay: 0.3 },
  { x: 50, y: 80, size: 42, opacity: 0.12, duration: 9,   delay: 0.8 },
];

const STARS = [
  { x: 15, y: 8,  size: 72, duration: 6 },
  { x: 75, y: 18, size: 72, duration: 7 },
  { x: 40, y: 72, size: 72, duration: 5 },
  { x: 88, y: 48, size: 72, duration: 6.5 },
  { x: 55, y: 5,  size: 72, duration: 7.5 },
];

const CAPS = [
  { x: 5, y: 72, duration: 7,   w: 110, h: 80 },
  { x: 72, y: 68, duration: 7.4, w: 110, h: 80 },
  { x: 40, y: 5, duration: 8,   w: 110, h: 80 },
  
];

const PENCILS = [
  { x: 90, y: 10, duration: 7,   delay: 0,    w: 40, h: 120 },
  { x: 5,  y: 25, duration: 7.6, delay: 0.4,  w: 40, h: 120 },
  { x: 50, y: 60, duration: 8,   delay: 0.8,  w: 40, h: 120 },
  { x: 88, y: 82, duration: 7.2, delay: 1.2,  w: 40, h: 120 },
  { x: 30, y: 85, duration: 8.4, delay: 0.2,  w: 40, h: 120 },
];



export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* 🔴 PARTICLES — unchanged */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#c0392b]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `floatY ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* ✨ STARS — unchanged */}
      {STARS.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            opacity: 0.12,
            animation: `floatY ${s.duration}s ease-in-out infinite`,
          }}
        >
          <svg width={s.size} height={s.size} viewBox="0 0 24 24">
            <path
              d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
              fill="#c0392b"
            />
          </svg>
        </div>
      ))}

      {/* 🎓 CAPS — bigger (w/h scale up the fixed viewBox) */}
      {CAPS.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            opacity: 0.1,
            animation: `floatY ${c.duration}s ease-in-out infinite`,
          }}
        >
          <svg width={c.w} height={c.h} viewBox="0 0 36 26">
            <polygon points="18,0 36,8 18,16 0,8" fill="#c0392b" />
            <rect x="10" y="14" width="16" height="5" fill="#c0392b" />
            <line x1="34" y1="7" x2="34" y2="18" stroke="#c0392b" strokeWidth="1.5" />
            <circle cx="34" cy="19" r="1.5" fill="#c0392b" />
          </svg>
        </div>
      ))}
  

      {/* ✏️ PENCILS — bigger */}
      {PENCILS.map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: 0.1,
            animation: `floatY ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <svg width={p.w} height={p.h} viewBox="0 0 12 40">
            <rect x="2" y="4" width="8" height="28" fill="#c0392b" />
            <rect x="2" y="1" width="8" height="4" fill="#c0392b" opacity="0.5" />
            <rect x="2" y="30" width="8" height="3" fill="#c0392b" opacity="0.7" />
            <polygon points="2,33 10,33 6,39" fill="#c0392b" opacity="0.4" />
            <polygon points="4.5,36 7.5,36 6,39.5" fill="#c0392b" />
          </svg>
        </div>
      ))}

     

    </div>
  );
}