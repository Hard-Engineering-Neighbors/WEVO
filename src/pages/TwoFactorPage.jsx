import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import Footer from "../components/Footer/Footer";
import { Loader2, ArrowLeft } from "lucide-react";

function TwoFactorPage() {
  const [glow, setGlow] = useState(false);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const cooldownRef = React.useRef();

  const handleGetStarted = () => {
    setGlow(true);
    setTimeout(() => setGlow(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    const email = localStorage.getItem("2fa_email");
    if (!email) {
      setErrorMessage("No email found. Please login again.");
      setLoading(false);
      return;
    }
    if (!code || code.length < 4) {
      setErrorMessage("Please enter the code sent to your email.");
      setLoading(false);
      return;
    }
    // Verify OTP with Supabase
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    if (error) {
      setErrorMessage("Invalid or expired code. Please try again.");
      setLoading(false);
      return;
    }
    // Success: clear email and redirect
    localStorage.removeItem("2fa_email");
    setLoading(false);
    navigate("/dashboard");
  };

  // Start cooldown timer
  const startCooldown = () => {
    setCooldown(60);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Resend OTP handler
  const handleResend = async (e) => {
    e.preventDefault();
    if (cooldown > 0) return;
    const email = localStorage.getItem("2fa_email");
    if (!email) {
      setErrorMessage("No email found. Please login again.");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, type: "otp" },
    });
    setLoading(false);
    if (error) {
      setErrorMessage(
        error.message || "Failed to resend code. Please try again."
      );
      return;
    }
    startCooldown();
  };

  // Start cooldown on mount
  React.useEffect(() => {
    startCooldown();
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
    // eslint-disable-next-line
  }, []);

  // Prevent back/forward navigation from leaving 2fa page or returning to login
  useEffect(() => {
    // Instantly disable back/forward navigation by pushing a dummy state and locking the user in a navigation loop
    window.history.pushState({ page: "2fa" }, "", "/2fa");
    const blockNav = () => {
      window.history.pushState({ page: "2fa" }, "", "/2fa");
    };
    window.addEventListener("popstate", blockNav);
    return () => window.removeEventListener("popstate", blockNav);
  }, []);

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.main
        className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <motion.img
          src="/wevoLogoPng.png"
          alt="Wevo Logo"
          className="w-auto max-h-20 xs:max-h-24 sm:max-h-28 md:max-h-32 lg:max-h-32 mb-6 transition-all duration-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          whileHover={{ scale: 1.05 }}
        />
        <motion.div
          className={`w-full max-w-sm sm:max-w-md bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-md transition-all duration-300 ${
            glow ? "animate-glow" : ""
          }`}
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl text-[#0458A9] font-bold mb-2 text-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.15, delay: 0.25 }}
          >
            Two-Factor Authentication
          </motion.h2>
          <motion.p
            className="text-xs sm:text-sm text-gray-500 mb-4 text-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.15, delay: 0.3 }}
          >
            Enter the 6-digit code sent to your email to continue.
          </motion.p>
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                className="bg-red-100 text-red-600 p-3 rounded-md mb-4 text-xs sm:text-sm"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <motion.div
              className="relative"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.35 }}
            >
              <input
                type="text"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0458A9] text-center tracking-widest text-base sm:text-lg"
                placeholder="Enter code"
                maxLength={6}
                required
                autoFocus
                autoComplete="off"
              />
            </motion.div>
            <motion.button
              type="submit"
              className="w-full bg-[#0458A9] text-white py-2 rounded-md hover:bg-[#0458A9] transition text-base sm:text-lg flex items-center justify-center"
              disabled={loading}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.4 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => {
                // Instantly disable back/forward navigation on login as well
                window.history.pushState({ page: "login" }, "", "/login");
                const blockNav = () => {
                  window.history.pushState({ page: "login" }, "", "/login");
                };
                window.addEventListener("popstate", blockNav);
                window.location.assign("/login");
              }}
              className="w-full text-gray-500 py-2 rounded-md hover:bg-gray-100 transition text-sm flex items-center justify-center mt-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15, delay: 0.45 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Login
            </motion.button>
          </form>
          <motion.p
            className="text-xs text-gray-400 text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, delay: 0.5 }}
          >
            Didn&apos;t receive a code?{" "}
            <motion.a
              href="#"
              className={`text-[#0458A9] hover:underline ${
                cooldown > 0 ? "pointer-events-none opacity-50" : ""
              }`}
              onClick={handleResend}
              whileHover={{ scale: cooldown > 0 ? 1 : 1.05 }}
            >
              {cooldown > 0 ? `Resend (${cooldown}s)` : "Resend"}
            </motion.a>
          </motion.p>
        </motion.div>
      </motion.main>
      <Footer />
      {/* Glow Style */}
      <style>{`
        .animate-glow {
          box-shadow: 0 0 0 4px rgba(0, 98, 255, 0.5), 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </motion.div>
  );
}

export default TwoFactorPage;
