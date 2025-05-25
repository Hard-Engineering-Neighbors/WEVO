import React, { useEffect, useState } from "react";
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
  Clock,
} from "lucide-react";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import SearchBar from "../components/SearchBar/SearchBar";
import Footer from "../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar/Calendar";

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Trap user on dashboard: disable back/forward navigation
    window.history.pushState({ page: "dashboard-lock" }, "", "/dashboard");
    const blockNav = () => {
      if (window.location.pathname !== "/dashboard") {
        navigate("/dashboard", { replace: true });
        window.history.pushState({ page: "dashboard-lock" }, "", "/dashboard");
      } else {
        window.history.pushState({ page: "dashboard-lock" }, "", "/dashboard");
      }
    };
    window.addEventListener("popstate", blockNav);
    return () => window.removeEventListener("popstate", blockNav);
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row flex-1">
        <LeftSidebar />

        {/* Center Content */}
        <main className="w-full lg:w-3/5 bg-gray-50 p-3 md:p-6 space-y-4 order-2 lg:order-none">
          {/* Search Bar */}
          <SearchBar />

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Events and Venues Card */}
            <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-[#0458A9]"></div>
              </div>
              <div>
                <h3 className="font-semibold text-base">Events and Venues</h3>
                <p className="text-xs text-gray-500">Booked This April 2025</p>
              </div>
            </div>

            {/* Venue Usage Share Card */}
            <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-[#0458A9]"></div>
              </div>
              <div>
                <h3 className="font-semibold text-base">Venue Usage Share</h3>
                <p className="text-xs text-gray-500">This April 2025</p>
              </div>
            </div>

            {/* Popularity Card */}
            <div className="bg-white rounded-xl shadow p-4">
              <div>
                <h3 className="font-semibold text-base">Popularity</h3>
                <p className="text-xs text-gray-500">This April 2025</p>
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0458A9]"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Calendar and Side Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Calendar on Left */}
            <div className="md:col-span-2">
              <Calendar />
            </div>

            {/* Right Sections Column */}
            <div className="flex flex-col gap-4">
              {/* Venue Distribution */}
              <div className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-[#0458A9]">
                    Venue Distribution
                  </h3>
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 15l7-7 7 7"></path>
                      </svg>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  {/* COM Gym */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Com Gym</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0458A9]"
                        style={{ width: "72%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Cultural Center */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cultural Center</span>
                      <span className="font-medium">27%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0458A9]"
                        style={{ width: "27%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Venue 3 */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Venue 3</span>
                      <span className="font-medium">1%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0458A9]"
                        style={{ width: "1%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Venue 4 */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Venue 4</span>
                      <span className="font-medium">1%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0458A9]"
                        style={{ width: "1%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-right">
                  <button className="text-[#0458A9] text-sm hover:underline">
                    Full View
                  </button>
                </div>
              </div>

              {/* Reservations */}
              <div className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-[#0458A9]">
                    Reservations
                  </h3>
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 15l7-7 7 7"></path>
                      </svg>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-md mb-2">April 3</h4>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-sm">
                      <User size={14} className="text-gray-500" />
                      <span>Organization Name</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin size={14} className="text-gray-500" />
                      <span>COM Gym</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock size={14} className="text-gray-500" />
                      <span>April 3, 7:30 AM to April 4 5:30 PM</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-right">
                  <button className="text-[#0458A9] text-sm hover:underline">
                    Full View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
