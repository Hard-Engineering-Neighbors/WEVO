import React from "react";
import { CalendarDays, MapPin, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LeftSidebar({ active = "calendar" }) {
  const navigate = useNavigate();
  return (
    <aside className="w-full lg:w-1/5 bg-white lg:border-b-0 lg:border-r p-4 md:p-6 flex flex-col justify-between border-gray-400 min-h-screen">
      {/* Centered nav section */}
      <div className="flex flex-1 flex-col items-center justify-start w-full">
        <img
          src="/wevoLogoPng.png"
          alt="Wevo Logo"
          className="h-10 md:h-12 mb-8 lg:mb-12"
        />
        <nav className="flex flex-col gap-4 w-full items-center justify-center">
          <button
            className={`flex items-center gap-2 px-3 md:px-20 py-2 md:py-3 rounded-full w-full justify-center text-xs md:text-base ${
              active === "calendar"
                ? "bg-[#0458A9] text-white"
                : "text-gray-500 hover:bg-[#0458A9]/10"
            }`}
            onClick={() => navigate("/dashboard")}
          >
            <CalendarDays size={20} />{" "}
            <span className="font-medium">Calendar</span>
          </button>
          <button
            className={`flex items-center gap-2 px-3 md:px-20 py-2 md:py-3 rounded-full w-full justify-center text-xs md:text-base ${
              active === "venues"
                ? "bg-[#0458A9] text-white"
                : "text-gray-500 hover:bg-[#0458A9]/10"
            }`}
            onClick={() => navigate("/venues")}
          >
            <MapPin size={20} /> <span className="font-medium">Venues</span>
          </button>
          <button
            className={`flex items-center gap-2 px-3 md:px-20 py-2 md:py-3 rounded-full w-full justify-center text-xs md:text-base ${
              active === "requests"
                ? "bg-[#0458A9] text-white"
                : "text-gray-500 hover:bg-[#0458A9]/10"
            }`}
            onClick={() => navigate("/requests")}
          >
            <RotateCcw size={20} />{" "}
            <span className="font-medium">Requests</span>
          </button>
        </nav>
      </div>
      {/* Support Tools at the bottom, hidden on mobile */}
      <div className="mt-8 w-full flex flex-col items-center hidden md:flex">
        <h3 className="text-[#0458A9] font-bold text-lg mb-2">Support Tools</h3>
        <div className="flex flex-col gap-2 w-full">
          <button className="border rounded-full py-2 px-3 md:px-20 text-xs md:text-base text-gray-700 hover:bg-gray-100 w-full">
            FAQ
          </button>
          <button className="border rounded-full py-2 px-3 md:px-20 text-xs md:text-base text-gray-700 hover:bg-gray-100 w-full">
            User Manual
          </button>
          <button className="border rounded-full py-2 px-3 md:px-20 text-xs md:text-base text-gray-700 hover:bg-gray-100 w-full">
            Preferences
          </button>
          <button className="border rounded-full py-2 px-3 md:px-20 text-xs md:text-base text-gray-700 hover:bg-gray-100 w-full">
            Contact Admin
          </button>
        </div>
      </div>
    </aside>
  );
}
