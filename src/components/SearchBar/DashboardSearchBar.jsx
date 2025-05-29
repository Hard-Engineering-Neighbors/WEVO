import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, MapPin, Users } from "lucide-react";
import { fetchVenues } from "../../api/venues";

export default function DashboardSearchBar({
  onSearch,
  placeholder = "Search for event venues, locations, or keywords to get started...",
  className = "",
  disabled = false,
}) {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [venues, setVenues] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load venues for suggestions
  useEffect(() => {
    const loadVenues = async () => {
      try {
        const venuesData = await fetchVenues();
        setVenues(venuesData);
      } catch (error) {
        console.error("Error loading venues:", error);
      }
    };
    loadVenues();
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (!value.trim()) {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = venues
      .filter(
        (venue) =>
          venue.name.toLowerCase().includes(value.toLowerCase()) ||
          venue.description?.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 suggestions

    setFilteredSuggestions(filtered);
  }, [value, venues]);

  // Update dropdown position when it opens
  useEffect(() => {
    if (isOpen && searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && value.trim()) {
      onSearch(value.trim());
      setIsOpen(false);
      setValue("");
    }
  };

  const handleInputChange = (newValue) => {
    setValue(newValue);
    setIsOpen(newValue.length > 0);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (venue) => {
    if (onSearch) {
      onSearch(venue.name);
      setIsOpen(false);
      setValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const newIndex =
            prev < filteredSuggestions.length - 1 ? prev + 1 : prev;
          // Scroll the selected item into view
          setTimeout(() => {
            const dropdownElement = dropdownRef.current;
            const scrollContainer =
              dropdownElement?.querySelector(".overflow-y-auto");
            if (scrollContainer && newIndex >= 0) {
              const selectedElement =
                scrollContainer.querySelectorAll("button")[newIndex];
              if (selectedElement) {
                selectedElement.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                });
              }
            }
          }, 0);
          return newIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const newIndex = prev > 0 ? prev - 1 : -1;
          // Scroll the selected item into view
          setTimeout(() => {
            const dropdownElement = dropdownRef.current;
            const scrollContainer =
              dropdownElement?.querySelector(".overflow-y-auto");
            if (scrollContainer && newIndex >= 0) {
              const selectedElement =
                scrollContainer.querySelectorAll("button")[newIndex];
              if (selectedElement) {
                selectedElement.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                });
              }
            }
          }, 0);
          return newIndex;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Dropdown component to be rendered via portal
  const DropdownContent = () => (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden"
          style={{ zIndex: 998 }}
          onClick={() => {
            setIsOpen(false);
            setSelectedIndex(-1);
          }}
        />
      )}

      {/* Dropdown Suggestions */}
      {isOpen && filteredSuggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="fixed bg-white border border-[#C0C0C0] rounded-xl shadow-lg max-h-80 md:max-h-96 flex flex-col"
          style={{
            zIndex: 900,
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Header - Fixed */}
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50 flex-shrink-0 rounded-t-xl">
            Suggested venues
          </div>

          {/* Scrollable venue suggestions */}
          <div
            className="flex-1 overflow-y-auto transition-colors custom-scrollbar"
            style={{
              maxHeight: "240px",
              // Firefox scrollbar styling
              scrollbarWidth: "thin",
              scrollbarColor: "#D1D5DB #F3F4F6",
            }}
          >
            <div className="py-1">
              {filteredSuggestions.map((venue, index) => (
                <button
                  key={venue.name}
                  onClick={() => handleSuggestionClick(venue)}
                  className={`w-full text-left px-4 py-3 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 active:bg-gray-100 touch-manipulation border-l-4 border-transparent hover:border-[#0458A9] ${
                    index === selectedIndex
                      ? "bg-[#0458A9]/5 border-l-[#0458A9]"
                      : ""
                  }`}
                  type="button"
                >
                  <div className="flex items-start gap-3">
                    {/* Venue Image */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                      <img
                        src={venue.image_url || "/images/placeholder_venue.png"}
                        alt={venue.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                        style={{ display: "none" }}
                      >
                        <MapPin size={20} className="text-gray-400" />
                      </div>
                    </div>

                    {/* Venue Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm sm:text-base truncate hover:text-[#0458A9] transition-colors">
                        {venue.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                        {venue.description}
                      </div>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                          <Users size={12} className="mr-1 text-[#0458A9]" />
                          <span className="font-medium">
                            {venue.participants}
                          </span>
                          <span className="ml-1">participants</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Show all results option - Fixed at bottom */}
          <div className="border-t border-gray-100 flex-shrink-0 rounded-b-xl bg-white">
            <button
              onClick={() => {
                if (onSearch) {
                  onSearch(value.trim());
                  setIsOpen(false);
                  setValue("");
                }
              }}
              className="w-full text-left px-4 py-3 transition-all duration-200 hover:bg-[#0458A9]/5 focus:outline-none focus:bg-[#0458A9]/5 active:bg-[#0458A9]/10 touch-manipulation group rounded-b-xl"
              type="button"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#0458A9]/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-[#0458A9]/20 transition-colors">
                    <Search size={16} className="text-[#0458A9]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0458A9] group-hover:text-[#03407a] transition-colors">
                      Search for "{value}"
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      View all matching venues
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                  Press Enter
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className={`flex justify-center relative ${className}`}>
      {/* Custom CSS for scrollbar styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F3F4F6;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 4px;
          border: 1px solid #F3F4F6;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
      `}</style>

      <div className="relative w-full max-w-full sm:max-w-2xl md:max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="relative border border-gray-400 rounded-full"
        >
          {/* Left Icon */}
          <Search
            className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-[#0458A9] z-10"
            size={25}
          />

          {/* Input */}
          <input
            ref={searchRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => value.length > 0 && setIsOpen(true)}
            disabled={disabled}
            className={`w-full pl-12 pr-4 py-4 border border-gray-400 rounded-full shadow-sm focus:outline-none focus:border-[#0458A9] focus:ring-2 focus:ring-[#0458A9]/20 text-xs md:text-base transition-all duration-200 ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </form>

        {/* Render dropdown via portal to ensure it's above everything */}
        {typeof document !== "undefined" &&
          createPortal(<DropdownContent />, document.body)}
      </div>
    </div>
  );
}
