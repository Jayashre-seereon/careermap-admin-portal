export default function StatCard({
  title,
  value,
  icon: Icon,
  accent,
  trend,
  trendLabel,
  gradient,
  subtitle,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 border border-[rgba(154,33,25,0.25)] transition-all duration-300 group 
      hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(154,33,25,0.15)]
      ${
        accent
          ? "bg-[rgba(154,33,25,0.08)]"
          : "bg-white/[0.04] hover:bg-white/[0.06]"
      }`}
    >
      {/* Glow */}
      {accent && (
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-[rgba(154,33,25,0.15)] blur-3xl" />
      )}

      {/* Content */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <p
            className={`text-xs font-medium tracking-wide mb-1 ${
              accent ? "text-[rgba(154,33,25,0.7)]" : "text-[var(--text-hint)]"
            }`}
          >
            {title}
          </p>

          <p
            className={`text-2xl font-display font-bold ${
              accent ? "text-[#9a2119]" : "text-black"
            }`}
          >
            {value}
          </p>

          {subtitle && (
            <p className="text-[var(--text-muted)] text-[11px] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
          ${
            accent
              ? "bg-[rgba(154,33,25,0.15)] text-[#9a2119]"
              : gradient
              ? `bg-gradient-to-br ${gradient} text-white`
              : "bg-white/5 text-[var(--text-hint)] group-hover:text-[#9a2119]"
          }`}
        >
          <Icon size={18} />
        </div>
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="flex items-center gap-1.5 relative z-10">
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
              trend >= 0
                ? "text-green-600 bg-green-100"
                : "text-red-500 bg-red-100"
            }`}
          >
            {trend >= 0 ? "+" : ""}
            {trend}%
          </span>

          <span className="text-[var(--text-muted)] text-[11px]">
            {trendLabel || "vs last month"}
          </span>
        </div>
      )}
    </div>
  );
}