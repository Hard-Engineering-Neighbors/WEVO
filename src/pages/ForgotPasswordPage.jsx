import React, { useState, useEffect, useRef } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "../api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const result = await sendPasswordResetEmail(email);

    if (result.success) {
      setMessage(
        "If an account with this email exists, password reset instructions have been sent to your email."
      );
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100">
          <Link
            to="/login"
            className="absolute top-6 left-6 text-gray-500 hover:text-[#0458A9] transition-colors flex items-center group"
            aria-label="Back to Login"
          >
            <ArrowLeft
              size={20}
              className="mr-1 group-hover:animate-pulse-horizontal"
            />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex flex-col items-center mb-6">
            <img
              src="/wevoLogoPng.png"
              alt="Wevo Logo"
              className="w-auto max-h-24 mb-4"
            />
            <h2 className="text-2xl md:text-3xl text-[#0458A9] font-bold text-center">
              Forgot Your Password?
            </h2>
            <p className="text-sm text-gray-500 mt-2 text-center">
              No worries! Enter your email address below and we'll send you
              instructions to reset your password.
            </p>
          </div>

          {message && (
            <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded-md mb-4 text-sm flex items-center gap-2">
              <CheckCircle size={18} />
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-600 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0458A9] focus:border-transparent placeholder-gray-400 text-sm"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0458A9] text-white py-3 rounded-xl hover:bg-[#03407a] transition-colors duration-200 ease-in-out flex items-center justify-center text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading || !!message} // Disable if loading or success message is shown
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Sending Instructions...
                </>
              ) : (
                "Send Reset Instructions"
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-8">
            If you don't receive an email within a few minutes, please check
            your spam folder or try again.
          </p>
        </div>
        <p className="text-xs text-gray-500 text-center mt-8">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-[#0458A9] hover:underline font-medium"
          >
            Log In
          </Link>
        </p>
      </main>
      {/* Footer */}
      <footer className="text-sm text-gray-400 text-center p-4 bg-gray-50 border-t border-gray-200">
        <p className="font-bold">
          All Rights Reserved: Hard Engineering Neighbors
        </p>
        <p>
          WEVO is an interactive web application designed to simplify venue
          reservations and provide real-time monitoring of events.
        </p>
      </footer>
    </div>
  );
}
