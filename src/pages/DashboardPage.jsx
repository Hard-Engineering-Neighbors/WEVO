import React from "react";
import {
  CalendarDays,
  MapPin,
  RotateCcw,
  Bell,
  User,
  Menu,
  Filter,
  ListFilter,
  Search,
  Bookmark,
} from "lucide-react";
import Calendar from "../components/Calendar/Calendar";
import EventsList from "../components/EventsList/EventsList";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import SearchBar from "../components/SearchBar/SearchBar";
import Footer from "../components/Footer/Footer";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row flex-1">
        <LeftSidebar />

        {/* Center Content */}
        <main className="w-full lg:w-3/5 bg-gray-50 p-3 md:p-6 space-y-4 order-2 lg:order-none">
          {/* Search Bar */}
          <SearchBar />

          {/* Calendar + Event List */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Calendar */}
            <div className="w-full md:w-2/3 mb-4 md:mb-0">
              <Calendar />
            </div>

            {/* Events List */}
            <div className="w-full md:w-1/3">
              <EventsList year={2025} month={3} />
            </div>
          </div>

          {/* Buttons below calendar and list */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-2 gap-2 md:gap-0">
            <div className="flex gap-2 md:gap-4 mb-2 md:mb-0">
              <button className="bg-[#0458A9] text-white px-3 md:px-4 py-2 rounded-full flex items-center gap-2 text-xs md:text-base">
                <CalendarDays size={16} /> 8 Events Booked
              </button>
              <button className="bg-[#0458A9] text-white px-3 md:px-4 py-2 rounded-full flex items-center gap-2 text-xs md:text-base">
                <MapPin size={16} /> 2 Venues Booked
              </button>
            </div>
            <div className="flex gap-2">
              <button className="px-2 md:px-3 py-2 border rounded-md">
                <ListFilter size={16} />
              </button>
              <button className="px-2 md:px-3 py-2 border rounded-md">
                <Filter size={16} />
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
