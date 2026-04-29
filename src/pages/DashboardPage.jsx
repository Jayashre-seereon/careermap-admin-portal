import { useState, useEffect } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement);

const PRIMARY       = "#9a2119";
const PRIMARY_DARK  = "#7a1a13";
const PRIMARY_LIGHT = "#c4392e";
const PRIMARY_BG    = "#fdf3f2";
const ACCENT        = "#e8c5c2";

const statCards = [
  { label: "Total Deposited",  value: "Rs0.00", icon: "💰", grad: "linear-gradient(135deg,#3d0a07 0%,#6b1510 100%)" },
  { label: "Deposited Charge", value: "Rs0.00", icon: "💸",  grad: "linear-gradient(135deg,#7a1a13 0%,#9a2119 60%,#b03030 100%)" },
  { label: "Total Plan",       value: "1",      icon: "🎁", grad: "linear-gradient(135deg,#9a2119 0%,#c4392e 100%)"},
  { label: "Total Services",   value: "6",      icon: "🚀", grad: "linear-gradient(135deg,#b5420d 0%,#e8793a 100%)" },
];

const tickets = [
  { id: "#82138311", subject: "A quick follow-up",       status: "Open" },
  { id: "#50843750", subject: "EKqyAwyrBlAOjYsCeaVBN",  status: "Open" },
  { id: "#69697835", subject: "Business Connection",     status: "Open" },
  { id: "#33949006", subject: "QkuJnXJauZXwnlBCqjyx",   status: "Open" },
  { id: "#74675572", subject: "Inquiry",                 status: "Open" },
];

const loginLabels = ["Jan-17","Jan-16","Jan-15","Jan-13","Jan-12","Jan-10","Jan-09","Jan-08","Jan-06","Jan-05"];
const loginData   = [2,1,2,1,1,1.5,3,4,1,2];

const lineChartData = {
  labels: loginLabels,
  datasets: [{
    label: "Logins", data: loginData,
    borderColor: PRIMARY, backgroundColor: "rgba(154,33,25,0.13)",
    borderWidth: 2.5, fill: true, tension: 0.45,
    pointBackgroundColor: PRIMARY, pointRadius: 4, pointHoverRadius: 6,
  }],
};

const lineChartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
  scales: {
    x: { grid: { color: "#f0e0df" }, ticks: { color: "#888", font: { size: 11 } } },
    y: { grid: { color: "#f0e0df" }, ticks: { color: "#888", font: { size: 11 } }, min: 0 },
  },
};

const emptyChartData = {
  labels: ["","","","","","",""],
  datasets: [{ label: "Subscriptions", data: [null,null,null,null,null,null,null],
    borderColor: PRIMARY, backgroundColor: "rgba(154,33,25,0.08)",
    borderWidth: 2, fill: true, tension: 0.4, pointRadius: 0 }],
};

/* ── Orders: red/crimson shades only ── */
const orderValues = { total: 24, approved: 14, pending: 7, rejected: 3 };
const ORDER_COLORS = { approved: "#9a2119", pending: "#c4392e", rejected: "#d4614f" };

const donutData = {
  labels: ["Approved", "Pending", "Rejected"],
  datasets: [{
    data: [orderValues.approved, orderValues.pending, orderValues.rejected],
    backgroundColor: [ORDER_COLORS.approved, ORDER_COLORS.pending, ORDER_COLORS.rejected],
    hoverBackgroundColor: ["#430805", "#7a1a13", "#bc4e3d"],
    borderWidth: 3, borderColor: "#fff", hoverOffset: 10,
  }],
};

const donutOptions = {
  responsive: true, maintainAspectRatio: false, cutout: "66%",
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} orders` } },
  },
};

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .stat-card {
    border-radius: 18px; padding: 20px 22px; color: #fff;
    cursor: default; position: relative; overflow: hidden;
    transition: transform 0.28s cubic-bezier(.34,1.56,.64,1), box-shadow 0.28s ease;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
  .stat-card::before {
    content: ''; position: absolute; top: -30px; right: -30px;
    width: 100px; height: 100px; background: rgba(255,255,255,0.10);
    border-radius: 50%; transition: transform 0.4s ease;
  }
  .stat-card::after {
    content: ''; position: absolute; bottom: -20px; left: -20px;
    width: 70px; height: 70px; background: rgba(255,255,255,0.07); border-radius: 50%;
  }
  .stat-card:hover { transform: translateY(-6px) scale(1.025); box-shadow: 0 12px 36px rgba(0,0,0,0.22); }
  .stat-card:hover::before { transform: scale(1.4); }

  .order-pill {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    flex: 1; gap: 3px; padding: 10px 6px; border-radius: 12px;
    transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: default;
  }
  .order-pill:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,0.12); }

  .ticket-row { transition: background 0.18s, padding-left 0.18s; cursor: pointer; }
  .ticket-row:hover { padding-left: 18px !important; }

  .bottom-card {
    background: #fff; border-radius: 16px; padding: 18px 20px;
    box-shadow: 0 2px 16px rgba(154,33,25,0.07); border: 1px solid #f2e3e2;
  }
`;

const cardHeader = {
  fontSize: 13, fontWeight: 700, color: "#555",
  letterSpacing: "0.03em", marginBottom: 10,
  textTransform: "uppercase", fontFamily: "'Sora', sans-serif",
};

const badge = {
  display: "inline-block", background: PRIMARY_BG, color: PRIMARY,
  borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700,
  marginLeft: 8, textTransform: "none", letterSpacing: 0,
};

