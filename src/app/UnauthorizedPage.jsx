import {User } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div
      className="flex h-[70vh] items-center justify-center px-4"
      style={{ backgroundColor: "#FAF8F6" }}
    >
      <style>{`
        @keyframes fade-up {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes rule-grow {
          0%   { width: 0; opacity: 0; }
          100% { width: 40px; opacity: 1; }
        }
        .fade-up { animation: fade-up 0.6s ease-out 0.2s both; }
        .rule-grow { animation: rule-grow 0.6s ease-out 0.6s both; }
      `}</style>

      <div className="text-center">
        <div
          className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: "#F7EDEC" }}
        >
          <User className="h-7 w-7" style={{ color: "#9A2119" }} strokeWidth={1.75} />
        </div>

        <p className="fade-up font-serif text-4xl font-semibold tracking-tight text-slate-900">
          Hello!
        </p>
        <div className="rule-grow mx-auto mt-3 h-px" style={{ backgroundColor: "#9A2119" }} />
        <p className="fade-up mt-3 text-base text-slate-500">
          Explore your module to get started
        </p>
      </div>
    </div>
  );
}