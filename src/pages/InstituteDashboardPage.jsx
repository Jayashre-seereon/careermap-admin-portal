import { useEffect, useState } from "react";
import {
  CircleAlert,
  IndianRupee,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  Users,
  ClipboardCheck,
} from "lucide-react";
import { useSessionStore } from "../store/sessionStore";
import { getInstituteDashboard } from "../api/instituteDashboard";

const statCardBase =
  "rounded-[24px] border border-white/70 bg-white p-5 shadow-[0_12px_40px_rgba(75,15,11,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(75,15,11,0.12)]";

const statCards = [
  {
    key: "totalStudents",
    label: "Total Students",
    icon: Users,
    tone: "from-[#8f2218] to-[#c7482f]",
  },
  {
    key: "studentLimit",
    label: "Student Limit",
    icon: GraduationCap,
    tone: "from-[#7b1b15] to-[#9e3428]",
  },
  {
    key: "availableSeats",
    label: "Available Seats",
    icon: ShieldCheck,
    tone: "from-[#a64d24] to-[#da7a34]",
  },
  {
    key: "quizAttempted",
    label: "Quiz Attempted",
    icon: ClipboardCheck,
    tone: "from-[#5a1a34] to-[#a12d53]",
  },
  {
    key: "quizNotAttempted",
    label: "Quiz Pending",
    icon: CircleAlert,
    tone: "from-[#4e3620] to-[#ae7a34]",
  },
];

export default function InstituteDashboardPage() {
  const currentUser = useSessionStore((state) => state.user);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const response = await getInstituteDashboard();
        if (mounted) {
          setDashboardData(response?.data || {});
        }
      } catch (error) {
        if (mounted) {
          setDashboardData({});
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const totalStudents = dashboardData?.totalStudents ?? 0;
  const studentLimit = dashboardData?.studentLimit ?? 0;
  const availableSeats = dashboardData?.availableSeats ?? 0;
  const quizAttempted = dashboardData?.quizAttempted ?? 0;
  const quizNotAttempted = dashboardData?.quizNotAttempted ?? 0;
  const seatUsage = studentLimit > 0 ? Math.min((totalStudents / studentLimit) * 100, 100) : 0;
  const quizTotal = quizAttempted + quizNotAttempted;
  const quizProgress = quizTotal > 0 ? Math.min((quizAttempted / quizTotal) * 100, 100) : 0;

  const summaryItems = [
    {
      label: "Capacity used",
      value: `${Math.round(seatUsage)}%`,
      hint: `${totalStudents} of ${studentLimit || 0} seats filled`,
    },
    {
      label: "Quiz progress",
      value: `${Math.round(quizProgress)}%`,
      hint: `${quizAttempted} attempted, ${quizNotAttempted} pending`,
    },
  ];

  return (
    <div className="space-y-6">
     

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = loading ? "—" : dashboardData?.[card.key] ?? 0;

          return (
            <div key={card.key} className={statCardBase}>
              <div className={`inline-flex rounded-2xl bg-gradient-to-br ${card.tone} p-3 text-white shadow-lg`}>
                <Icon size={18} />
              </div>
              <div className="mt-4 text-3xl font-black tracking-tight text-slate-900">{value}</div>
              <div className="mt-1 text-sm font-medium text-slate-500">{card.label}</div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-[#eaded8] bg-white p-6 shadow-[0_16px_50px_rgba(75,15,11,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8f2218]">Capacity snapshot</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">Seat movement and room to grow</h2>
            </div>
            <div className="rounded-2xl bg-[#fff5f3] px-4 py-3 text-right">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#8f2218]">Available</p>
              <p className="mt-1 text-2xl font-black text-[#8f2218]">{availableSeats}</p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">Filled seats</span>
                <span className="font-semibold text-slate-900">{totalStudents} / {studentLimit || 0}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#f1e2df]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8f2218] to-[#e07d53] transition-all duration-700"
                  style={{ width: `${seatUsage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">Quiz attempted</span>
                <span className="font-semibold text-slate-900">{quizAttempted} / {quizTotal || 0}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#f2e7ef]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6f1d3d] to-[#c63a61] transition-all duration-700"
                  style={{ width: `${quizProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#eaded8] bg-white p-6 shadow-[0_16px_50px_rgba(75,15,11,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8f2218]">Quick Summary</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">What this portal tells you</h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-[#fff7f5] p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#8f2218] p-2 text-white">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Student capacity</p>
                  <p className="text-xs text-slate-500">How many students are enrolled against your institute limit.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#fff7f5] p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#a64d24] p-2 text-white">
                  <IndianRupee size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Free seats left</p>
                  <p className="text-xs text-slate-500">The dashboard highlights how much capacity is still available.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#fff7f5] p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#6f1d3d] p-2 text-white">
                  <ClipboardCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Quiz engagement</p>
                  <p className="text-xs text-slate-500">See how many students have attempted the quiz versus those pending.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
