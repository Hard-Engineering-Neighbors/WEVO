import React from "react";
import { CalendarDays, MapPin, RotateCcw } from "lucide-react";

export default function LeftSidebar() {
  return (
    <aside className="w-full lg:w-1/5 bg-white border-b lg:border-b-0 lg:border-r p-4 md:p-6 flex flex-col justify-start">
      <div className="w-full flex flex-col items-center lg:items-center">
        <img
          src="/wevoLogoPng.png"
          alt="Wevo Logo"
          className="h-10 md:h-12 mb-8 lg:mb-12"
        />
        <nav className="space-y-0 lg:space-y-4 flex flex-row lg:flex-col gap-2 lg:gap-0 mt-0 lg:mt-0">
          <button className="flex items-center gap-2 px-3 md:px-20 py-2 md:py-3 rounded-full bg-[#0458A9] text-white w-full text-xs md:text-base">
            <CalendarDays size={20} /> Calendar
          </button>
          <button className="flex items-center gap-2 px-3 md:px-20 py-2 md:py-3 rounded-full text-gray-500 hover:bg-[#0458A9]/10 w-full text-xs md:text-base">
            <MapPin size={20} /> Venues
          </button>
          <button className="flex items-center gap-2 px-3 md:px-20 py-2 md:py-3 rounded-full text-gray-500 hover:bg-[#0458A9]/10 w-full text-xs md:text-base">
            <RotateCcw size={20} /> Requests
          </button>
        </nav>
      </div>
    </aside>
  );
}
