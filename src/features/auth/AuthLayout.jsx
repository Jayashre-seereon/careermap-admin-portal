import { Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/logo_white.png";
import AnimatedBackground from "../../features/auth/AnimatedBg";

export default function AuthLayout() {
  const location = useLocation();
  const isSignup = location.pathname === "/signup";
  const isForgot = location.pathname === "/forgot-password";

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent">

      {/* ✅ Animated Background */}
      <AnimatedBackground />

      {/* ✅ Main Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        
        <div className="w-full max-w-xl text-center flex flex-col items-center">

          {/* LOGO  */}
          <img
            src={logo}
            alt="Career Map"
            className="h-25 w-auto mb-3"   
          />

          {/* 🔲 CARD */}
          <div
            className={`w-full rounded-[30px] border border-[#9a2119]/10 bg-white/95 px-6 py-7 shadow-xl backdrop-blur-xl sm:px-8 sm:py-9 ${
              isSignup
                ? "max-w-[540px]"
                : isForgot
                ? "max-w-[560px]"
                : "max-w-[470px]"
            }`}
          >
            <Outlet />
          </div>

        </div>
      </div>
    </div>
  );
}