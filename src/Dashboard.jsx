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
import Calendar from "./Calendar";
import EventsList from "./EventsList";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left Sidebar */}
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

        {/* Center Content */}
        <main className="w-full lg:w-3/5 bg-gray-50 p-3 md:p-6 space-y-4 order-2 lg:order-none">
          {/* Search Bar */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-full sm:max-w-2xl md:max-w-3xl">
              {/* Left Icon */}
              <Search
                className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-[#0458A9]"
                size={25}
              />

              {/* Right Icon */}
              <Bookmark
                className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-[#0458A9] hover:text-[#0458A9]/80 cursor-pointer"
                size={25}
              />

              {/* Input */}
              <input
                type="text"
                placeholder="Search for event venues, locations, or keywords to get started..."
                className="w-full pl-12 pr-9 py-4 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs md:text-base"
              />
            </div>
          </div>

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
        <aside className="w-full lg:w-1/5 bg-white border-t lg:border-t-0 lg:border-l p-4 md:p-6 order-1 lg:order-none flex flex-col gap-4">
          {/* Account Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-base font-medium text-gray-700">
              Account Name
            </div>
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User size={22} className="text-gray-600" />
              </span>
              <Menu size={22} className="text-gray-600" />
            </div>
          </div>

          {/* Notifications Box */}
          <div className="rounded-2xl border border-[#C0C0C0] p-4 bg-white">
            <h2 className="text-2xl font-bold text-[#0458A9] mb-2">
              Notifications
            </h2>
            <ul className="divide-y divide-gray-100">
              <li className="flex items-center py-2">
                <div className="flex-1">
                  <span className="text-[#0458A9] font-bold">Admin</span>
                  <span className="text-gray-400 font-medium ml-1">
                    Month, XX, XXXX at XX:XX
                  </span>
                  <div className="text-gray-700 text-sm">System Generated.</div>
                </div>
                <span className="w-3 h-3 bg-yellow-400 rounded-full ml-2"></span>
              </li>
              <li className="flex items-center py-2">
                <div className="flex-1">
                  <span className="text-[#0458A9] font-bold">Admin</span>
                  <span className="text-gray-400 font-medium ml-1">
                    Month, XX, XXXX at XX:XX
                  </span>
                  <div className="text-gray-700 text-sm">
                    Congratulations! lorem ipsum lorem….
                  </div>
                </div>
              </li>
              <li className="flex items-center py-2">
                <div className="flex-1">
                  <span className="text-[#0458A9] font-bold">Admin</span>
                  <span className="text-gray-400 font-medium ml-1">
                    Month, XX, XXXX at XX:XX
                  </span>
                  <div className="text-gray-700 text-sm">
                    Congratulations! lorem ipsum lorem….
                  </div>
                </div>
                <span className="w-3 h-3 bg-yellow-400 rounded-full ml-2"></span>
              </li>
              <li className="flex items-center py-2">
                <div className="flex-1">
                  <span className="text-[#0458A9] font-bold">Admin</span>
                  <span className="text-gray-400 font-medium ml-1">
                    Month, XX, XXXX at XX:XX
                  </span>
                  <div className="text-gray-700 text-sm">
                    Congratulations! lorem ipsum lorem….
                  </div>
                </div>
              </li>
              <li className="flex items-center py-2">
                <div className="flex-1">
                  <span className="text-[#0458A9] font-bold">Admin</span>
                  <span className="text-gray-400 font-medium ml-1">
                    Month, XX, XXXX at XX:XX
                  </span>
                  <div className="text-gray-700 text-sm">
                    Congratulations! lorem ipsum ...
                  </div>
                </div>
              </li>
            </ul>
            <div className="flex justify-center mt-6 mb-2">
              <button className="bg-gray-300 text-[#0458A9] font-bold text-2xl rounded w-full py-2">
                see all notifications
              </button>
            </div>
          </div>

          {/* Bottom Boxes (placeholder) */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="h-28 rounded-2xl border border-[#C0C0C0]" />
            <div className="h-28 rounded-2xl border border-[#C0C0C0]" />
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t py-4 px-6 mt-auto">
        <div className="text-sm text-gray-500 text-center">
          <p className="font-bold mb-1">
            All Rights Reserved: Hard Engineering Neighbors
          </p>
          <p>
            WEVO is an interactive web application designed to simplify venue
            reservations and provide real-time monitoring of events.
          </p>
        </div>
      </footer>
    </div>
  );
}
