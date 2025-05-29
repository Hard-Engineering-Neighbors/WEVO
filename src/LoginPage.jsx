import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Loader2,
  X,
  Shield,
  FileText,
  Lock as LockIcon,
  Calendar,
  Users,
  Bell,
  Smartphone,
  CheckCircle,
  MapPin,
  Heart,
  Clock,
  Zap,
  Info,
  ArrowDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { supabase } from "./supabase/supabaseClient";

function LoginPage() {
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

  // Modal states
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isInfoProtectionModalOpen, setIsInfoProtectionModalOpen] =
    useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleGetStarted = () => {
    setGlow(true);
    setTimeout(() => setGlow(false), 500);
  };

  const scrollToExplore = () => {
    const exploreSection = document.getElementById("explore-section");
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: Calendar,
      title: "Real-Time Calendar",
      description:
        "See venue availability instantly with our live calendar system that updates in real-time.",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Get instant updates on your booking status, approvals, and important announcements.",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: Users,
      title: "Easy Collaboration",
      description:
        "Perfect for student organizations, faculty, and staff to coordinate campus events.",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description:
        "Access WEVO from any device - desktop, tablet, or smartphone with full functionality.",
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  const benefits = [
    "No more double bookings or scheduling conflicts",
    "Streamlined approval process with digital workflows",
    "24/7 access to venue booking system",
    "Real-time communication with administrators",
    "Secure document upload and management",
    "Automated notifications and reminders",
  ];

  // Helper to get cooldown remaining for an email
  const getCooldownRemaining = (email) => {
    const cooldownKey = `2fa_cooldown_${email}`;
    const expiresAt = localStorage.getItem(cooldownKey);
    if (!expiresAt) return 0;
    const diff = Math.floor((parseInt(expiresAt, 10) - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  };

  // Start cooldown for an email
  const startCooldown = (email) => {
    const cooldownKey = `2fa_cooldown_${email}`;
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

  // New: Check credentials before sending 2FA code
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
      // If credentials are correct, send 2FA code
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false, type: "otp" },
      });
      if (otpError) throw otpError;
      localStorage.setItem("2fa_email", email);
      startCooldown(email);
      navigate("/2fa");
    } catch (error) {
      setErrorMessage("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prevent back/forward navigation from leaving login page or returning to 2fa
  useEffect(() => {
    // Only block navigation if coming from 2FA page to prevent users from going back to 2FA
    const blockNavFrom2FA = (event) => {
      // Check if the previous page was 2FA
      const previousPath = document.referrer;
      if (previousPath.includes("/2fa")) {
        // Only block if trying to go back to 2FA
        event.preventDefault();
        window.history.pushState({ page: "login" }, "", "/login");
      }
    };

    window.addEventListener("popstate", blockNavFrom2FA);
    return () => window.removeEventListener("popstate", blockNavFrom2FA);
  }, []);

  // Terms and Service Modal
  const TermsModal = () => {
    if (!isTermsModalOpen) return null;
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white rounded-t-xl border-b border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-[#0458A9]" />
              <h3 className="text-xl font-bold text-[#0458A9]">
                WEVO's Terms and Service
              </h3>
            </div>
            <button
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setIsTermsModalOpen(false)}
              aria-label="Close terms modal"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700 leading-relaxed">
                By using WEVO, users agree to responsibly access and use the
                platform for scheduling official university events and
                activities only. Unauthorized access, misuse of venue slots, or
                tampering with data is strictly prohibited. The system is
                provided "as is" without warranty of availability or
                uninterrupted service. The WEVO development team reserves the
                right to suspend or revoke access for any user violating the
                system's intended purpose or compromising its integrity. Use of
                WEVO implies acceptance of these terms and cooperation with
                university policies.
              </p>
            </div>
          </div>
          <div className="sticky bottom-0 bg-white rounded-b-xl border-t border-gray-200 p-6">
            <button
              onClick={() => setIsTermsModalOpen(false)}
              className="w-full bg-[#0458A9] text-white rounded-full py-3 px-6 hover:bg-[#034a8a] transition-colors font-medium"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Information Protection Statement Modal
  const InfoProtectionModal = () => {
    if (!isInfoProtectionModalOpen) return null;
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white rounded-t-xl border-b border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={24} className="text-[#0458A9]" />
              <h3 className="text-xl font-bold text-[#0458A9]">
                Information Protection Statement
              </h3>
            </div>
            <button
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setIsInfoProtectionModalOpen(false)}
              aria-label="Close information protection modal"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700 leading-relaxed">
                WEVO ensures that all personal and institutional data submitted
                through the platform is protected from unauthorized access,
                misuse, or disclosure. Access to data is role-based and limited
                only to individuals who need it for scheduling or administrative
                functions. Any logs, user activity, or sensitive information are
                securely stored and monitored for anomalies. The team commits to
                implementing necessary technical and procedural safeguards to
                keep your data protected throughout the system's life cycle.
              </p>
            </div>
          </div>
          <div className="sticky bottom-0 bg-white rounded-b-xl border-t border-gray-200 p-6">
            <button
              onClick={() => setIsInfoProtectionModalOpen(false)}
              className="w-full bg-[#0458A9] text-white rounded-full py-3 px-6 hover:bg-[#034a8a] transition-colors font-medium"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Privacy Protection Statement Modal
  const PrivacyModal = () => {
    if (!isPrivacyModalOpen) return null;
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white rounded-t-xl border-b border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LockIcon size={24} className="text-[#0458A9]" />
              <h3 className="text-xl font-bold text-[#0458A9]">
                Privacy Protection Statement
              </h3>
            </div>
            <button
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setIsPrivacyModalOpen(false)}
              aria-label="Close privacy modal"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700 leading-relaxed">
                WEVO is committed to respecting and protecting user privacy. Any
                personal information collected — such as names, emails, and
                organizational affiliations — is used solely for scheduling and
                user verification purposes within the platform. WEVO will never
                sell or share user data with third parties. Users have the right
                to request the correction or deletion of their data, and all
                information is handled in compliance with university privacy
                policies and local data protection laws.
              </p>
            </div>
          </div>
          <div className="sticky bottom-0 bg-white rounded-b-xl border-t border-gray-200 p-6">
            <button
              onClick={() => setIsPrivacyModalOpen(false)}
              className="w-full bg-[#0458A9] text-white rounded-full py-3 px-6 hover:bg-[#034a8a] transition-colors font-medium"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-1 flex-col lg:flex-row min-h-screen">
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

            <button
              onClick={scrollToExplore}
              className="border border-[#0458A9] text-[#0458A9] px-10 py-2 rounded-full hover:bg-[#0458A9] transition hover:text-white"
            >
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
              {/* Don&apos;t have an account?{" "}
              <a href="/register" className="text-[#0458A9] hover:underline">
                Register
              </a> */}
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
                className="w-full bg-[#0458A9] text-white py-2 rounded-md hover:bg-[#0458A9] transition flex items-center justify-center"
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
              By logging in, you accept the{" "}
              <button
                onClick={() => setIsTermsModalOpen(true)}
                className="text-[#0458A9] hover:underline cursor-pointer"
              >
                WEVO's Terms and Service
              </button>
              ,{" "}
              <button
                onClick={() => setIsInfoProtectionModalOpen(true)}
                className="text-[#0458A9] hover:underline cursor-pointer"
              >
                Information Protection Statement
              </button>{" "}
              and{" "}
              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="text-[#0458A9] hover:underline cursor-pointer"
              >
                Privacy Protection Statement
              </button>
              .
            </p>
          </div>
        </div>
      </main>

      {/* Explore Section */}
      <div id="explore-section" className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <ArrowDown className="text-[#0458A9] animate-bounce" size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0458A9] mb-6">
              Discover WEVO's Power
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your campus event management experience with WEVO's
              intelligent features designed specifically for the WVSU community.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}
                >
                  <feature.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg border border-gray-100 mb-16">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0458A9] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-white" size={32} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0458A9] mb-4">
                What You'll Get
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                WEVO provides comprehensive solutions to all your venue booking
                challenges
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-[#0458A9] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-gradient-to-r from-[#0458A9] to-blue-600 rounded-xl p-8 md:p-12 text-white text-center mb-16">
            <div className="mb-8">
              <Zap className="text-white mx-auto mb-4" size={48} />
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Getting Started is Easy
              </h3>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Join hundreds of WVSU students, faculty, and staff who are
                already using WEVO to streamline their event planning process.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-2xl font-bold mb-2">1</div>
                <div className="text-sm">Login with your WVSU credentials</div>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-2xl font-bold mb-2">2</div>
                <div className="text-sm">Browse available venues and dates</div>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-2xl font-bold mb-2">3</div>
                <div className="text-sm">Submit your booking request</div>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="text-white" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-[#0458A9] mb-4">
              Built by Students, for Students
            </h3>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-6">
              WEVO is proudly developed by Hard Engineering Neighbors, a
              dedicated student-led team from WVSU. We understand your needs
              because we share the same campus experience.
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <MapPin size={16} />
              <span className="text-sm">
                Brgy. Aganan, Zone 4, Pavia, Iloilo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-sm text-gray-400 text-center p-4 bg-white">
        <p className="font-bold">
          All Rights Reserved: Hard Engineering Neighbors
        </p>
        <p>
          WEVO is an interactive web application designed to simplify venue
          reservations and provide real-time monitoring of events.
        </p>
      </footer>

      {/* Legal Modals */}
      <TermsModal />
      <InfoProtectionModal />
      <PrivacyModal />

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
