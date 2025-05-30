import React, { useEffect, useState } from "react";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import SearchBar from "../components/SearchBar/SearchBar";
import RequestDetailsModal from "../components/RequestDetailsModal";
import { Calendar, Users, Clock, FileText } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { fetchRequests } from "../api/requests";
import { supabase } from "../supabase/supabaseClient";
import { getVenueImage } from "../utils/venueMatching";
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
  ContentSkeleton,
} from "../components/LoadingSkeletons";

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (text && typeof text === "string" && text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

function RequestCard({ request, onDetails, image }) {
  return (
    <div
      className="flex bg-white rounded-xl shadow border border-[#C0C0C0] overflow-hidden max-w-lg w-full cursor-pointer transition-all duration-150 ease-in-out hover:shadow-md hover:border-[#0458A9] mx-auto"
      onClick={() => onDetails(request)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) =>
        (e.key === "Enter" || e.key === " ") && onDetails(request)
      }
    >
      <div className="h-auto w-32 flex-shrink-0 overflow-hidden">
        <img
          src={image}
          alt={request.venue}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 p-3 gap-1 min-w-0">
        {/* Status Badge */}
        <div className="flex justify-end mb-1">
          {request.status && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold tracking-wide uppercase shadow-sm 
              ${
                request.status === "pending"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                  : request.status === "approved"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : request.status === "rejected"
                  ? "bg-red-100 text-red-800 border border-red-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300"
              }
            `}
              style={{ minWidth: 60, textAlign: "center" }}
            >
              {request.status}
            </span>
          )}
        </div>
        <h3 className="font-bold text-sm md:text-base mb-1 truncate">
          {request.venue}
        </h3>
        <div className="flex items-center text-xs text-gray-800 gap-1 mb-1 font-semibold">
          <Calendar size={12} />
          <span className="truncate">{truncateText(request.event, 15)}</span>
        </div>
        <div className="flex items-center text-xs text-gray-600 gap-1 mb-1">
          <FileText size={12} />
          <span className="truncate">{request.type}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500 gap-1 mb-2">
          <Clock size={12} />
          <span className="truncate text-xs">
            {request.perDayTimes && request.perDayTimes.length > 0
              ? `${new Date(request.perDayTimes[0].date).toLocaleDateString()}`
              : request.date}
          </span>
        </div>
        <div className="flex justify-end mt-auto">
          <ButtonPress>
            <button
              className="bg-[#0458A9] text-white rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-[#03407a] transition-colors pointer-events-none"
              onClick={(e) => {
                e.stopPropagation();
                onDetails(request);
              }}
            >
              Details
            </button>
          </ButtonPress>
        </div>
      </div>
    </div>
  );
}

function RequestsGrid({ requests, onDetails }) {
  // Responsive grid: 2 per row on sm+, 1 per row on mobile
  if (requests.length === 1) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        <RequestCard
          request={requests[0]}
          onDetails={onDetails}
          image={getVenueImage(requests[0].venue)}
        />
        <div aria-hidden className="hidden sm:block" />
      </div>
    );
  }
  return (
    <StaggerContainer
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch"
      staggerDelay={25}
    >
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onDetails={onDetails}
          image={getVenueImage(request.venue)}
        />
      ))}
    </StaggerContainer>
  );
}

function useRealtimeRequests(userId, refetch) {
  React.useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("user_requests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "booking_requests",
          filter: `requested_by=eq.${userId}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, refetch]);
}

