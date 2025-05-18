import React from "react";
import { Search, Bookmark } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-full sm:max-w-2xl md:max-w-3xl border border-gray-400 rounded-full">
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
          className="w-full pl-12 pr-9 py-4 border border-gray-400 rounded-full shadow-sm focus:outline-none focus:border-gray-400 text-xs md:text-base"
        />
      </div>
    </div>
  );
}
