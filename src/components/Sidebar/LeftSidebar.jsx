import React, { useState } from "react";
import {
  CalendarDays,
  MapPin,
  RotateCcw,
  HelpCircle,
  X,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function LeftSidebar({ active = "calendar" }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // State for individual under construction modals
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isUserManualModalOpen, setIsUserManualModalOpen] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
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
    { name: "Preferences", action: () => setIsPreferencesModalOpen(true) },
    {
      name: "Contact Admin",
      action: () => setIsContactAdminModalOpen(true),
    },
  ];

  // Support Modal Component
  const SupportModal = () => {
    if (!isSupportModalOpen) return null;
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
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

  // Generic Under Construction Modal Component
  const UnderConstructionModal = ({ isOpen, onClose, title }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
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
      <aside className="hidden lg:flex w-full lg:w-1/5 bg-white lg:border-b-0 lg:border-r p-4 md:p-6 flex-col justify-between border-gray-400 min-h-screen z-20">
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
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 md:py-3 rounded-full w-full justify-center text-xs md:text-base ${
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
          <h3 className="text-[#0458A9] font-bold text-lg mb-2">
            Support Tools
          </h3>
          <div className="flex flex-col gap-2 w-full">
            {supportTools.map((tool) => (
              <button
                key={tool.name}
                onClick={tool.action}
                className="border rounded-full py-2 px-4 text-xs md:text-base text-gray-700 hover:bg-gray-100 w-full"
              >
                {tool.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile: Fixed Bottom Tab Bar (hidden on lg and up) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md p-1 flex justify-around items-center z-30 h-16">
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

      {/* Support Modal for Mobile */}
      <SupportModal />

      {/* Individual Under Construction Modals */}
      <UnderConstructionModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
        title="FAQ"
      />
      <UnderConstructionModal
        isOpen={isUserManualModalOpen}
        onClose={() => setIsUserManualModalOpen(false)}
        title="User Manual"
      />
      <UnderConstructionModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        title="Preferences"
      />
      <UnderConstructionModal
        isOpen={isContactAdminModalOpen}
        onClose={() => setIsContactAdminModalOpen(false)}
        title="Contact Admin"
      />
    </>
  );
}
