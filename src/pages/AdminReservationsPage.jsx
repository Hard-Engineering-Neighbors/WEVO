import React, { useState, useEffect, useMemo } from "react";
import AdminLeftSidebar from "../components/Sidebar/AdminLeftSidebar";
import AdminRightSidebar from "../components/Sidebar/AdminRightSidebar";
import AdminReservationReviewModal from "../components/AdminReservationReviewModal";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  fetchAdminRequests,
  updateBookingRequestStatus,
} from "../api/requests";
import { supabase } from "../supabase/supabaseClient";
import { useSidebar } from "../contexts/SidebarContext";

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
  const { isRightSidebarCollapsed } = useSidebar();
  const [reservations, setReservations] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  // Track expanded rows for date/time
  const [expandedRows, setExpandedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(13);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("date-desc");
  const [locationFilter, setLocationFilter] = useState("all");
  const [organizationFilter, setOrganizationFilter] = useState("all");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

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

  const processedReservations = useMemo(() => {
    let data = [...reservations];

    if (statusFilter !== "all") {
      data = data.filter(
        (res) => res.status && res.status.toLowerCase() === statusFilter
      );
    }

    if (locationFilter !== "all") {
      data = data.filter(
        (res) => (res.location || "").toLowerCase() === locationFilter
      );
    }

    if (organizationFilter !== "all") {
      data = data.filter(
        (res) => (res.orgName || "").toLowerCase() === organizationFilter
      );
    }

    if (startDateFilter || endDateFilter) {
      const start = startDateFilter ? new Date(startDateFilter) : null;
      const end = endDateFilter ? new Date(endDateFilter) : null;
      data = data.filter((res) => {
        const date = new Date(res.startDate || res.date);
        if (Number.isNaN(date.getTime())) return false;
        if (start && date < start) return false;
        if (end) {
          const endDate = new Date(end);
          endDate.setHours(23, 59, 59, 999);
          if (date > endDate) return false;
        }
        return true;
      });
    }

    data.sort((a, b) => {
      const dateA = new Date(a.startDate || a.date);
      const dateB = new Date(b.startDate || b.date);
      return sortOption === "date-asc" ? dateA - dateB : dateB - dateA;
    });

    return data;
  }, [
    reservations,
    statusFilter,
    sortOption,
    locationFilter,
    organizationFilter,
    startDateFilter,
    endDateFilter,
  ]);

  // Calculate paginated reservations
  const indexOfLastReservation = currentPage * itemsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - itemsPerPage;
  const currentReservations = processedReservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );
  const totalPages = Math.ceil(processedReservations.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const tableHeaders = [
    { name: "#" },
    { name: "Organization Name" },
    { name: "Location" },
    { name: "Type" },
    { name: "Event Name" },
    { name: "Date and Time" },
    { name: "Status" },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <div className="flex flex-col lg:flex-row flex-1">
        <AdminLeftSidebar active="Reservations" /> {/* Set active prop */}
        <main className="w-full bg-gray-50 p-3 md:p-6 order-2 lg:order-none pb-20 lg:pb-6 transition-all duration-300 flex-1 min-h-0 flex flex-col">
          {/* Main Content Area for Reservations */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col flex-1 min-h-0">
            <h1 className="text-3xl font-bold text-[#56708A] mb-6">
              Reservations
            </h1>

            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-[#56708A] transition"
                  >
                    <option value="date-desc">Sort: Newest</option>
                    <option value="date-asc">Sort: Oldest</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>

                <div className="relative">
                  <select
                    value={locationFilter}
                    onChange={(e) => {
                      setLocationFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-[#56708A] transition"
                  >
                    <option value="all">All Locations</option>
                    {[...new Set(reservations.map((r) => r.location || ""))]
                      .filter(Boolean)
                      .sort((a, b) => a.localeCompare(b))
                      .map((loc) => (
                        <option key={loc} value={loc.toLowerCase()}>
                          {loc}
                        </option>
                      ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>

                <div className="relative">
                  <select
                    value={organizationFilter}
                    onChange={(e) => {
                      setOrganizationFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-[#56708A] transition"
                  >
                    <option value="all">All Organizations</option>
                    {[...new Set(reservations.map((r) => r.orgName || ""))]
                      .filter(Boolean)
                      .sort((a, b) => a.localeCompare(b))
                      .map((org) => (
                        <option key={org} value={org.toLowerCase()}>
                          {org}
                        </option>
                      ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>

                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <label className="text-gray-500">From</label>
                    <input
                      type="date"
                      value={startDateFilter}
                      onChange={(e) => {
                        setStartDateFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#56708A]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-gray-500">To</label>
                    <input
                      type="date"
                      value={endDateFilter}
                      onChange={(e) => {
                        setEndDateFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#56708A]"
                    />
                  </div>
                  {(startDateFilter || endDateFilter) && (
                    <button
                      onClick={() => {
                        setStartDateFilter("");
                        setEndDateFilter("");
                        setCurrentPage(1);
                      }}
                      className="ml-2 text-xs text-[#56708A] hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-[#56708A] transition"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Reservations Table */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full overflow-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      {tableHeaders.map((header) => (
                        <th key={header.name} scope="col" className="px-4 py-3">
                          {header.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentReservations.map((res, idx) => {
                      const isPending = res.status === "Pending";
                      return (
                        <tr
                          key={res.id}
                          className={`bg-white border-b hover:bg-gray-50 ${
                            isPending ? "cursor-pointer" : ""
                          }`}
                          onClick={
                            isPending
                              ? () => handleOpenReviewModal(res)
                              : undefined
                          }
                        >
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {indexOfFirstReservation + idx + 1}
                          </td>
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
                        </tr>
                      );
                    })}
                    {currentReservations.length === 0 && (
                      <tr>
                        <td
                          colSpan={tableHeaders.length}
                          className="text-center py-10 text-gray-500"
                        >
                          No reservations found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
