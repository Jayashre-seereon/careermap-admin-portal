import { useState, useEffect } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  TeamOutlined,
  BankOutlined,
  AppstoreOutlined,
  BookOutlined,
} from "@ant-design/icons";
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
import { getAdminDashboard } from "../api/adminDashboard";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement);

const PRIMARY       = "#9a2119";
const PRIMARY_DARK  = "#7a1a13";
const PRIMARY_LIGHT = "#c4392e";
const PRIMARY_BG    = "#fdf3f2";
const ACCENT        = "#e8c5c2";

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

  .bottom-card {
    background: #fff; border-radius: 16px; padding: 18px 20px;
    box-shadow: 0 2px 16px rgba(154,33,25,0.07); border: 1px solid #f2e3e2;
  }

  .dashboard-stat-grid,
  .dashboard-chart-grid,
  .dashboard-bottom-grid {
    display: grid;
  }

  .dashboard-stat-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 20px;
  }

  .dashboard-chart-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    gap: 20px;
    margin-bottom: 20px;
  }

  .dashboard-bottom-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    align-items: stretch;
  }

  .order-pill-row {
    display: flex;
    gap: 8px;
    margin-top: 14px;
  }

  @media (max-width: 1023px) {
    .dashboard-stat-grid,
    .dashboard-chart-grid,
    .dashboard-bottom-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 767px) {
    .dashboard-stat-grid,
    .dashboard-chart-grid,
    .dashboard-bottom-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .order-pill-row {
      flex-wrap: wrap;
    }
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

const PLAN_COLORS = ["#9a2119", "#c4392e", "#d4614f", "#e8927a", "#f0b8a8"];

export default function Dashboard() {
  const [animate, setAnimate] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 80);

    const loadDashboard = async () => {
      try {
        const res = await getAdminDashboard();
        setDashboardData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    loadDashboard();
  }, []);

  /* ── Derived values from API ── */
  const totalUsers      = dashboardData?.totalUsers      ?? 0;
  const totalMentors    = dashboardData?.totalMentors    ?? 0;
  const totalPlans      = dashboardData?.totalPlans      ?? 0;
  const totalInstitutions = dashboardData?.totalInstitutions ?? 0;
  const totalQuizzes    = dashboardData?.totalQuizzes    ?? 0;
  const planDistribution = dashboardData?.planDistribution ?? [];

  /* Subscription report chart */
  const subReport = dashboardData?.subscriptionReport ?? {};
  const subLabels = Object.keys(subReport);
  const subValues = Object.values(subReport);

  const subscriptionChartData = {
    labels: subLabels.length ? subLabels : ["", "", "", "", "", "", ""],
    datasets: [{
      label: "Subscriptions",
      data: subLabels.length ? subValues : [null, null, null, null, null, null, null],
      borderColor: PRIMARY,
      backgroundColor: "rgba(154,33,25,0.08)",
      borderWidth: 2, fill: true, tension: 0.4, pointRadius: subLabels.length ? 4 : 0,
      pointBackgroundColor: PRIMARY,
    }],
  };

  /* Login history chart */
  const loginHistory = dashboardData?.loginHistory ?? {};
  const loginLabels  = Object.keys(loginHistory);
  const loginValues  = Object.values(loginHistory);

  const loginChartData = {
    labels: loginLabels.length ? loginLabels : ["", "", "", "", "", "", "", "", "", ""],
    datasets: [{
      label: "Logins",
      data: loginLabels.length ? loginValues : [null, null, null, null, null, null, null, null, null, null],
      borderColor: PRIMARY,
      backgroundColor: "rgba(154,33,25,0.13)",
      borderWidth: 2.5, fill: true, tension: 0.45,
      pointBackgroundColor: PRIMARY,
      pointRadius: loginLabels.length ? 4 : 0,
      pointHoverRadius: 6,
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

  /* Donut chart from plan distribution */
  const totalSubscribers = planDistribution.reduce((acc, p) => acc + p.subscribers, 0);

  const donutData = {
    labels: planDistribution.map(p => p.planName),
    datasets: [{
      data: planDistribution.map(p => p.subscribers),
      backgroundColor: PLAN_COLORS.slice(0, planDistribution.length),
      hoverBackgroundColor: ["#430805", "#7a1a13", "#bc4e3d", "#d47060", "#e8927a"],
      borderWidth: 3, borderColor: "#fff", hoverOffset: 10,
    }],
  };

  const donutOptions = {
    responsive: true, maintainAspectRatio: false, cutout: "66%",
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} subscribers` } },
    },
  };

  /* Stat cards built from API */
  const statCards = [
    { label: "Total Users",        value: totalUsers,        icon: <TeamOutlined />,      grad: "linear-gradient(135deg,#3d0a07 0%,#6b1510 100%)" },
    { label: "Total Mentors",      value: totalMentors,      icon: <BookOutlined />,       grad: "linear-gradient(135deg,#7a1a13 0%,#9a2119 60%,#b03030 100%)" },
    { label: "Total Plans",        value: totalPlans,        icon: <AppstoreOutlined />,   grad: "linear-gradient(135deg,#9a2119 0%,#c4392e 100%)" },
    { label: "Total Institutions", value: totalInstitutions, icon: <BankOutlined />,       grad: "linear-gradient(135deg,#b5420d 0%,#e8793a 100%)" },
  ];

  return (
    <>
      <style>{globalStyle}</style>
      <div className="min-w-0">

        {/* Stat Cards */}
        <div className="dashboard-stat-grid">
          {statCards.map((c, i) => (
            <div key={i} className="stat-card" style={{ background: c.grad, ...anim(animate, i + 2) }}>
              <div style={{ fontSize: 24, marginBottom: 8, position: "relative", zIndex: 1 }}>{c.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", position: "relative", zIndex: 1, fontFamily: "'Sora', sans-serif" }}>
                {dashboardData ? c.value : "—"}
              </div>
              <div style={{ fontSize: 12, opacity: 0.82, marginTop: 4, position: "relative", zIndex: 1 }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="dashboard-chart-grid">
          <div style={{ ...baseCard, ...anim(animate, 0) }}>
            <div style={cardHeader}>
              Subscription Report
              <span style={badge}>Recent</span>
            </div>
            <div style={{ height: 180 }}>
              <Line
                data={subscriptionChartData}
                options={{
                  ...lineChartOptions,
                  scales: subLabels.length
                    ? lineChartOptions.scales
                    : { x: { display: false }, y: { grid: { color: "#f0e0df" }, ticks: { color: "#aaa", font: { size: 11 } } } },
                }}
              />
            </div>
            {!subLabels.length && (
              <div style={{ textAlign: "center", fontSize: 12, color: "#bbb", marginTop: 8 }}>No subscription data yet</div>
            )}
          </div>
          <div style={{ ...baseCard, ...anim(animate, 1) }}>
            <div style={cardHeader}>
              Daily Logins
              <span style={badge}>Recent</span>
            </div>
            <div style={{ height: 180 }}>
              <Line data={loginChartData} options={lineChartOptions} />
            </div>
            {!loginLabels.length && (
              <div style={{ textAlign: "center", fontSize: 12, color: "#bbb", marginTop: 8 }}>No login data yet</div>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="dashboard-bottom-grid">

          {/* Plan Distribution Donut */}
          <div className="bottom-card" style={anim(animate, 6)}>
            <div style={cardHeader}>Plan Distribution</div>

            {planDistribution.length > 0 ? (
              <>
                <div style={{ height: 155, position: "relative" }}>
                  <Doughnut data={donutData} options={donutOptions} />
                  <div style={{
                    position: "absolute", inset: 0, display: "flex",
                    flexDirection: "column", alignItems: "center", justifyContent: "center",
                    pointerEvents: "none",
                  }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: PRIMARY, fontFamily: "'Sora', sans-serif", lineHeight: 1 }}>
                      {totalSubscribers}
                    </span>
                    <span style={{ fontSize: 9, color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
                      Subscribers
                    </span>
                  </div>
                </div>

                <div className="order-pill-row">
                  {planDistribution.map((plan, i) => (
                    <div key={plan.planId} className="order-pill">
                      <span style={{ fontSize: 17, fontWeight: 800, color: PLAN_COLORS[i] ?? PRIMARY, fontFamily: "'Sora', sans-serif" }}>
                        {plan.percentage}%
                      </span>
                      <span style={{ fontSize: 10, color: "#666", fontWeight: 600, textAlign: "center" }}>{plan.planName}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ height: 155, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", fontSize: 13 }}>
                No plan data yet
              </div>
            )}
          </div>

          {/* Platform Overview */}
          <div className="bottom-card" style={anim(animate, 9)}>
            <div style={cardHeader}>Platform Overview</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
              {[
                { label: "Total Users",        value: totalUsers,        icon: "👥" },
                { label: "Total Mentors",       value: totalMentors,      icon: "🎓" },
                { label: "Total Quizzes",       value: totalQuizzes,      icon: "📝" },
                { label: "Total Institutions",  value: totalInstitutions, icon: "🏦" },
              ].map((u, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#555" }}>
                    <span>{u.icon}</span>{u.label}
                  </div>
                  <span style={{
                    fontWeight: 800, fontSize: 18, color: PRIMARY,
                    background: PRIMARY_BG, borderRadius: 8, padding: "2px 12px",
                    fontFamily: "'Sora', sans-serif",
                  }}>
                    {dashboardData ? u.value : "—"}
                  </span>
                </div>
              ))}
              {totalUsers > 0 && (
                <div style={{ marginTop: 4 }}>
                  <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>
                    Mentor ratio ({totalUsers > 0 ? Math.round((totalMentors / totalUsers) * 100) : 0}%)
                  </div>
                  <div style={{ background: ACCENT, borderRadius: 99, height: 8, overflow: "hidden" }}>
                    <div style={{
                      width: `${totalUsers > 0 ? Math.min((totalMentors / totalUsers) * 100, 100) : 0}%`,
                      height: "100%",
                      background: `linear-gradient(90deg,${PRIMARY},${PRIMARY_LIGHT})`,
                      borderRadius: 99, transition: "width 1s ease",
                    }} />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </>
  );
}