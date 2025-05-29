import React, { useEffect, useState } from "react";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import SearchBar from "../components/SearchBar/SearchBar";
import { Users, Info, MapPin, Filter, ListFilter } from "lucide-react";
import { fetchVenues } from "../api/venues";
import VenueDetailsModal from "../components/VenueDetailsModal";
import { useSearchParams } from "react-router-dom";
import {
  PageTransition,
  FadeIn,
  StaggerContainer,
  ScaleOnHover,
  ButtonPress,
  ProgressiveLoad,
} from "../components/AnimationWrapper";
import {
  CardSkeleton,
  PageHeaderSkeleton,
  SearchBarSkeleton,
} from "../components/LoadingSkeletons";

import venueSample from "../assets/cultural_center.webp";

function VenueCard({ venue, onClick }) {
  const isMaintenance = venue.status === "maintenance";
  const isActive = venue.status === "active";
  // Debug logging for venue image
  React.useEffect(() => {
    if (venue && venue.image) {
      console.log(`VenueCard - ${venue.name} image:`, venue.image);
      console.log(`VenueCard - ${venue.name} image type:`, typeof venue.image);
      console.log(
        `VenueCard - ${venue.name} is data URL:`,
        venue.image.startsWith("data:")
      );
    }
  }, [venue]);

  return (
    <ButtonPress className="h-full">
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 hover:border-[#0458A9] hover:-translate-y-1 ${
          isMaintenance ? "opacity-60 pointer-events-none" : ""
        }`}
        onClick={isActive ? onClick : undefined}
        style={isMaintenance ? { pointerEvents: "none" } : {}}
      >
        <div className="relative overflow-hidden flex-shrink-0">
          <img
            src={venue.image_url || "/images/placeholder_venue.png"}
            alt={venue.name}
            className="w-full h-36 object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/placeholder_venue.png";
            }}
          />
          {isMaintenance && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Under Maintenance
            </div>
          )}
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 leading-tight">
            {venue.name}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3 flex-grow">
            {venue.description}
          </p>

          <div className="space-y-2 mt-auto">
            <div className="flex items-center gap-2 text-sm text-[#0458A9] font-semibold">
              <Users size={16} />
              <span>{venue.capacity} Participants Max</span>
            </div>
            <div className="text-xs text-gray-500">
              <span className="font-medium">Managed by:</span>{" "}
              {venue.department || "Administration"}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xs italic text-gray-400">
                *fees may apply
              </span>
              <button
                className={`px-3 py-1.5 bg-[#0458A9] text-white text-xs font-semibold rounded-lg hover:bg-[#03407a] transition-all duration-200 hover:shadow-md ${
                  !isActive ? "opacity-50 cursor-not-allowed bg-gray-400" : ""
                }`}
                onClick={isActive ? onClick : undefined}
                disabled={!isActive}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </ButtonPress>
  );
}

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [searchParams] = useSearchParams();

  const venuesPerPage = 8;
  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage);
  const paginatedVenues = filteredVenues.slice(
    (currentPage - 1) * venuesPerPage,
    currentPage * venuesPerPage
  );

  useEffect(() => {
    const loadVenues = async () => {
      setIsLoading(true);
      try {
        // Add artificial delay to show loading state
        await new Promise((resolve) => setTimeout(resolve, 800));
        const venuesData = await fetchVenues();

        // Debug logging for loaded venues
        console.log("VenuesPage - Loaded venues:", venuesData);
        console.log("VenuesPage - Number of venues:", venuesData.length);
        venuesData.forEach((venue, index) => {
          console.log(
            `VenuesPage - Venue ${index + 1} (${venue.name}) image:`,
            venue.image
          );
        });

        setVenues(venuesData);
        setFilteredVenues(venuesData); // Initialize filtered venues
      } catch (error) {
        console.error("Error loading venues:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVenues();
  }, []);

  // Initialize search term from URL parameters
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  // Filter venues based on search term and status
  useEffect(() => {
    if (!searchTerm.trim()) {
      // Only show venues that are not inactive
      setFilteredVenues(venues.filter((v) => v.status !== "inactive"));
    } else {
      const filtered = venues.filter(
        (venue) =>
          venue.status !== "inactive" &&
          (venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            venue.description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            venue.capacity?.toString().includes(searchTerm))
      );
      setFilteredVenues(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, venues]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCardClick = (venue) => {
    setSelectedVenue(venue);
    setModalOpen(true);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <PageTransition>
      <div className="flex flex-col lg:flex-row flex-1">
        <LeftSidebar active="venues" />

        {/* Center Content */}
        <main className="w-full lg:w-3/5 bg-gray-50 order-2 lg:order-none min-h-screen lg:h-screen lg:overflow-y-hidden overflow-x-hidden">
          <div className="max-w-screen-xl mx-auto w-full flex flex-col lg:h-full overflow-x-hidden">
            <div className="p-3 md:p-6 space-y-4 flex-shrink-0">
              {/* Search Bar */}
              <ProgressiveLoad
                isLoading={isLoading}
                skeleton={<SearchBarSkeleton />}
              >
                <FadeIn delay={50}>
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onSearch={handleSearch}
                    placeholder="Search venues by name, description, or capacity..."
                    disabled={isLoading}
                  />
                </FadeIn>
              </ProgressiveLoad>

              {/* Title and Sort/Filter Row */}
              <ProgressiveLoad
                isLoading={isLoading}
                skeleton={<PageHeaderSkeleton />}
              >
                <FadeIn delay={75}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-[#0458A9] py-2 md:py-4">
                        {searchTerm
                          ? `Search Results (${filteredVenues.length})`
                          : "List of Available Venues"}
                      </h2>
                      {searchTerm && (
                        <div className="flex items-center gap-2 -mt-2 mb-2">
                          <span className="text-sm text-gray-600">
                            Searching for: "{searchTerm}"
                          </span>
                          <ButtonPress>
                            <button
                              onClick={clearSearch}
                              className="text-sm text-[#0458A9] hover:text-[#03407a] underline transition-colors"
                            >
                              Clear search
                            </button>
                          </ButtonPress>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <ButtonPress>
                        <button className="px-2 md:px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors">
                          <ListFilter size={16} />
                        </button>
                      </ButtonPress>
                      <ButtonPress>
                        <button className="px-2 md:px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors">
                          <Filter size={16} />
                        </button>
                      </ButtonPress>
                    </div>
                  </div>
                </FadeIn>
              </ProgressiveLoad>
            </div>

            {/* Venue Cards Grid and Pagination */}
            <div className="flex-1 flex flex-col lg:min-h-0 px-3 md:px-6 pb-20 lg:pb-0">
              <ProgressiveLoad
                isLoading={isLoading}
                skeleton={
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <CardSkeleton key={i} />
                    ))}
                  </div>
                }
                className="lg:flex-1 lg:overflow-y-auto"
              >
                {paginatedVenues.length > 0 ? (
                  <StaggerContainer
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 items-stretch pb-6"
                    staggerDelay={25}
                  >
                    {paginatedVenues.map((venue, idx) => (
                      <VenueCard
                        key={idx + (currentPage - 1) * venuesPerPage}
                        venue={venue}
                        onClick={() => handleCardClick(venue)}
                      />
                    ))}
                  </StaggerContainer>
                ) : (
                  <FadeIn delay={100}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <MapPin size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No venues found
                      </h3>
                      <p className="text-gray-500 mb-4 max-w-md">
                        {searchTerm
                          ? `No venues match your search for "${searchTerm}". Try different keywords or clear your search.`
                          : "No venues are currently available."}
                      </p>
                      {searchTerm && (
                        <ButtonPress>
                          <button
                            onClick={clearSearch}
                            className="px-6 py-2 bg-[#0458A9] text-white rounded-full hover:bg-[#03407a] transition-colors font-medium"
                          >
                            View All Venues
                          </button>
                        </ButtonPress>
                      )}
                    </div>
                  </FadeIn>
                )}
              </ProgressiveLoad>

              {/* Pagination Controls - Fixed at bottom of this section */}
              {!isLoading && totalPages > 1 && (
                <FadeIn delay={125}>
                  <div className="flex justify-center items-center gap-2 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                    <ButtonPress>
                      <button
                        className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold transition-all hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                    </ButtonPress>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <ButtonPress key={page}>
                          <button
                            className={`px-4 py-2 rounded-full border font-semibold transition-all duration-200
                            ${
                              page === currentPage
                                ? "bg-[#0458A9] text-white border-[#0458A9] shadow-lg scale-105"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                            }
                          `}
                            onClick={() => goToPage(page)}
                          >
                            {page}
                          </button>
                        </ButtonPress>
                      )
                    )}

                    <ButtonPress>
                      <button
                        className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold transition-all hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </ButtonPress>
                  </div>
                </FadeIn>
              )}
            </div>
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
    </PageTransition>
  );
}
