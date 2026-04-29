import { Users, UserCheck, Mail, TrendingUp } from "lucide-react";

const stats = [
  { icon: Users, label: "Total Users", value: 16, data: [5, 8, 6, 10, 12, 16] },
  { icon: UserCheck, label: "Active Users", value: 9, data: [2, 4, 5, 7, 6, 9] },
  { icon: Mail, label: "Email Unverified", value: 7, data: [6, 5, 4, 6, 5, 7] },
  { icon: TrendingUp, label: "Growth Rate", value: 12, data: [3, 6, 8, 10, 11, 12], suffix: "%" },
];

export default function UserStats() {
  return (
    <div className="rounded-2xl border border-[rgba(154,33,25,0.15)] bg-white/[0.04] p-5">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-black font-display font-semibold text-sm">
          User Overview
        </h3>

        <span className="text-[10px] text-[#9a2119] bg-[rgba(154,33,25,0.1)] border border-[rgba(154,33,25,0.2)] px-2 py-0.5 rounded-full">
          Live
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ icon: Icon, label, value, data, suffix }) => (
          
          <div
            key={label}
            className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[rgba(154,33,25,0.25)] hover:bg-white/[0.06] transition-all group"
          >
            
            {/* Top */}
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[rgba(154,33,25,0.1)] flex items-center justify-center">
                <Icon size={14} className="text-[#9a2119]" />
              </div>

              <p className="text-black font-bold text-sm font-display">
                {value}{suffix || ""}
              </p>
            </div>

            {/* Label */}
            <p className="text-[var(--text-muted)] text-[10px] mb-2">
              {label}
            </p>

            {/* Mini Bar Chart */}
            <div className="flex items-end gap-[3px] h-10">
              {data.map((val, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-[rgba(154,33,25,0.15)] group-hover:bg-[#9a2119] transition-all"
                  style={{
                    height: `${val * 5}%`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}