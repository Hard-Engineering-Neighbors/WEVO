import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  value = "",
  onChange,
  onSearch,
  placeholder = "Search for event venues, locations, or keywords to get started...",
  className = "",
  disabled = false,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-full sm:max-w-2xl md:max-w-3xl border border-gray-400 rounded-full"
      >
        {/* Left Icon */}
        <Search
          className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-[#0458A9]"
          size={25}
        />

        {/* Input */}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className={`w-full pl-12 pr-4 py-4 border border-gray-400 rounded-full shadow-sm focus:outline-none focus:border-[#0458A9] focus:ring-2 focus:ring-[#0458A9]/20 text-xs md:text-base transition-all duration-200 ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </form>
    </div>
  );
}
