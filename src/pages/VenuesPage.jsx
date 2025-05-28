import React, { useEffect, useState } from "react";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import SearchBar from "../components/SearchBar/SearchBar";
import { Users, Info, MapPin, Filter, ListFilter } from "lucide-react";
import { fetchVenues } from "../api/venues";
import VenueDetailsModal from "../components/VenueDetailsModal";

import venueSample from "../assets/cultural_center.webp";

function VenueCard({ venue, onClick }) {
  return (
    <div
      className="bg-white rounded-xl shadow border border-[#C0C0C0] flex flex-col overflow-hidden w-full max-w-xs mx-auto cursor-pointer hover:shadow-lg transition"
      onClick={onClick}
    >
      <img
        src={venue.image}
        alt={venue.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
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
          <button
            className="text-[#0458A9] text-xs font-semibold hover:underline"
            onClick={onClick}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 8;
  const totalPages = Math.ceil(venues.length / venuesPerPage);
  const paginatedVenues = venues.slice(
    (currentPage - 1) * venuesPerPage,
    currentPage * venuesPerPage
  );

  useEffect(() => {
    // TODO: Replace with real API call
    fetchVenues().then(setVenues);
  }, []);

  const handleCardClick = (venue) => {
    setSelectedVenue(venue);
    setModalOpen(true);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row flex-1">
        <LeftSidebar active="venues" />
        {/* Center Content */}
        <main className="w-full lg:w-3/5 bg-gray-50 p-3 md:p-6 space-y-4 order-2 lg:order-none min-h-screen flex flex-col">
          {/* Search Bar */}
          <SearchBar />
          {/* Title and Sort/Filter Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 mb-2 gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0458A9] py-6">
              List of Available Venues
            </h2>
            <div className="flex gap-2">
              <button className="px-2 md:px-3 py-2 border rounded-md">
                <ListFilter size={16} />
              </button>
              <button className="px-2 md:px-3 py-2 border rounded-md">
                <Filter size={16} />
              </button>
            </div>
          </div>
          {/* Venue Cards Grid and Pagination */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedVenues.map((venue, idx) => (
                <VenueCard
                  key={idx + (currentPage - 1) * venuesPerPage}
                  venue={venue}
                  onClick={() => handleCardClick(venue)}
                />
              ))}
            </div>
            {/* Pagination Controls - always at the bottom */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 mb-2 pb-20 lg:pb-2 sticky bottom-0 bg-gray-50 pt-6 z-10">
                <button
                  className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold transition hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`px-4 py-2 rounded-full border font-semibold transition
                      ${
                        page === currentPage
                          ? "bg-[#0458A9] text-white border-[#0458A9] shadow"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }
                    `}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold transition hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
        {/* Right Sidebar */}
        <RightSidebar />
      </div>
      {/* Venue Details Modal */}
      <VenueDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        venue={selectedVenue}
      />
    </div>
  );
}
