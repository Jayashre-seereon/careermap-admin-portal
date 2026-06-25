import { Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/logo_white.png";
import authBackground from "../../assets/loginbackground.png";


export default function AuthLayout() {
  const location = useLocation();
  const isSignup = location.pathname.endsWith("/signup");
  const isForgot = location.pathname.includes("/forgot-password");
  const isReset = location.pathname.includes("/reset-password");

  return (
    <div
     // className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      //style={{ backgroundImage: `url(${authBackground})` }}
    >
      <div className="absolute inset-0 bg-black/5" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8">
        <div className="flex w-full max-w-xl flex-col items-center text-center">
          {/* <img
            src={logo}
            alt="Career Map"
            className="mb-3 h-25 w-auto"
          /> */}

          <div
            className={`w-full rounded-[30px] border border-[#9a2119]/10 bg-white/95 px-6 py-7 shadow-xl backdrop-blur-xl sm:px-8 sm:py-9 ${
              isSignup
                ? "max-w-[540px]"
                : isForgot || isReset
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
