import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import SearchBar from "../components/SearchBar/SearchBar";
import { Users, Info, MapPin, Filter, ListFilter } from "lucide-react";
import { fetchVenues } from "../api/venues";
import VenueDetailsModal from "../components/VenueDetailsModal";

import venueSample from "../assets/cultural_center.webp";

function VenueCard({ venue, onClick, index }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow border border-[#C0C0C0] flex flex-col overflow-hidden w-full max-w-xs mx-auto cursor-pointer hover:shadow-lg transition"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.03 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <motion.img
        src={venue.image}
        alt={venue.name}
        className="w-full h-32 object-cover"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2, delay: index * 0.03 + 0.05 }}
      />
      <motion.div
        className="p-4 flex flex-col flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, delay: index * 0.03 + 0.1 }}
      >
        <h3 className="font-bold text-lg mb-1">{venue.name}</h3>
        <p className="text-xs text-gray-600 mb-2 line-clamp-3">
          {venue.description}
        </p>
        <div className="flex items-center text-xs text-gray-500 mb-2 gap-1">
          <Users size={16} className="mr-1" />
          {venue.participants} Participants
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[10px] italic text-gray-400">
            fees may apply
          </span>
          <motion.button
            className="text-[#0458A9] text-xs font-semibold hover:underline"
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Details
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // TODO: Replace with real API call
    fetchVenues().then(setVenues);
  }, []);

  const handleCardClick = (venue) => {
    setSelectedVenue(venue);
    setModalOpen(true);
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
        <LeftSidebar active="venues" />
        {/* Center Content */}
        <motion.main
          className="w-full lg:w-3/5 bg-gray-50 p-3 md:p-6 space-y-4 order-2 lg:order-none min-h-screen"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          {/* Search Bar */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.15, delay: 0.1 }}
          >
            <SearchBar />
          </motion.div>
          {/* Title and Sort/Filter Row */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 mb-2 gap-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-[#0458A9] py-6"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              List of Available Venues
            </motion.h2>
            <motion.div
              className="flex gap-2"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.25 }}
            >
              <motion.button
                className="px-2 md:px-3 py-2 border rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ListFilter size={16} />
              </motion.button>
              <motion.button
                className="px-2 md:px-3 py-2 border rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter size={16} />
              </motion.button>
            </motion.div>
          </motion.div>
          {/* Venue Cards Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <AnimatePresence>
              {venues.map((venue, idx) => (
                <VenueCard
                  key={venue.id || idx}
                  venue={venue}
                  index={idx}
                  onClick={() => handleCardClick(venue)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.main>
        {/* Right Sidebar */}
        <RightSidebar />
      </div>
      {/* Venue Details Modal */}
      <VenueDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        venue={selectedVenue}
      />
    </motion.div>
  );
}
