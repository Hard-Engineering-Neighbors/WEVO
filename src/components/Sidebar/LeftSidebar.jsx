import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays,
  MapPin,
  RotateCcw,
  HelpCircle,
  X,
  Wrench,
  Info,
  BookOpen,
  Heart,
  Mail,
  Clock,
  MessageCircle,
  Phone,
  MapPinIcon,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function LeftSidebar({ active = "calendar" }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // State for individual modals
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isUserManualModalOpen, setIsUserManualModalOpen] = useState(false);
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const [isContactAdminModalOpen, setIsContactAdminModalOpen] = useState(false);

  // Route guard: block navigation to login/2fa/landing if logged in
  const handleNav = (path) => {
    if (!currentUser && ["/dashboard", "/venues", "/requests"].includes(path)) {
      navigate("/login", { replace: true });
      return;
    }
    if (currentUser && ["/login", "/2fa", "/"].includes(path)) {
      navigate("/dashboard", { replace: true });
      return;
    }
    navigate(path);
  };

  const navItems = [
    {
      name: "Calendar",
      path: "/dashboard",
      icon: CalendarDays,
      key: "calendar",
      type: "navigate",
    },
    {
      name: "Venues",
      path: "/venues",
      icon: MapPin,
      key: "venues",
      type: "navigate",
    },
    {
      name: "Requests",
      path: "/requests",
      icon: RotateCcw,
      key: "requests",
      type: "navigate",
    },
    { name: "Support", icon: HelpCircle, key: "support", type: "modal" },
  ];

  const supportTools = [
    { name: "FAQ", action: () => setIsFaqModalOpen(true) },
    { name: "User Manual", action: () => setIsUserManualModalOpen(true) },
    { name: "About Us", action: () => setIsAboutUsModalOpen(true) },
    {
      name: "Contact Admin",
      action: () => setIsContactAdminModalOpen(true),
    },
  ];

  // Support Modal Component
  const SupportModal = () => {
    if (!isSupportModalOpen) return null;
    return (
      <div className="fixed inset-0 z-[950] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-xs w-full p-6">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            onClick={() => setIsSupportModalOpen(false)}
            aria-label="Close support modal"
          >
            <X size={20} />
          </button>
          <h3 className="text-xl font-bold text-[#0458A9] mb-6 text-center">
            Support Tools
          </h3>
          <div className="flex flex-col gap-3">
            {supportTools.map((tool) => (
              <button
                key={tool.name}
                onClick={tool.action}
                className="border rounded-full py-2.5 px-4 text-sm text-gray-700 hover:bg-gray-100 w-full font-medium"
              >
                {tool.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // FAQ Modal Component
  const FAQModal = () => {
    if (!isFaqModalOpen) return null;

    const faqs = [
      {
        question: "What is WEVO?",
        answer:
          'WEVO stands for "WVSU Event Venue Outlet," a web-based platform designed to manage venue reservations and event coordination at West Visayas State University.',
        category: "Platform Overview",
        color: "bg-blue-50 border-blue-200",
      },
      {
        question: "Who can use WEVO?",
        answer:
          "WEVO is built for use by WVSU faculty, staff, and student organizations who need to book and manage campus venues.",
        category: "Access & Permissions",
        color: "bg-green-50 border-green-200",
      },
      {
        question: "What features does WEVO offer?",
        answer:
          "WEVO includes real-time venue availability tracking, automated booking, user-friendly UI/UX, and centralized event monitoring.",
        category: "Features & Capabilities",
        color: "bg-purple-50 border-purple-200",
      },
      {
        question: "Why was WEVO created?",
        answer:
          "It was developed to replace manual scheduling processes that caused double bookings and inefficiencies, and to create a smoother, smarter system for managing campus events.",
        category: "Purpose & Vision",
        color: "bg-orange-50 border-orange-200",
      },
    ];

    return (
      <div className="fixed inset-0 z-[960] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white rounded-t-xl border-b border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0458A9] to-blue-600 rounded-full flex items-center justify-center">
                <HelpCircle size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0458A9]">
                  Frequently Asked Questions
                </h3>
                <p className="text-gray-600 text-sm">
                  Everything you need to know about WEVO
                </p>
              </div>
            </div>
            <button
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setIsFaqModalOpen(false)}
              aria-label="Close FAQ modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Introduction Section */}
            <div className="bg-gradient-to-r from-[#0458A9]/10 to-blue-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#0458A9] rounded-full flex items-center justify-center">
                  <Info size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0458A9] text-lg">
                    Welcome to WEVO Support
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Find quick answers to common questions
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Below you'll find answers to the most frequently asked questions
                about WEVO. If you can't find what you're looking for, feel free
                to contact our support team.
              </p>
            </div>

            {/* FAQ Items */}
            <div className="grid gap-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-md ${faq.color}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-[#0458A9] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        Q
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="inline-block px-3 py-1 bg-white/70 text-gray-600 text-xs font-medium rounded-full mb-2">
                          {faq.category}
                        </span>
                        <h4 className="font-bold text-gray-800 text-lg leading-tight">
                          {faq.question}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 mt-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        A
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Need More Help Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-green-700 text-lg">
                    Still Need Help?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    We're here to assist you further
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Can't find the answer you're looking for? Our support team is
                ready to help you with any questions or issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setIsFaqModalOpen(false);
                    setIsContactAdminModalOpen(true);
                  }}
                  className="flex-1 bg-green-600 text-white rounded-lg py-3 px-4 hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Mail size={18} />
                  Contact Support
                </button>
                <button
                  onClick={() => {
                    setIsFaqModalOpen(false);
                    setIsUserManualModalOpen(true);
                  }}
                  className="flex-1 bg-white text-green-600 border border-green-600 rounded-lg py-3 px-4 hover:bg-green-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <BookOpen size={18} />
                  View User Manual
                </button>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white rounded-b-xl border-t border-gray-200 p-6">
            <button
              onClick={() => setIsFaqModalOpen(false)}
              className="w-full bg-[#0458A9] text-white rounded-full py-3 px-6 hover:bg-[#034a8a] transition-colors font-medium"
            >
              Close FAQ
            </button>
          </div>
        </div>
      </div>
    );
  };

  // User Manual Modal Component
  const UserManualModal = () => {
    if (!isUserManualModalOpen) return null;

    const bookingSteps = [
      {
        step: 1,
        title: "Check Availability",
        description:
          "Go to the dashboard calendar and verify if your preferred dates and venues are available.",
        icon: "",
        color: "bg-blue-600",
      },
      {
        step: 2,
        title: "Reserve Your Date",
        description:
          'Once you\'ve selected your desired date, click the "Reserve" button next to the calendar or navigate to the "Venues" tab.',
        icon: "",
        color: "bg-blue-600",
      },
      {
        step: 3,
        title: "Select a Venue",
        description:
          "Click on the venue card corresponding to your preferred location.",
        icon: "",
        color: "bg-blue-600",
      },
      {
        step: 4,
        title: "Confirm Booking Details",
        description:
          "Double-check the venue location and selected date(s) to ensure accuracy.",
        icon: "",
        color: "bg-blue-600",
      },
      {
        step: 5,
        title: "Provide Event Information",
        description:
          "Fill in all required details, such as event title, contact person, time, and other relevant information.",
        icon: "",
        color: "bg-blue-600",
      },
      {
        step: 6,
        title: "Upload Required Documents",
        description:
          "Attach any necessary files (e.g., permits, approvals, or supporting documents).",
        icon: "",
        color: "bg-blue-600",
      },
      {
        step: 7,
        title: "Review & Submit",
        description:
          "Carefully review all entered details and uploaded files before submitting your request.",
        icon: "",
        color: "bg-blue-600",
      },
      {
        step: 8,
        title: "Submission Confirmation",
        description:
          "You will receive a notification confirming that your request has been successfully submitted.",
        icon: "",
        color: "bg-green-600",
      },
      {
        step: 9,
        title: "Await Approval",
        description:
          "The admin will review your request and notify you of their decision (approved or rejected).",
        icon: "",
        color: "bg-orange-600",
      },
    ];

    const cancellationSteps = [
      {
        step: 1,
        title: "Navigate to Requests",
        description: 'From the dashboard, go to the "Requests" tab.',
        icon: "",
        color: "bg-red-600",
      },
      {
        step: 2,
        title: "Select the Request",
        description: "Click on the card of the request you wish to cancel.",
        icon: "",
        color: "bg-red-600",
      },
      {
        step: 3,
        title: "Initiate Cancellation",
        description: 'Click the "Cancel Request" button.',
        icon: "",
        color: "bg-red-600",
      },
      {
        step: 4,
        title: "Provide a Reason (If Approved)",
        description:
          "If the request was previously approved, enter the cancellation reason in the required field.",
        icon: "",
        color: "bg-red-600",
      },
      {
        step: 5,
        title: "Confirm Cancellation",
        description: "Submit your cancellation request.",
        icon: "",
        color: "bg-red-600",
      },
    ];

    return (
      <div className="fixed inset-0 z-[960] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white rounded-t-xl border-b border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0458A9] to-blue-600 rounded-full flex items-center justify-center">
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0458A9]">
                  WEVO User Manual
                </h3>
                <p className="text-gray-600 text-sm">
                  Complete guide to using WEVO effectively
                </p>
              </div>
            </div>
            <button
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setIsUserManualModalOpen(false)}
              aria-label="Close user manual modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Introduction */}
            <div className="bg-gradient-to-r from-[#0458A9]/10 to-blue-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#0458A9] rounded-full flex items-center justify-center">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0458A9] text-lg">
                    Getting Started with WEVO
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Learn how to book venues and manage requests
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                This comprehensive guide will walk you through all the essential
                features of WEVO, from booking your first venue to managing your
                requests effectively.
              </p>
            </div>

            {/* How to Book a Venue Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <CalendarDays size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-blue-700">
                    How to Book a Venue
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Follow these steps to successfully reserve a venue
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {bookingSteps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-blue-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 ${step.color} text-white rounded-full flex items-center justify-center text-lg font-bold`}
                        >
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{step.icon}</span>
                          <h5 className="font-bold text-gray-800 text-lg">
                            {step.title}
                          </h5>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Cancel a Request Section */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <RotateCcw size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-red-700">
                    How to Cancel a Request
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Steps to cancel an existing venue request
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {cancellationSteps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-red-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 ${step.color} text-white rounded-full flex items-center justify-center text-lg font-bold`}
                        >
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{step.icon}</span>
                          <h5 className="font-bold text-gray-800 text-lg">
                            {step.title}
                          </h5>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Info size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-green-700 text-lg">
                    Pro Tips for Success
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Best practices for using WEVO
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    Booking Tips
                  </h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Book venues well in advance</li>
                    <li>• Have all documents ready before starting</li>
                    <li>• Double-check dates and times</li>
                    <li>• Include detailed event descriptions</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-lg">🚀</span>
                    Efficiency Tips
                  </h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Use the calendar view for availability</li>
                    <li>• Save frequently used event information</li>
                    <li>• Monitor request status regularly</li>
                    <li>• Contact support for urgent issues</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Need Help Section */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <HelpCircle size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-purple-700 text-lg">
                    Need Additional Help?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Explore more support resources
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setIsUserManualModalOpen(false);
                    setIsFaqModalOpen(true);
                  }}
                  className="flex-1 bg-purple-600 text-white rounded-lg py-3 px-4 hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <HelpCircle size={18} />
                  View FAQ
                </button>
                <button
                  onClick={() => {
                    setIsUserManualModalOpen(false);
                    setIsContactAdminModalOpen(true);
                  }}
                  className="flex-1 bg-white text-purple-600 border border-purple-600 rounded-lg py-3 px-4 hover:bg-purple-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Mail size={18} />
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white rounded-b-xl border-t border-gray-200 p-6">
            <button
              onClick={() => setIsUserManualModalOpen(false)}
              className="w-full bg-[#0458A9] text-white rounded-full py-3 px-6 hover:bg-[#034a8a] transition-colors font-medium"
            >
              Close User Manual
            </button>
          </div>
        </div>
      </div>
    );
  };

  // About Us Modal Component
  const AboutUsModal = () => {
    if (!isAboutUsModalOpen) return null;

    return (
      <div className="fixed inset-0 z-[960] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white rounded-t-xl border-b border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart size={24} className="text-[#0458A9]" />
              <h3 className="text-xl font-bold text-[#0458A9]">
                About Hard Engineering Neighbors / WEVO
              </h3>
            </div>
            <button
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setIsAboutUsModalOpen(false)}
              aria-label="Close about us modal"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-r from-[#0458A9]/10 to-blue-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#0458A9] rounded-full flex items-center justify-center">
                  <Heart className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#0458A9] text-lg">
                    Hard Engineering Neighbors
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Brgy. Aganan, Zone 4, Pavia, Iloilo
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Hard Engineering Neighbors is a dynamic student-led development
                group behind the WEVO project, aimed at revolutionizing campus
                scheduling. Based in Brgy. Aganan, Zone 4, Pavia, Iloilo, this
                innovative team focuses on solving real-world problems through
                purposeful engineering and design.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <CalendarDays className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-green-700 text-lg">
                    WEVO — Smart Scheduling for a Smarter Campus
                  </h4>
                  <p className="text-gray-600 text-sm">Our Flagship System</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                WEVO is our flagship system, created to streamline event venue
                bookings at West Visayas State University. By tackling
                inefficiencies like double bookings and communication gaps, the
                team offers a modern web-based tool that empowers students,
                faculty, and staff to coordinate campus events with ease and
                confidence.
              </p>
            </div>

            <div className="border-l-4 border-[#0458A9] pl-6">
              <h4 className="font-semibold text-gray-800 mb-2">Our Mission</h4>
              <p className="text-gray-600 leading-relaxed">
                To create innovative solutions that enhance the educational
                experience through smart technology and user-centered design.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-6">
              <h4 className="font-semibold text-gray-800 mb-2">Our Vision</h4>
              <p className="text-gray-600 leading-relaxed">
                To be the leading student development group that bridges the gap
                between academic challenges and practical solutions.
              </p>
            </div>

            {/* Team Members Section */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-purple-700 text-lg">
                    Meet Our Team
                  </h4>
                  <p className="text-gray-600 text-sm">
                    The brilliant minds behind WEVO
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">KG</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">
                        Kirk Henrich Gamo
                      </h5>
                      <p className="text-purple-600 text-sm font-medium">
                        Project Manager
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">JV</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">
                        Jan Floyd Vallota
                      </h5>
                      <p className="text-blue-600 text-sm font-medium">
                        Lead Developer
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">JB</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">
                        Jullian Bilan
                      </h5>
                      <p className="text-green-600 text-sm font-medium">
                        Developer
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">FB</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">
                        Frederick Jibril Buñag
                      </h5>
                      <p className="text-orange-600 text-sm font-medium">
                        QA Specialist
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">DA</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">
                        Dallas Aquino
                      </h5>
                      <p className="text-pink-600 text-sm font-medium">
                        UI/UX Designer
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">CB</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">
                        Clarence Anthony Bolivar
                      </h5>
                      <p className="text-teal-600 text-sm font-medium">
                        Documentation Lead
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border border-purple-100">
                <p className="text-gray-600 text-sm text-center italic">
                  "Together, we're building the future of campus event
                  management, one venue at a time."
                </p>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 bg-white rounded-b-xl border-t border-gray-200 p-6">
            <button
              onClick={() => setIsAboutUsModalOpen(false)}
              className="w-full bg-[#0458A9] text-white rounded-full py-3 px-6 hover:bg-[#034a8a] transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Contact Admin Modal Component
  const ContactAdminModal = () => {
    if (!isContactAdminModalOpen) return null;

    const handleEmailClick = () => {
      window.location.href =
        "mailto:wevosupport@gmail.com?subject=WEVO Support Request";
    };

    const supportTopics = [
      "Account and login issues",
      "Venue booking problems",
      "Technical difficulties",
      "Request status inquiries",
      "System bugs and errors",
      "Feature requests",
      "General platform questions",
    ];

    return (
      <div className="fixed inset-0 z-[960] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white rounded-t-xl border-b border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle size={24} className="text-[#0458A9]" />
              <h3 className="text-xl font-bold text-[#0458A9]">
                Contact Admin
              </h3>
            </div>
            <button
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setIsContactAdminModalOpen(false)}
              aria-label="Close contact admin modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Main Contact Information */}
            <div className="bg-gradient-to-r from-[#0458A9]/10 to-blue-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#0458A9] rounded-full flex items-center justify-center">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#0458A9] text-lg">
                    WEVO Support Team
                  </h4>
                  <p className="text-gray-600 text-sm">
                    We're here to help you with any issues
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleEmailClick}
                  className="w-full bg-[#0458A9] text-white rounded-lg py-3 px-4 hover:bg-[#034a8a] transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Mail size={18} />
                  wevosupport@gmail.com
                </button>
                <p className="text-gray-600 text-sm text-center">
                  Click above to send us an email directly
                </p>
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Clock className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-green-700 text-lg">
                    Support Hours
                  </h4>
                  <p className="text-gray-600 text-sm">
                    When you can expect our response
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-2">
                    Business Hours
                  </h5>
                  <p className="text-gray-600 text-sm">Monday - Friday</p>
                  <p className="text-gray-600 text-sm">8:00 AM - 6:00 PM</p>
                  <p className="text-gray-600 text-sm">(Philippine Time)</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-2">
                    Response Time
                  </h5>
                  <p className="text-green-600 text-sm font-medium">
                    Within 24 hours
                  </p>
                  <p className="text-gray-600 text-sm">
                    Urgent issues: Same day
                  </p>
                  <p className="text-gray-600 text-sm">
                    General inquiries: 1-2 days
                  </p>
                </div>
              </div>
            </div>

            {/* What We Can Help With */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                  <HelpCircle className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-orange-700 text-lg">
                    What We Can Help With
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Common issues and inquiries we support
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {supportTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white rounded-lg p-3"
                  >
                    <div className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Tips */}
            <div className="border-l-4 border-[#0458A9] pl-6 bg-gray-50 rounded-r-lg py-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Info size={18} className="text-[#0458A9]" />
                Tips for Faster Support
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Include your registered email address</li>
                <li>• Describe the issue in detail with steps to reproduce</li>
                <li>
                  • Mention the page or feature where the problem occurred
                </li>
                <li>• Attach screenshots if applicable</li>
                <li>• Include error messages (if any)</li>
              </ul>
            </div>

            {/* Development Team Info */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Heart size={20} className="text-[#0458A9]" />
                <h4 className="font-semibold text-gray-800">About Our Team</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                WEVO is developed and maintained by Hard Engineering Neighbors,
                a dedicated student-led development group. We're committed to
                providing excellent support and continuously improving your
                experience with our platform.
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                <MapPinIcon size={14} />
                <span>Brgy. Aganan, Zone 4, Pavia, Iloilo</span>
              </div>
            </div>

            {/* Emergency Contact Note */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={14} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">
                    Emergency Issues
                  </h4>
                  <p className="text-red-700 text-sm">
                    For critical system outages or urgent venue booking issues
                    during university events, please contact the university's IT
                    department directly or reach out to your department admin.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white rounded-b-xl border-t border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleEmailClick}
                className="flex-1 bg-[#0458A9] text-white rounded-full py-3 px-6 hover:bg-[#034a8a] transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Send Email
              </button>
              <button
                onClick={() => setIsContactAdminModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 rounded-full py-3 px-6 hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Generic Under Construction Modal Component
  const UnderConstructionModal = ({ isOpen, onClose, title }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[960] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-xs w-full p-6 text-center">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          <h3 className="text-xl font-bold text-[#0458A9] mb-4">{title}</h3>
          <Wrench size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            This feature is currently under construction.
          </p>
          <p className="text-gray-600">Please check back later!</p>
          <button
            onClick={onClose}
            className="mt-6 bg-[#0458A9] text-white rounded-full py-2 px-6 hover:bg-[#034a8a] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // Mobile Navigation Component (to be rendered via portal)
  const MobileNavigation = () => (
    <nav
      className="lg:hidden bg-white border-t border-gray-200 shadow-md p-1 flex justify-around items-center h-16"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        isolation: "isolate",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        transform: "translateZ(0)", // Force hardware acceleration
        willChange: "transform", // Optimize for animations
      }}
    >
      {navItems.map((item) => (
        <button
          key={item.key}
          className={`flex flex-col items-center justify-center p-1 rounded-md w-1/4 text-xs ${
            active === item.key && item.type === "navigate"
              ? "text-[#0458A9]"
              : "text-gray-500 hover:text-[#0458A9]/80"
          }`}
          onClick={() => {
            if (item.type === "navigate") {
              handleNav(item.path);
            } else if (item.type === "modal") {
              setIsSupportModalOpen(true);
            }
          }}
        >
          <item.icon size={24} />
          <span className="mt-0.5 font-medium">{item.name}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile: Top Logo (not sticky, hidden on lg and up) */}
      <div className="lg:hidden bg-white p-3 shadow-md flex justify-center items-center h-16">
        <img
          src="/wevoLogoPng.png"
          alt="Wevo Logo"
          className="h-10" // Adjusted height for mobile top bar
        />
      </div>

      {/* Desktop: Full Left Sidebar (hidden below lg) */}
      <aside className="hidden lg:flex w-full lg:w-1/5 bg-white lg:border-b-0 lg:border-r p-4 md:p-6 flex-col justify-between border-gray-400 min-h-screen z-20 lg:sticky lg:top-0 lg:h-screen">
        <div className="flex flex-1 flex-col items-center justify-start w-full">
          <img
            src="/wevoLogoPng.png"
            alt="Wevo Logo"
            className="h-10 md:h-12 mb-6 lg:mb-12"
          />
          <nav className="flex flex-col gap-4 w-full items-center justify-center">
            {navItems
              .filter((item) => item.type !== "modal")
              .map((item) => (
                <button
                  key={item.key}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 md:py-3 rounded-full w-full justify-center text-sm md:text-lg ${
                    active === item.key
                      ? "bg-[#0458A9] text-white"
                      : "text-gray-500 hover:bg-[#0458A9]/10"
                  }`}
                  onClick={() => {
                    // Desktop navigation only handles 'navigate' type, modal is mobile-only concept here
                    if (item.type === "navigate") {
                      handleNav(item.path);
                    }
                  }}
                >
                  <item.icon size={20} />{" "}
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
          </nav>
        </div>
        {/* Support Tools at the bottom (for desktop) */}
        <div className="mt-8 w-full flex flex-col items-center">
          <h3 className="text-[#0458A9] font-bold text-xl mb-2">
            Support Tools
          </h3>
          <div className="flex flex-col gap-2 w-full">
            {supportTools.map((tool) => (
              <button
                key={tool.name}
                onClick={tool.action}
                className="border rounded-full py-2 px-4 text-sm md:text-lg text-gray-700 hover:bg-gray-100 w-full"
              >
                {tool.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Navigation via Portal */}
      {typeof document !== "undefined" &&
        createPortal(<MobileNavigation />, document.body)}

      {/* Support Modal for Mobile */}
      <SupportModal />

      {/* Individual Modals */}
      <FAQModal />
      <UserManualModal />
      <AboutUsModal />
      <ContactAdminModal />
    </>
  );
}
