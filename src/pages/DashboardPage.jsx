import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.15,
        staggerChildren: 0.03,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.15 },
    },
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex flex-col lg:flex-row flex-1">
        <LeftSidebar />

        {/* Center Content */}
        <motion.main
          className="w-full lg:w-3/5 bg-gray-50 p-3 md:p-6 space-y-4 order-2 lg:order-none"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Search Bar */}
          <motion.div variants={itemVariants}>
            <SearchBar />
          </motion.div>

          {/* Metrics Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            variants={itemVariants}
          >
            {/* Events and Venues Card */}
            <motion.div
              className="bg-white rounded-xl shadow p-4 flex items-center gap-4"
              whileHover={{ scale: 1.01, y: -1 }}
              transition={{ duration: 0.1 }}
            >
              <motion.div
                className="w-16 h-16 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full border-4 border-[#0458A9]"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                ></motion.div>
              </motion.div>
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.3 }}
              >
                <h3 className="font-semibold text-base">Events and Venues</h3>
                <p className="text-xs text-gray-500">Booked This April 2025</p>
              </motion.div>
            </motion.div>

            {/* Venue Usage Share Card */}
            <motion.div
              className="bg-white rounded-xl shadow p-4 flex items-center gap-4"
              whileHover={{ scale: 1.01, y: -1 }}
              transition={{ duration: 0.1 }}
            >
              <motion.div
                className="w-16 h-16 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.25 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full border-4 border-[#0458A9]"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                ></motion.div>
              </motion.div>
              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.35 }}
              >
                <h3 className="font-semibold text-base">Venue Usage Share</h3>
                <p className="text-xs text-gray-500">This April 2025</p>
              </motion.div>
            </motion.div>

            {/* Popularity Card */}
            <motion.div
              className="bg-white rounded-xl shadow p-4"
              whileHover={{ scale: 1.01, y: -1 }}
              transition={{ duration: 0.1 }}
            >
              <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.3 }}
              >
                <h3 className="font-semibold text-base">Popularity</h3>
                <p className="text-xs text-gray-500">This April 2025</p>
              </motion.div>
              <motion.div
                className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                style={{ transformOrigin: "left" }}
              >
                <motion.div
                  className="h-full bg-[#0458A9]"
                  style={{ width: "75%", transformOrigin: "left" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                ></motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Calendar and Side Sections */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            variants={itemVariants}
          >
            {/* Calendar on Left */}
            <motion.div
              className="md:col-span-2"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.35 }}
            >
              <Calendar />
            </motion.div>

            {/* Right Sections Column */}
            <motion.div
              className="flex flex-col gap-4"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.4 }}
            >
              {/* Venue Distribution */}
              <motion.div
                className="bg-white rounded-xl shadow p-4"
                whileHover={{ scale: 1.005 }}
                transition={{ duration: 0.1 }}
              >
                <motion.div
                  className="flex items-center justify-between mb-4"
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.45 }}
                >
                  <h3 className="font-semibold text-lg text-[#0458A9]">
                    Venue Distribution
                  </h3>
                  <div className="flex gap-2">
                    <motion.button
                      className="p-1 text-gray-400 hover:text-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
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
                    </motion.button>
                    <motion.button
                      className="p-1 text-gray-400 hover:text-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
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
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-4 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.5 }}
                >
                  {/* COM Gym */}
                  <motion.div
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.55 }}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span>Com Gym</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#0458A9]"
                        style={{ width: "72%", transformOrigin: "left" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                      ></motion.div>
                    </div>
                  </motion.div>

                  {/* Cultural Center */}
                  <motion.div
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.6 }}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cultural Center</span>
                      <span className="font-medium">27%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#0458A9]"
                        style={{ width: "27%", transformOrigin: "left" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.4, delay: 0.65 }}
                      ></motion.div>
                    </div>
                  </motion.div>

                  {/* Venue 3 */}
                  <motion.div
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.65 }}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span>Venue 3</span>
                      <span className="font-medium">1%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#0458A9]"
                        style={{ width: "1%", transformOrigin: "left" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                      ></motion.div>
                    </div>
                  </motion.div>

                  {/* Venue 4 */}
                  <motion.div
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.7 }}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span>Venue 4</span>
                      <span className="font-medium">1%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#0458A9]"
                        style={{ width: "1%", transformOrigin: "left" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.4, delay: 0.75 }}
                      ></motion.div>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="mt-4 text-right"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.8 }}
                >
                  <motion.button
                    className="text-[#0458A9] text-sm hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Full View
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Reservations */}
              <motion.div
                className="bg-white rounded-xl shadow p-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.005 }}
                transition={{ duration: 0.2, delay: 0.85 }}
              >
                <motion.div
                  className="flex items-center justify-between mb-4"
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.9 }}
                >
                  <h3 className="font-semibold text-lg text-[#0458A9]">
                    Reservations
                  </h3>
                  <div className="flex gap-2">
                    <motion.button
                      className="p-1 text-gray-400 hover:text-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
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
                    </motion.button>
                    <motion.button
                      className="p-1 text-gray-400 hover:text-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
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
                    </motion.button>
                  </div>
                </motion.div>

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

                <motion.div
                  className="mt-4 text-right"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.95 }}
                >
                  <motion.button
                    className="text-[#0458A9] text-sm hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Full View
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
      <Footer />
    </motion.div>
  );
}
