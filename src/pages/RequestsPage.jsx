import React, { useEffect, useState } from "react";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import SearchBar from "../components/SearchBar/SearchBar";
import RequestDetailsModal from "../components/RequestDetailsModal";
import {
  Calendar,
  Users,
  ListFilter,
  Filter,
  Clock,
  FileText,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { fetchRequests } from "../api/requests";
import { supabase } from "../supabase/supabaseClient";

import venueSample from "../assets/cultural_center.webp";

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (text && typeof text === "string" && text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

function RequestCard({ request, onDetails }) {
  return (
    <div className="flex bg-white rounded-xl shadow border border-[#C0C0C0] overflow-hidden max-w-2xl w-full">
      <div className="h-auto w-40 flex-shrink-0">
        <img
          src={request.image}
          alt={request.venue}
          className="w-full h-full object-cover rounded-l-xl"
        />
      </div>
      <div className="flex flex-col flex-1 p-4 gap-1">
        {/* Status Badge */}
        <div className="flex justify-end mb-1">
          {request.status && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase shadow-sm 
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
              style={{ minWidth: 70, textAlign: "center" }}
            >
              {request.status}
            </span>
          )}
        </div>
        <h3 className="font-bold text-base md:text-lg mb-1">{request.venue}</h3>
        <div className="flex items-center text-xs text-gray-700 gap-2 mb-1">
          <Calendar size={14} /> {truncateText(request.event, 15)}
          <FileText size={14} className="ml-2" /> {request.type}
        </div>
        <div className="flex items-center text-xs text-gray-500 gap-2 mb-2">
          <Clock size={14} />
          {request.perDayTimes && request.perDayTimes.length > 0 ? (
            <span>
              {new Date(request.perDayTimes[0].date).toLocaleDateString()} {request.perDayTimes[0].startTime} - {new Date(request.perDayTimes[request.perDayTimes.length-1].date).toLocaleDateString()} {request.perDayTimes[request.perDayTimes.length-1].endTime}
            </span>
          ) : (
            request.date
          )}
        </div>
        <div className="flex justify-end mt-auto">
          <button
            className="bg-[#0458A9] text-white rounded-full px-6 py-2 text-xs font-semibold hover:bg-[#03407a]"
            onClick={() => onDetails(request)}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

function RequestsGrid({ requests, onDetails }) {
  // Responsive grid: 2 per row on md+, 1 per row on mobile
  if (requests.length === 1) {
    return (
      <div className="w-full">
        <RequestCard request={requests[0]} onDetails={onDetails} />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} onDetails={onDetails} />
      ))}
    </div>
  );
}

function useRealtimeRequests(userId, refetch) {
  React.useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel('user_requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'booking_requests', filter: `requested_by=eq.${userId}` },
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
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;
  const totalPages = Math.ceil(requests.length / requestsPerPage);
  const paginatedRequests = requests.slice(
    (currentPage - 1) * requestsPerPage,
    currentPage * requestsPerPage
  );

  const loadRequests = async () => {
    if (!currentUser) return;
    const reqs = await fetchRequests(currentUser.id);
    setRequests(reqs);
  };

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line
  }, [currentUser]);

  useRealtimeRequests(currentUser?.id, loadRequests);

  const handleDetails = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  // Handler to refresh requests after reservation
  const handleReservationSubmitted = () => {
    loadRequests();
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row flex-1">
        <LeftSidebar active="requests" />
        {/* Center Content */}
        <main className="w-full lg:w-3/5 bg-gray-50 p-3 md:p-6 space-y-4 order-2 lg:order-none min-h-screen">
          {/* Search Bar */}
          <SearchBar />
          {/* Title and Sort/Filter Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 mb-4 gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0458A9] py-6">
              Your Requests
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
          {/* Requests List with Pagination */}
          <RequestsGrid requests={paginatedRequests} onDetails={handleDetails} />
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded border ${page === currentPage ? "bg-[#0458A9] text-white" : "bg-white text-gray-700"}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
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
    </div>
  );
}
