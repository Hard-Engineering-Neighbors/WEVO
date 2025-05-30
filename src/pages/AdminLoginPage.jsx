import React, { useState, useEffect, useRef } from "react";
import { Mail, Lock, Eye, EyeOff, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabase/supabaseClient";
import { isAdmin } from "../supabase/checkAdminRole";

function AdminLoginPage() {
  const [glow, setGlow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownInterval = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const formRef = useRef();

  const handleGetStarted = () => {
    setGlow(true);
    setTimeout(() => setGlow(false), 500);
  };

  // Helper to get cooldown remaining for an email
  const getCooldownRemaining = (email) => {
    const cooldownKey = `admin_2fa_cooldown_${email}`;
    const expiresAt = localStorage.getItem(cooldownKey);
    if (!expiresAt) return 0;
    const diff = Math.floor((parseInt(expiresAt, 10) - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  };

  // Start cooldown for an email
  const startCooldown = (email) => {
    const cooldownKey = `admin_2fa_cooldown_${email}`;
    const expiresAt = Date.now() + 60000; // 60 seconds
    localStorage.setItem(cooldownKey, expiresAt);
    setCooldown(60);
    cooldownInterval.current = setInterval(() => {
      const remaining = getCooldownRemaining(email);
      setCooldown(remaining);
      if (remaining <= 0) {
        clearInterval(cooldownInterval.current);
      }
    }, 1000);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (cooldownInterval.current) clearInterval(cooldownInterval.current);
    };
  }, []);

  // Admin login handling
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Check cooldown before proceeding
    const cooldownLeft = getCooldownRemaining(email);
    if (cooldownLeft > 0) {
      setErrorMessage(
        `Please wait ${cooldownLeft}s before requesting another code.`
      );
      setCooldown(cooldownLeft);
      setLoading(false);
      if (!cooldownInterval.current) {
        cooldownInterval.current = setInterval(() => {
          const remaining = getCooldownRemaining(email);
          setCooldown(remaining);
          if (remaining <= 0) {
            clearInterval(cooldownInterval.current);
          }
        }, 1000);
      }
      return;
    }

    try {
      // Check credentials with Supabase
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setErrorMessage("Incorrect email or password.");
        setLoading(false);
        return;
      }

      // Check if user has admin role
      const user = data.user;
      const isAdminUser = await isAdmin(email);
      if (!isAdminUser) {
        setErrorMessage("You do not have admin access.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // If credentials are correct, send 2FA code
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false, type: "otp" },
      });

      if (otpError) throw otpError;

      localStorage.setItem("admin_2fa_email", email);
      startCooldown(email);
      navigate("/admin/2fa"); // Redirect to admin 2FA page
    } catch (error) {
      setErrorMessage("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prevent back/forward navigation from leaving login page
  useEffect(() => {
    window.history.pushState({ page: "admin-login" }, "", "/admin/login");
    const blockNav = () => {
      window.history.pushState({ page: "admin-login" }, "", "/admin/login");
    };
    window.addEventListener("popstate", blockNav);
    return () => window.removeEventListener("popstate", blockNav);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-1 flex-col lg:flex-row">
        {/* Left side: WEVO Admin Info */}
        <div className="w-full lg:w-3/5 bg-white flex flex-col justify-center items-center p-8 md:p-12 space-y-6 text-center">
          <img
            src="/wevoAdmin.png"
            alt="Wevo Logo"
            className="w-auto max-h-32 md:max-h-40"
          />
          {/* <div className="text-3xl md:text-4xl text-[#56708A] font-semibold">
            WEVO Admin Portal
          </div> */}
          <p className="text-base max-w-3xl text-gray-500">
            Admin portal for West Visayas State University's venue management
            system. Manage reservations, venues, and user access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGetStarted}
              className="bg-[#56708A] text-white px-10 py-2 rounded-full hover:bg-[#455b74] transition flex items-center gap-2"
            >
              Admin Access <ChevronRight size={18} />
            </button>

            <button className="border border-[#56708A] text-[#56708A] px-10 py-2 rounded-full hover:bg-[#56708A] transition hover:text-white">
              Help
            </button>
          </div>
        </div>

        {/* Right side: Admin Login Card */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-8 md:p-12">
          <div
            className={`w-full max-w-md bg-white p-6 md:p-8 rounded-3xl shadow-md transition-all duration-300 ${
              glow ? "animate-glow" : ""
            }`}
          >
            <h2 className="text-2xl md:text-3xl text-[#56708A] font-bold mb-2">
              Admin Credentials
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Secure access to the WEVO administration system
            </p>

            {errorMessage && (
              <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
                {errorMessage}
              </div>
            )}

            <form ref={formRef} className="space-y-4" onSubmit={handleLogin}>
              {/* Email Field with Icon */}
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#56708A]"
                  placeholder="admin@wvsu.edu.ph"
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
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#56708A]"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#56708A]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#56708A] text-white py-2 rounded-md hover:bg-[#455b74] transition flex items-center justify-center"
                disabled={loading || cooldown > 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Sending Code...
                  </>
                ) : cooldown > 0 ? (
                  `Wait ${cooldown}s...`
                ) : (
                  "Continue"
                )}
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
              This is a secured admin portal. Unauthorized access attempts are
              logged and monitored.
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
          WEVO Admin Portal - Venue Management System for West Visayas State
          University
        </p>
      </footer>

      {/* Glow Style */}
      <style>
        {`
          .animate-glow {
            box-shadow: 0 0 0 4px rgba(86, 112, 138, 0.5), 0 0 10px rgba(86, 112, 138, 0.5);
          }
        `}
      </style>
    </div>
  );
}

export default AdminLoginPage;
