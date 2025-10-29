import React, { useEffect, useState } from "react";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import SearchBar from "../components/SearchBar/SearchBar";
import RequestDetailsModal from "../components/RequestDetailsModal";
import { Calendar, Users, Clock, FileText, MapPin } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";
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
import { Filter, ChevronDown, ListRestart } from "lucide-react";

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
      className="flex bg-white rounded-xl shadow border border-[#C0C0C0] overflow-hidden w-full cursor-pointer transition-all duration-150 ease-in-out hover:shadow-md hover:border-[#0458A9]"
      onClick={() => onDetails(request)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) =>
        (e.key === "Enter" || e.key === " ") && onDetails(request)
      }
    >
      <div className="h-auto w-40 flex-shrink-0 overflow-hidden">
        <img
          src={image}
          alt={request.venue}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 p-4 gap-2 min-w-0">
        {/* Status Badge */}
        <div className="flex justify-end mb-1">
          {request.status && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm 
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

        {/* Event Name - Main Title */}
        <h3 className="font-bold text-lg md:text-xl text-gray-900 leading-tight line-clamp-2 mb-1">
          {request.event}
        </h3>

        {/* Venue - Secondary Info */}
        <div className="flex items-center text-sm text-[#0458A9] gap-1.5 mb-1 font-semibold">
          <MapPin size={14} />
          <span className="truncate">{request.venue}</span>
        </div>

        {/* Event Type */}
        <div className="flex items-center text-xs text-gray-600 gap-1.5 mb-1">
          <FileText size={13} />
          <span className="truncate">{request.type}</span>
        </div>

        {/* Date */}
        <div className="flex items-center text-xs text-gray-500 gap-1.5 mb-2">
          <Clock size={13} />
          <span className="truncate">
            {request.perDayTimes && request.perDayTimes.length > 0
              ? `${new Date(request.perDayTimes[0].date).toLocaleDateString()}`
              : request.date}
          </span>
        </div>

        {/* Details Button */}
        <div className="flex justify-end mt-auto">
          <ButtonPress>
            <button
              className="bg-[#0458A9] text-white rounded-full px-5 py-2 text-xs font-semibold hover:bg-[#03407a] transition-colors pointer-events-none"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
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
      className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch"
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
  const { isRightSidebarCollapsed } = useSidebar();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadRequests = async (isBackgroundRefresh = false) => {
    if (!currentUser) return;

    try {
      if (!isBackgroundRefresh) {
        setIsLoading(true);
      }
      const reqs = await fetchRequests(currentUser.id);
      setRequests(reqs);
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

  // Combined filtering and sorting logic
  useEffect(() => {
    let processedRequests = [...requests];

    // Apply status filter
    if (statusFilter !== "all") {
      processedRequests = processedRequests.filter(
        (r) => r.status && r.status.toLowerCase() === statusFilter
      );
    }

    // Apply search term
    if (searchTerm.trim()) {
      const lowercasedSearch = searchTerm.toLowerCase();
      processedRequests = processedRequests.filter(
        (request) =>
          request.event?.toLowerCase().includes(lowercasedSearch) ||
          request.venue?.toLowerCase().includes(lowercasedSearch) ||
          request.status?.toLowerCase().includes(lowercasedSearch) ||
          request.description?.toLowerCase().includes(lowercasedSearch)
      );
    }

    // Apply sorting
    processedRequests.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      switch (sortOption) {
        case "oldest":
          return dateA - dateB;
        case "newest":
        default:
          return dateB - dateA;
      }
    });

    setFilteredRequests(processedRequests);
  }, [requests, searchTerm, sortOption, statusFilter]);

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

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortOption("newest");
  };

  // Handler to refresh requests after reservation
  const handleReservationSubmitted = () => {
    loadRequests(true);
  };

  const groupedRequests = filteredRequests.reduce((acc, req) => {
    const status = req.status ? req.status.toLowerCase() : "unknown";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(req);
    return acc;
  }, {});

  const statusOrder = ["pending", "approved", "rejected", "cancelled"];

  return (
    <PageTransition>
      <div className="flex flex-col lg:flex-row flex-1">
        <LeftSidebar active="requests" />
        {/* Center Content */}
        <main
          className={`w-full bg-gray-50 order-2 lg:order-none min-h-screen lg:h-screen lg:overflow-y-hidden overflow-x-hidden transition-all duration-300 ${
            isRightSidebarCollapsed ? "lg:w-4/5" : "lg:w-3/5"
          }`}
        >
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
                        Your Requests
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
                    {/* Filter and Sort Controls */}
                    <div className="flex items-center gap-2">
                      {/* Status Filter Dropdown */}
                      <div className="relative">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0458A9] transition"
                        >
                          <option value="all">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>

                      {/* Sort By Dropdown */}
                      <div className="relative">
                        <select
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                          className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0458A9] transition"
                        >
                          <option value="newest">Sort: Newest</option>
                          <option value="oldest">Sort: Oldest</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>

                      {/* Reset Button */}
                      <ButtonPress>
                        <button
                          onClick={resetFilters}
                          className="p-2 bg-white border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition"
                          title="Reset filters and sort"
                        >
                          <ListRestart size={16} />
                        </button>
                      </ButtonPress>
                    </div>
                  </div>
                </FadeIn>
              </ProgressiveLoad>
            </div>

            {/* Requests List */}
            <div className="flex-1 lg:overflow-y-auto px-3 md:px-6 pb-20 lg:pb-4">
              <ProgressiveLoad
                isLoading={isLoading}
                skeleton={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <CardSkeleton key={i} className="h-32" />
                    ))}
                  </div>
                }
              >
                {filteredRequests.length > 0 ? (
                  <div className="space-y-8">
                    {statusOrder.map((status) =>
                      groupedRequests[status] ? (
                        <div key={status}>
                          <h3 className="text-lg font-bold text-gray-800 mb-3 capitalize border-b-2 border-gray-200 pb-2">
                            {status} ({groupedRequests[status].length})
                          </h3>
                          <RequestsGrid
                            requests={groupedRequests[status]}
                            onDetails={handleDetails}
                          />
                        </div>
                      ) : null
                    )}
                  </div>
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
                        {searchTerm || statusFilter !== "all"
                          ? `No requests match your criteria. Try adjusting your filters or search term.`
                          : "You haven't made any venue booking requests yet."}
                      </p>
                      {searchTerm || statusFilter !== "all" ? (
                        <ButtonPress>
                          <button
                            onClick={resetFilters}
                            className="px-6 py-2 bg-[#0458A9] text-white rounded-full hover:bg-[#03407a] transition-colors font-medium"
                          >
                            Reset Filters
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
