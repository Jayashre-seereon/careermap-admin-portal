import { ExternalLink, Clock } from "lucide-react";

const tickets = [
  { id: "#82138311", subject: "A quick follow-up",        status: "Open", time: "2m ago"  },
  { id: "#50843750", subject: "EKiqyAwyrBiAQiYsCeaVBN",  status: "Open", time: "14m ago" },
  { id: "#69697835", subject: "Business Connection",      status: "Open", time: "1h ago"  },
  { id: "#33949006", subject: "QkuJnXJavZXwnBCqjyx",     status: "Open", time: "3h ago"  },
  { id: "#74675572", subject: "Inquiry",                  status: "Open", time: "5h ago"  },
];

const statusColors = {
  Open:     "text-amber-300 bg-amber-400/10 border-amber-400/20",
  Closed:   "text-slate-400 bg-slate-400/10 border-slate-400/20",
  Resolved: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
};

export default function TicketList() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div>
          <h3 className="text-white font-display font-semibold text-sm">Recent Tickets</h3>
          <p className="text-slate-600 text-[11px] mt-0.5">Support queue overview</p>
        </div>
        <button className="flex items-center gap-1 text-teal-400 text-xs hover:text-teal-300 transition-colors">
          View all <ExternalLink size={11} />
        </button>
      </div>
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-2 border-b border-white/5">
        <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">Subject</span>
        <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">Time</span>
        <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">Status</span>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {tickets.map((t) => (
          <div key={t.id} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-white/[0.025] transition-colors cursor-pointer group">
            <div>
              <span className="text-teal-400/60 text-[11px] font-mono">Ticket{t.id}</span>
              <p className="text-slate-300 text-xs font-medium mt-0.5 group-hover:text-white transition-colors">{t.subject}</p>
            </div>
            <div className="flex items-center gap-1 text-slate-600 text-[11px]"><Clock size={10} />{t.time}</div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${statusColors[t.status] || statusColors.Open}`}>{t.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}