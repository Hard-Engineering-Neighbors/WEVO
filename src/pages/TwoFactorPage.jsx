import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import Footer from "../components/Footer/Footer";

function TwoFactorPage() {
  const [glow, setGlow] = useState(false);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setGlow(true);
    setTimeout(() => setGlow(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    // TODO: Add actual verification logic here
    if (!code || code.length < 4) {
      setErrorMessage("Please enter the code sent to your email.");
      setLoading(false);
      return;
    }
    // Simulate success for now
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-8">
        <img
          src="/wevoLogoPng.png"
          alt="Wevo Logo"
          className="w-auto max-h-20 xs:max-h-24 sm:max-h-28 md:max-h-32 lg:max-h-32 mb-6 transition-all duration-200"
        />
        <div
          className={`w-full max-w-sm sm:max-w-md bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-md transition-all duration-300 ${
            glow ? "animate-glow" : ""
          }`}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl text-[#0458A9] font-bold mb-2 text-center">
            Two-Factor Authentication
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-4 text-center">
            Enter the 6-digit code sent to your email to continue.
          </p>
          {errorMessage && (
            <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4 text-xs sm:text-sm">
              {errorMessage}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
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
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0458A9] text-white py-2 rounded-md hover:bg-[#0458A9] transition text-base sm:text-lg"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-6">
            Didn&apos;t receive a code?{" "}
            <a href="#" className="text-[#0458A9] hover:underline">
              Resend
            </a>
          </p>
        </div>
      </main>
      <Footer />
      {/* Glow Style */}
      <style>{`
        .animate-glow {
          box-shadow: 0 0 0 4px rgba(0, 98, 255, 0.5), 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
}

export default TwoFactorPage;
