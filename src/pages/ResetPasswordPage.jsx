import React, { useState, useEffect } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { setPasswordResetSession, updateUserPassword, signOutUser, getCurrentSession } from "../api/auth";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isTokenProcessed, setIsTokenProcessed] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        // Get the access_token and refresh_token from URL parameters
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          // Set the session with the tokens from the reset link
          const result = await setPasswordResetSession(accessToken, refreshToken);

          if (result.success && result.session) {
            setIsTokenProcessed(true);
            console.log("Password reset session established successfully.");
          } else {
            throw new Error(result.error || "Unable to establish session");
          }
        } else {
          // Check if user is already logged in (coming from email link might redirect differently)
          const sessionResult = await getCurrentSession();
          if (sessionResult.success && sessionResult.session) {
            setIsTokenProcessed(true);
          } else {
            setError("Invalid or expired password reset link. Please request a new one.");
          }
        }
      } catch (err) {
        console.error("Token verification error:", err);
        setError("Invalid or expired password reset link. Please request a new one.");
      }
    };

    handlePasswordReset();
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    const result = await updateUserPassword(password);

    if (result.success) {
      setMessage("Your password has been successfully updated! You will be redirected to login.");
      
      // Sign out the user and redirect to login after a delay
      setTimeout(async () => {
        await signOutUser();
        navigate("/login");
      }, 3000);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 relative">
          <Link
            to="/login"
            className="absolute top-6 left-6 text-gray-500 hover:text-[#0458A9] transition-colors flex items-center group"
            aria-label="Back to Login"
          >
            <ArrowLeft
              size={20}
              className="mr-1 group-hover:animate-pulse-horizontal"
            />
            <span className="text-sm font-medium">Back to Login</span>
          </Link>
          <div className="flex flex-col items-center mb-6">
            <img
              src="/wevoLogoPng.png"
              alt="Wevo Logo"
              className="w-auto max-h-24 mb-4 mt-8 md:mt-0" // Added margin top for mobile when back button is present
            />
            <h2 className="text-2xl md:text-3xl text-[#0458A9] font-bold text-center">
              Set New Password
            </h2>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Create a new secure password for your account.
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

          {isTokenProcessed && !message && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="password"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0458A9] focus:border-transparent placeholder-gray-400 text-sm"
                    placeholder="Enter new password"
                    required
                    disabled={loading}
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
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="confirmPassword"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0458A9] focus:border-transparent placeholder-gray-400 text-sm"
                    placeholder="Confirm new password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#0458A9]"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0458A9] text-white py-3 rounded-xl hover:bg-[#03407a] transition-colors duration-200 ease-in-out flex items-center justify-center text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Updating Password...
                  </>
                ) : (
                  "Set New Password"
                )}
              </button>
            </form>
          )}

          {!isTokenProcessed && !error && (
            <div className="text-center py-10">
              <Loader2
                className="animate-spin text-[#0458A9] mx-auto"
                size={32}
              />
              <p className="mt-3 text-sm text-gray-600">
                Verifying reset link...
              </p>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 text-center mt-8">
          Need help?{" "}
          <Link
            to="/support"
            className="text-[#0458A9] hover:underline font-medium"
          >
            Contact Support
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
