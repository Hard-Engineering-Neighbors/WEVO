import React, { useState, useEffect, useRef } from "react";
import { Mail, Lock, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabase/supabaseClient";

function AdminTwoFactorPage() {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Setup countdown timer for resending code
  useEffect(() => {
    const timer =
      countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Load email from localStorage on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("admin_2fa_email");
    if (!storedEmail) {
      navigate("/admin/login");
      return;
    }
    setEmail(storedEmail);

    // Check if there's an active cooldown
    const cooldownKey = `admin_2fa_cooldown_${storedEmail}`;
    const expiresAt = localStorage.getItem(cooldownKey);
    if (expiresAt) {
      const secondsLeft = Math.floor(
        (parseInt(expiresAt, 10) - Date.now()) / 1000
      );
      if (secondsLeft > 0) {
        setCountdown(secondsLeft);
      }
    }

    // Prevent back navigation
    window.history.pushState(null, "", "/admin/2fa");
    const blockNav = (e) => {
      window.history.pushState(null, "", "/admin/2fa");
    };
    window.addEventListener("popstate", blockNav);
    return () => window.removeEventListener("popstate", blockNav);
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });

      if (error) {
        setErrorMessage("Invalid or expired code. Please try again.");
        setLoading(false);
        return;
      }

      // Admin validation would go here
      // For example, checking if the user has admin role

      // Successful verification - clean up and navigate to admin dashboard
      localStorage.removeItem("admin_2fa_email");
      navigate("/admin/dashboard");
    } catch (error) {
      setErrorMessage("Verification failed. Please try again.");
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });

      if (error) throw error;

      // Start cooldown
      const cooldownKey = `admin_2fa_cooldown_${email}`;
      const expiresAt = Date.now() + 60000; // 60 seconds
      localStorage.setItem(cooldownKey, expiresAt);
      setCountdown(60);

      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      setErrorMessage("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-1 flex-col lg:flex-row">
        {/* Left side: WEVO Logo & Info */}
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
            system. Please enter the verification code sent to your email.
          </p>
        </div>

        {/* Right side: Verification Code Input */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-3xl shadow-md">
            <h2 className="text-2xl md:text-3xl text-[#56708A] font-bold mb-2">
              Two-Factor Authentication
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              A 6-digit verification code has been sent to {email}
            </p>

            {errorMessage && (
              <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
                {errorMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleVerify}>
              {/* Code input field */}
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#56708A] text-center tracking-widest font-mono text-xl"
                  placeholder="• • • • • •"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .substring(0, 6);
                    setCode(value);
                  }}
                  required
                  maxLength={6}
                  pattern="\d{6}"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#56708A] text-white py-2 rounded-md hover:bg-[#455b74] transition flex items-center justify-center"
                disabled={loading || code.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading || countdown > 0}
                  className="text-sm font-semibold text-[#56708A] hover:underline disabled:text-gray-400 disabled:no-underline"
                >
                  {countdown > 0
                    ? `Resend code in ${countdown}s`
                    : "Resend code"}
                </button>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate("/admin/login")}
                  className="text-sm font-semibold text-gray-600 hover:underline"
                >
                  Use a different account
                </button>
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
    </div>
  );
}

export default AdminTwoFactorPage;