export default function RequestsPage() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const requestsPerPage = 6;
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * requestsPerPage,
    currentPage * requestsPerPage
  );

  const loadRequests = async (isBackgroundRefresh = false) => {
    if (!currentUser) return;

    try {
      // Only show loading for initial load, not background refreshes
      if (!isBackgroundRefresh) {
        setIsLoading(true);
      }
      const reqs = await fetchRequests(currentUser.id);
      // Sort requests by creation date, newest first
      const sortedReqs = reqs.sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB - dateA; // Descending order (newest first)
      });
      setRequests(sortedReqs);
      setFilteredRequests(sortedReqs); // Initialize filtered requests
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      if (!isBackgroundRefresh) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line
  }, [currentUser]);

  // Filter requests based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(
        (request) =>
          request.event?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, requests]);

  useRealtimeRequests(currentUser?.id, () => loadRequests(true));

  const handleDetails = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Handler to refresh requests after reservation
  const handleReservationSubmitted = () => {
    loadRequests(true);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <PageTransition>
      <div className="flex flex-col lg:flex-row flex-1">
        <LeftSidebar active="requests" />
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
                    placeholder="Search your requests by event, venue, or status..."
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
                          ? `Your Requests (${filteredRequests.length})`
                          : "Your Requests"}
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
                  </div>
                </FadeIn>
              </ProgressiveLoad>
            </div>

            {/* Requests List with Pagination */}
            <div className="flex-1 flex flex-col lg:min-h-0 px-3 md:px-6 pb-20 lg:pb-0">
              <ProgressiveLoad
                isLoading={isLoading}
                skeleton={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <CardSkeleton key={i} className="h-32" />
                    ))}
                  </div>
                }
                className="lg:flex-1 lg:overflow-y-auto"
              >
                {paginatedRequests.length > 0 ? (
                  <FadeIn delay={100}>
                    <div className="pb-4">
                      <RequestsGrid
                        requests={paginatedRequests}
                        onDetails={handleDetails}
                      />
                    </div>
                  </FadeIn>
                ) : (
                  <FadeIn delay={100}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FileText size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No requests found
                      </h3>
                      <p className="text-gray-500 mb-4 max-w-md">
                        {searchTerm
                          ? `No requests match your search for "${searchTerm}". Try different keywords or clear your search.`
                          : "You haven't made any venue booking requests yet."}
                      </p>
                      {searchTerm ? (
                        <ButtonPress>
                          <button
                            onClick={clearSearch}
                            className="px-6 py-2 bg-[#0458A9] text-white rounded-full hover:bg-[#03407a] transition-colors font-medium"
                          >
                            View All Requests
                          </button>
                        </ButtonPress>
                      ) : (
                        <ButtonPress>
                          <button
                            onClick={() => (window.location.href = "/venues")}
                            className="px-6 py-2 bg-[#0458A9] text-white rounded-full hover:bg-[#03407a] transition-colors font-medium"
                          >
                            Browse Venues
                          </button>
                        </ButtonPress>
                      )}
                    </div>
                  </FadeIn>
                )}
              </ProgressiveLoad>

              {/* Pagination Controls - Fixed at bottom of this section */}
              <ProgressiveLoad
                isLoading={isLoading}
                skeleton={
                  <div className="flex justify-center items-center gap-2 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                    <ContentSkeleton lines={1} className="w-12 h-10" />
                    <ContentSkeleton lines={1} className="w-8 h-10" />
                    <ContentSkeleton lines={1} className="w-8 h-10" />
                    <ContentSkeleton lines={1} className="w-8 h-10" />
                    <ContentSkeleton lines={1} className="w-12 h-10" />
                  </div>
                }
                className="flex-shrink-0"
              >
                {totalPages > 1 && (
                  <FadeIn delay={125}>
                    <div className="flex justify-center items-center gap-2 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                      <ButtonPress>
                        <button
                          className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold transition hover:bg-gray-100 disabled:opacity-50"
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
                          </ButtonPress>
                        )
                      )}
                      <ButtonPress>
                        <button
                          className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold transition hover:bg-gray-100 disabled:opacity-50"
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </ButtonPress>
                    </div>
                  </FadeIn>
                )}
              </ProgressiveLoad>
            </div>
          </div>
        </main>
        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Details Modal */}
      <RequestDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        request={selectedRequest}
        onReservationUpdated={handleReservationSubmitted}
      />
    </PageTransition>
  );
}