function anim(animate, delay) {
  return {
    opacity: animate ? 1 : 0,
    transform: animate ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.5s ease ${delay * 0.06}s, transform 0.5s ease ${delay * 0.06}s`,
  };
}

const baseCard = {
  background: "#fff", borderRadius: 16, padding: "18px 20px",
  boxShadow: "0 2px 16px rgba(154,33,25,0.07)", border: "1px solid #f2e3e2",
};

export default function Dashboard() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { setTimeout(() => setAnimate(true), 80); }, []);

  const legendItems = [
    { label: "Approved", val: orderValues.approved, color: ORDER_COLORS.approved },
    { label: "Pending",  val: orderValues.pending,  color: ORDER_COLORS.pending  },
    { label: "Rejected", val: orderValues.rejected, color: ORDER_COLORS.rejected },
  ];

  return (
    <>
      <style>{globalStyle}</style>
      <div >

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
          {statCards.map((c, i) => (
            <div key={i} className="stat-card" style={{ background: c.grad, ...anim(animate, i + 2) }}>
              <div style={{ fontSize: 24, marginBottom: 8, position: "relative", zIndex: 1 }}>{c.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", position: "relative", zIndex: 1, fontFamily: "'Sora', sans-serif" }}>{c.value}</div>
              <div style={{ fontSize: 12, opacity: 0.82, marginTop: 4, position: "relative", zIndex: 1 }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, marginBottom: 20 }}>
          <div style={{ ...baseCard, ...anim(animate, 0) }}>
            <div style={cardHeader}>Subscriptions Report <span style={badge}>Last 30 days</span></div>
            <div style={{ height: 180 }}>
              <Line data={emptyChartData} options={{ ...lineChartOptions, scales: { x: { display: false }, y: { grid: { color: "#f0e0df" }, ticks: { color: "#aaa", font: { size: 11 } } } } }} />
            </div>
          </div>
          <div style={{ ...baseCard, ...anim(animate, 1) }}>
            <div style={cardHeader}>Daily Logins <span style={badge}>Last 10 days</span></div>
            <div style={{ height: 180 }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>

        {/* Bottom Row — equal 3 columns, equal height via align-items stretch */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, alignItems: "stretch" }}>

          {/* Orders Overview */}
          <div className="bottom-card" style={anim(animate, 6)}>
            <div style={cardHeader}>Orders Overview</div>

            <div style={{ height: 155, position: "relative" }}>
              <Doughnut data={donutData} options={donutOptions} />
              <div style={{
                position: "absolute", inset: 0, display: "flex",
                flexDirection: "column", alignItems: "center", justifyContent: "center",
                pointerEvents: "none",
              }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: PRIMARY, fontFamily: "'Sora', sans-serif", lineHeight: 1 }}>{orderValues.total}</span>
                <span style={{ fontSize: 9, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>Total</span>
              </div>
            </div>

            {/* Legend — single row, 3 pill cards */}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              {legendItems.map((row, i) => (
                <div key={i} className="order-pill" >
                   <span style={{ fontSize: 17, fontWeight: 800, color: row.color, fontFamily: "'Sora', sans-serif" }}>{Math.round((row.val / orderValues.total) * 100)}%</span>
                  <span style={{ fontSize: 10, color: "#666", fontWeight: 600 }}>{row.label}</span>
                   </div>
              ))}
            </div>
          </div>

          {/* User Overview */}
          <div className="bottom-card" style={anim(animate, 9)}>
            <div style={cardHeader}>User Overview</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
              {[
                { label: "Total Users",      value: 16, icon: "👥" },
                { label: "Active Users",     value: 9,  icon: "🟢" },
                { label: "Email Unverified", value: 7,  icon: "✉️" },
              ].map((u, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#555" }}>
                    <span>{u.icon}</span>{u.label}
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 18, color: PRIMARY, background: PRIMARY_BG, borderRadius: 8, padding: "2px 12px", fontFamily: "'Sora', sans-serif" }}>{u.value}</span>
                </div>
              ))}
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Active ratio</div>
                <div style={{ background: ACCENT, borderRadius: 99, height: 8, overflow: "hidden" }}>
                  <div style={{ width: "56%", height: "100%", background: `linear-gradient(90deg,${PRIMARY},${PRIMARY_LIGHT})`, borderRadius: 99, transition: "width 1s ease" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="bottom-card" style={anim(animate, 10)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={cardHeader}>Recent Tickets</span>
              <span style={{ fontSize: 12, color: PRIMARY, cursor: "pointer", fontWeight: 600 }}>View all →</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr auto",
                background: `linear-gradient(90deg,${PRIMARY},${PRIMARY_LIGHT})`,
                color: "#fff", padding: "8px 12px", borderRadius: "8px 8px 0 0",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.04em",
              }}>
                <span>SUBJECT</span><span>STATUS</span>
              </div>
              {tickets.map((t, i) => (
                <div key={i} className="ticket-row" style={{
                  display: "grid", gridTemplateColumns: "1fr auto",
                  padding: "9px 12px",
                  background: i % 2 === 0 ? "#fff" : PRIMARY_BG,
                  fontSize: 12, alignItems: "center",
                  borderBottom: "1px solid #f5e8e7",
                }}>
                  <span style={{ color: PRIMARY, fontWeight: 500 }}>{t.id} – {t.subject}</span>
                  <span style={{ background: "#e8f5e9", color: "#2e7d32", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      
      </div>
    </>
  );
}