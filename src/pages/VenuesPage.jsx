import React from "react";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import SearchBar from "../components/SearchBar/SearchBar";
import { Users, Info, MapPin, Filter, ListFilter } from "lucide-react";

import venueSample from "../assets/cultural_center.webp";

const venues = Array(8).fill({
  name: "WVSU Cultural Center",
  description:
    "A dynamic space on campus where students and communities connect through art, culture, and shared experiences.",
  participants: 400,
  image: "../assets/cultural_center.webp", // Replace with actual image path
});

function VenueCard({ venue }) {
  return (
    <div className="bg-white rounded-xl shadow border border-[#C0C0C0] flex flex-col overflow-hidden w-full max-w-xs mx-auto">
      <img
        src={venueSample}
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
          <button className="text-[#0458A9] text-xs font-semibold hover:underline">
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VenuesPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row flex-1">
        <LeftSidebar active="venues" />
        {/* Center Content */}
        <main className="w-full lg:w-3/5 bg-gray-50 p-3 md:p-6 space-y-4 order-2 lg:order-none min-h-screen">
          {/* Search Bar */}
          <SearchBar />
          {/* Title and Sort/Filter Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 mb-2 gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0458A9]">
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
          {/* Venue Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {venues.map((venue, idx) => (
              <VenueCard key={idx} venue={venue} />
            ))}
          </div>
        </main>
        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
