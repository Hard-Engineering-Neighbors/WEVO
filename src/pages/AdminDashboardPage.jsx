import React, { useState, useEffect } from "react";
import AdminLeftSidebar from "../components/Sidebar/AdminLeftSidebar";
import AdminRightSidebar from "../components/Sidebar/AdminRightSidebar";
import Calendar from "../components/Calendar/Calendar"; // Assuming a generic calendar can be used or adapted
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminReservationReviewModal from "../components/AdminReservationReviewModal";
import {
  fetchAdminRequests,
  updateBookingRequestStatus,
  fetchStatistics,
} from "../api/requests";
import { supabase } from "../supabase/supabaseClient";

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Lock navigation to admin dashboard if authenticated
  useEffect(() => {
    window.history.pushState(
      { page: "admin-dashboard" },
      "",
      "/admin/dashboard"
    );
    const blockNav = () => {
      if (window.location.pathname !== "/admin/dashboard") {
        navigate("/admin/dashboard", { replace: true });
      }
      window.history.pushState(
        { page: "admin-dashboard" },
        "",
        "/admin/dashboard"
      );
    };
    window.addEventListener("popstate", blockNav);
    return () => window.removeEventListener("popstate", blockNav);
  }, [navigate]);

  // Load dashboard requests & stats
  useEffect(() => {
    const loadData = async () => {
      try {
        const [reqs, statistics] = await Promise.all([
          fetchAdminRequests(),
          fetchStatistics(),
        ]);
        setRequests(reqs);
        setStats(statistics);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };
    loadData();
  }, []);

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
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "Approved" } : r))
      );
      // Send confirmation notification to the admin
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await supabase.from("notifications").insert([
        {
          user_id: user.id,
          type: "admin",
          message: `You have approved a booking request (ID: ${requestId}).`,
          related_request_id: requestId,
          status: "unread",
          role: "admin",
        },
      ]);
    } catch (err) {
      console.error("Error approving on dashboard:", err);
    }
  };

  const handleRejectRequest = async (requestId, reason) => {
    try {
      await updateBookingRequestStatus(requestId, "Rejected", reason);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, status: "Rejected", rejectionReason: reason }
            : r
        )
      );
      // Send confirmation notification to the admin
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await supabase.from("notifications").insert([
        {
          user_id: user.id,
          type: "admin",
          message: `You have rejected a booking request (ID: ${requestId}). Reason: ${reason}`,
          related_request_id: requestId,
          status: "unread",
          role: "admin",
        },
      ]);
    } catch (err) {
      console.error("Error rejecting on dashboard:", err);
    }
  };

  // Calculate paginated requests
  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
  const currentRequests = requests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );
  const totalPages = Math.ceil(requests.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <div className="flex flex-col lg:flex-row flex-1">
        <AdminLeftSidebar active="Dashboard" />

        {/* Center Content */}
        <main className="w-full lg:w-3/5 bg-gray-50 p-3 md:p-6 space-y-4 order-2 lg:order-none">
          {/* Main content grid: Requests on left, Stats/Calendar on right */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Requests Table Section (occupies 2/3 on md screens) */}
            <div className="md:col-span-2 bg-white rounded-xl shadow p-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#56708A] mb-3 md:mb-0">
                  Requests
                </h2>
              </div>

              {/* Table */}
              <div className="">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3">
                        Organization Name
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Location
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Type
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Event Name
                      </th>
                      <th scope="col" className="px-3 py-3 min-w-[8rem]">
                        Date and Time
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRequests.length > 0 ? (
                      currentRequests.map((req) => (
                        <tr
                          key={req.id}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <td className="px-3 py-3">
                            {truncateText(req.orgName, 25)}
                          </td>
                          <td className="px-3 py-3">
                            {truncateText(req.location, 25)}
                          </td>
                          <td className="px-3 py-3">
                            {truncateText(req.type, 25)}
                          </td>
                          <td className="px-3 py-3">
                            {truncateText(req.eventName, 25)}
                          </td>
                          <td className="px-3 py-3 min-w-[8rem]">
                            <div>{req.date}</div>
                            <div className="text-xs text-gray-500">
                              {req.time}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                req.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : req.status === "Approved"
                                  ? "bg-green-100 text-green-800"
                                  : req.status === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : req.status === "Cancelled"
                                  ? "bg-gray-300 text-gray-700 border border-gray-400"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <button
                              className="bg-[#56708A] text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-[#455b74] transition-colors"
                              onClick={() => handleOpenReviewModal(req)}
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-10 text-gray-500"
                        >
                          No requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-2 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                  Page {totalPages > 0 ? currentPage : 0} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1 || totalPages === 0}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Statistics and Calendar */}
            <div className="space-y-4">
              {/* Statistics Section */}
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="text-xl font-bold text-[#56708A] mb-4">
                  Statistics
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span>Total Requests</span>
                      <span>{stats.totalRequests}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-[#56708A]"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Pending</span>
                      <span>{stats.pending}</span>
                    </div>
                    <div className="h-2 bg-yellow-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{
                          width: `${
                            (stats.pending / stats.totalRequests) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Approved</span>
                      <span>{stats.approved}</span>
                    </div>
                    <div className="h-2 bg-green-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${
                            (stats.approved / stats.totalRequests) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Rejected</span>
                      <span>{stats.rejected}</span>
                    </div>
                    <div className="h-2 bg-red-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-red-500"
                        style={{
                          width: `${
                            (stats.rejected / stats.totalRequests) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Cancelled</span>
                      <span>{stats.cancelled}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-gray-400"
                        style={{
                          width: `${
                            (stats.cancelled / stats.totalRequests) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button className="text-[#56708A] text-sm hover:underline font-medium">
                    Full View
                  </button>
                </div>
              </div>

              {/* Calendar Section */}
              <div className="bg-white rounded-xl shadow p-4">
                {/* Minimal Calendar - details inside Calendar component */}
                <Calendar
                  primaryColor="#56708A"
                  layout="admin"
                  showReserveButton={false}
                />
                {/* Optional: Add a "Full View" for calendar if needed, similar to mockup */}
                <div className="flex justify-end mt-2"></div>
              </div>
            </div>
          </div>
        </main>

        {/* This AdminRightSidebar is for notifications, keeping it separate as in user dashboard */}
        <AdminRightSidebar />
      </div>

      {/* Admin Reservation Review Modal */}
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
