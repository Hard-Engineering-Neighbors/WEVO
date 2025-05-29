import React, { useState, useEffect } from "react";
import AdminLeftSidebar from "../components/Sidebar/AdminLeftSidebar";
import AdminRightSidebar from "../components/Sidebar/AdminRightSidebar";
import AdminReservationReviewModal from "../components/AdminReservationReviewModal";
import NotificationDetailsModal from "../components/NotificationDetailsModal";
import {
  Search,
  ListFilter,
  Filter,
  User,
  Bookmark,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  fetchAdminRequests,
  updateBookingRequestStatus,
} from "../api/requests";
import { supabase } from "../supabase/supabaseClient";

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

function useRealtimeRequests(refetch) {
  React.useEffect(() => {
    const channel = supabase
      .channel("admin_requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "booking_requests" },
        () => {
          refetch();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);
}

export default function AdminReservationsPage() {
  const navigate = useNavigate();
  // Show pending requests by default
  const [activeTab, setActiveTab] = useState("Pending");
  const [reservations, setReservations] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  // Track expanded rows for date/time
  const [expandedRows, setExpandedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Or your preferred number

  // 1. Define loadRequests at the top level
  const loadRequests = async () => {
    try {
      const data = await fetchAdminRequests();
      // console.log("Fetched admin requests:", data); // Removed for privacy
      setReservations(data);
    } catch (err) {
      console.error("Error fetching admin requests:", err);
    }
  };

  // 2. Call it once on mount
  useEffect(() => {
    loadRequests();
  }, []);

  // 3. Pass it to the real-time hook
  useRealtimeRequests(loadRequests);

  const handleOpenReviewModal = (request) => {
    setSelectedRequest(request);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedRequest(null);
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await updateBookingRequestStatus(requestId, "Approved");
      setReservations((prev) =>
        prev.map((res) =>
          res.id === requestId ? { ...res, status: "Approved" } : res
        )
      );
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const handleRejectRequest = async (requestId, reason) => {
    try {
      await updateBookingRequestStatus(requestId, "Rejected", reason);
      setReservations((prev) =>
        prev.map((res) =>
          res.id === requestId
            ? { ...res, status: "Rejected", rejectionReason: reason }
            : res
        )
      );
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  const filteredReservations = reservations.filter((res) => {
    if (activeTab === "Ongoing") {
      return res.status && res.status.toLowerCase() === "approved";
    }
    if (activeTab === "Pending") {
      return res.status && res.status.toLowerCase() === "pending";
    }
    return true; // Should not happen if tabs are correctly handled
  });

  // Calculate paginated reservations
  const indexOfLastReservation = currentPage * itemsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - itemsPerPage;
  const currentReservations = filteredReservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Reset to page 1 when activeTab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const tableHeaders = [
    { name: "Organization Name", sortable: true },
    { name: "Location", sortable: true },
    { name: "Type", sortable: true },
    { name: "Event Name", sortable: true },
    { name: "Date and Time", sortable: true },
    { name: "Status", sortable: true },
    { name: "Action", sortable: false },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <div className="flex flex-col lg:flex-row flex-1">
        <AdminLeftSidebar active="Reservations" /> {/* Set active prop */}
        <main className="w-full lg:w-3/5 bg-gray-50 p-3 md:p-6 space-y-4 order-2 lg:order-none pb-20 lg:pb-6">
          {/* Main Search Bar */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-full sm:max-w-2xl md:max-w-3xl border border-gray-300 rounded-full">
              <Search
                size={25}
                className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-[#56708A]"
              />
              <input
                type="text"
                placeholder="Search for event venues, locations, keywords, etc."
                className="w-full pl-12 pr-12 py-4 border-transparent rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-[#56708A] focus:border-[#56708A] text-xs md:text-base"
              />
              <Bookmark
                size={25}
                className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-[#56708A] hover:text-[#56708A]/80 cursor-pointer"
              />
            </div>
          </div>

          {/* Main Content Area for Reservations */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h1 className="text-3xl font-bold text-[#56708A] mb-6">
              Ongoing and Pending Reservations
            </h1>

            {/* Sub-header: Search, Tabs, Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
              <div className="relative w-full md:w-2/5 lg:w-1/3">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Find a reservation by name or date"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#56708A] focus:border-[#56708A]"
                />
              </div>
              <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg w-full md:w-auto justify-center">
                <button
                  onClick={() => setActiveTab("Ongoing")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                    ${
                      activeTab === "Ongoing"
                        ? "bg-[#56708A] text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  Ongoing
                </button>
                <button
                  onClick={() => setActiveTab("Pending")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                    ${
                      activeTab === "Pending"
                        ? "bg-[#56708A] text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  Pending
                </button>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-100">
                  <ListFilter size={20} className="text-gray-600" />
                </button>
                <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-100">
                  <Filter size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Reservations Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    {tableHeaders.map((header) => (
                      <th key={header.name} scope="col" className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {header.name}
                          {header.sortable && (
                            <ChevronDown size={14} className="cursor-pointer" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentReservations.map((res) => (
                    <tr
                      key={res.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        {truncateText(res.orgName, 25)}
                      </td>
                      <td className="px-4 py-3">
                        {truncateText(res.location, 25)}
                      </td>
                      <td className="px-4 py-3">
                        {truncateText(res.type, 25)}
                      </td>
                      <td className="px-4 py-3">
                        {truncateText(res.eventName, 25)}
                      </td>
                      <td className="px-4 py-3">
                        {res.perDayTimes && res.perDayTimes.length > 0 ? (
                          <div className="flex justify-between items-start w-full">
                            <div className="flex flex-col gap-0.5">
                              {(expandedRows[res.id]
                                ? res.perDayTimes
                                : res.perDayTimes.slice(0, 1)
                              ) // Show only the first date by default
                                .map((d, i) => (
                                  <span
                                    key={i}
                                    className="text-xs whitespace-nowrap"
                                  >
                                    {new Date(d.date).toLocaleDateString()}{" "}
                                    {d.startTime} - {d.endTime}
                                  </span>
                                ))}
                            </div>

                            {res.perDayTimes.length > 1 && (
                              <button
                                className="text-xs text-blue-600 hover:text-blue-800 ml-2 flex items-center flex-shrink-0 whitespace-nowrap"
                                onClick={() =>
                                  setExpandedRows((prev) => ({
                                    ...prev,
                                    [res.id]: !prev[res.id],
                                  }))
                                }
                                aria-expanded={!!expandedRows[res.id]}
                              >
                                <span>
                                  {expandedRows[res.id]
                                    ? "Show less"
                                    : `+${res.perDayTimes.length - 1} more`}
                                </span>
                                <ChevronDown
                                  size={14}
                                  className={`ml-1 transform transition-transform duration-150 ${
                                    expandedRows[res.id] ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                            )}
                          </div>
                        ) : (
                          <>
                            <div>{res.date}</div>
                            <div className="text-xs text-gray-500">
                              {res.time}
                            </div>
                          </>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full 
                          ${
                            res.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : res.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : res.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : res.status === "Cancelled"
                              ? "bg-gray-300 text-gray-700 border border-gray-400"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {res.status === "Pending" ? (
                          <button
                            className="bg-[#56708A] text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-[#455b74] transition-colors"
                            onClick={() => handleOpenReviewModal(res)}
                          >
                            Details
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">N/A</span> // Or other actions for non-pending
                        )}
                      </td>
                    </tr>
                  ))}
                  {currentReservations.length === 0 && (
                    <tr>
                      <td
                        colSpan={tableHeaders.length}
                        className="text-center py-10 text-gray-500"
                      >
                        No {activeTab.toLowerCase()} reservations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            {totalPages > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
        <AdminRightSidebar onNotificationClick={setSelectedNotif} />
      </div>

      {selectedRequest && (
        <AdminReservationReviewModal
          open={isReviewModalOpen}
          onClose={handleCloseReviewModal}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
          requestData={selectedRequest}
        />
      )}
    </div>
  );
}
