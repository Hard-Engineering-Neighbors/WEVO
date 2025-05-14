import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { supabase } from "./supabase/supabaseClient";

function LoginPage() {
  const [glow, setGlow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

  const handleGetStarted = () => {
    setGlow(true);
    setTimeout(() => setGlow(false), 500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true, type: 'otp' }
      });
      if (error) throw error;
      localStorage.setItem("2fa_email", email);
      navigate("/2fa");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrorMessage("Failed to send verification code. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-1 flex-col lg:flex-row">
        {/* Left side: WEVO Info */}
        <div className="w-full lg:w-3/5 bg-white flex flex-col justify-center items-center p-8 md:p-12 space-y-6 text-center">
          <img
            src="/wevoLogoPng.png"
            alt="Wevo Logo"
            className="w-auto max-h-32 md:max-h-40"
          />
          <div className="text-3xl md:text-4xl text-[#0458A9] font-semibold">
            Smart Scheduling for a Smarter Campus
          </div>
          <p className="text-base max-w-3xl text-gray-500">
            Keeps West Visayas State University in sync by providing real-time
            updates on venue availability and streamlining communication between
            student organizations and campus administration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGetStarted}
              className="bg-[#0458A9] text-white px-10 py-2 rounded-full hover:bg-[#0458A9] transition flex items-center gap-2"
            >
              Get Started <ChevronRight size={18} />
            </button>

            <button className="border border-[#0458A9] text-[#0458A9] px-10 py-2 rounded-full hover:bg-[#0458A9] transition">
              Explore
            </button>
          </div>
        </div>

        {/* Right side: Login Card */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-8 md:p-12">
          <div
            className={`w-full max-w-md bg-white p-6 md:p-8 rounded-3xl shadow-md transition-all duration-300 ${
              glow ? "animate-glow" : ""
            }`}
          >
            <h2 className="text-2xl md:text-3xl text-[#0458A9] font-bold mb-2">
              Login Credentials
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-[#0458A9] hover:underline">
                Register
              </a>
            </p>

            {errorMessage && (
              <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
                {errorMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              {/* Email Field with Icon */}
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0458A9]"
                  placeholder="email@wvsu.edu.ph"
                  required
                />
              </div>

              {/* Password Field with Icon + Toggle */}
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0458A9]"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#0458A9]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0458A9] text-white py-2 rounded-md hover:bg-[#0458A9] transition"
              >
                Continue
              </button>

              <div className="text-right">
                <a
                  href="/forgot-password"
                  className="text-sm font-semibold text-gray-600 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </form>

            <p className="text-xs text-gray-400 text-center mt-6">
              By logging in, you accept the{" "}
              <a href="#" className="text-[#0458A9] hover:underline">
                WEVO's Terms and Service
              </a>
              ,{" "}
              <a href="#" className="text-[#0458A9] hover:underline">
                Information Protection Statement
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#0458A9] hover:underline">
                Privacy Protection Statement
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-sm text-gray-400 text-center p-4">
        <p className="font-bold">
          All Rights Reserved: Hard Engineering Neighbors
        </p>
        <p>
          WEVO is an interactive web application designed to simplify venue
          reservations and provide real-time monitoring of events.
        </p>
      </footer>

      {/* Glow Style */}
      <style>
        {`
          .animate-glow {
            box-shadow: 0 0 0 4px rgba(0, 98, 255, 0.5), 0 0 10px rgba(59, 130, 246, 0.5);
          }
        `}
      </style>
    </div>
  );
}

export default LoginPage;
