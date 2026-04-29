/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      /* ── Fonts ── */
      fontFamily: {
        display: ["DM Sans", "sans-serif"],
        body:    ["DM Sans", "sans-serif"],
      },

      /* ── Brand colors (mapped from CSS variables in index.css) ──
         Usage examples:
           bg-brand          → background: var(--brand-primary)
           text-brand-light  → color: var(--brand-primary-light)
           border-brand      → border-color: var(--brand-primary)
           bg-bg-surface     → background: var(--bg-surface)
           text-text-muted   → color: var(--text-muted)
      ── */
      colors: {
        brand: {
          DEFAULT: "var(--brand-primary)",
          dark:    "var(--brand-primary-dark)",
          light:   "var(--brand-primary-light)",
          accent:  "var(--brand-accent)",
        },
        bg: {
          base:     "var(--bg-base)",
          surface:  "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
          hover:    "var(--bg-hover)",
        },
        border: {
          DEFAULT: "var(--bg-border)",
          strong:  "var(--bg-border-strong)",
        },
        text: {
          primary:   "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted:     "var(--text-muted)",
          hint:      "var(--text-hint)",
        },
        status: {
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          info:    "var(--color-info)",
          danger:  "var(--color-danger)",
        },
      },

      /* ── Brand glow shadows ── */
      boxShadow: {
        brand:      "0 0 18px var(--glow-primary)",
        "brand-sm": "0 0 8px var(--glow-primary)",
        "brand-xs": "0 0 6px var(--glow-soft)",
      },

      /* ── Animations ── */
      animation: {
        "fade-in":  "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
