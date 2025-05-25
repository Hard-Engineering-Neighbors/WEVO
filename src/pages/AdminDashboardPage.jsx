import React, { useState, useEffect } from "react";
import AdminLeftSidebar from "../components/Sidebar/AdminLeftSidebar";
import AdminRightSidebar from "../components/Sidebar/AdminRightSidebar";
import Calendar from "../components/Calendar/Calendar"; // Assuming a generic calendar can be used or adapted
import { Search, ListFilter, Filter, User, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminReservationReviewModal from "../components/AdminReservationReviewModal";
import {
  fetchAdminRequests,
  updateBookingRequestStatus,
  fetchStatistics,
} from "../api/requests";

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

  const handleApproveRequest = (requestId) => {
    updateBookingRequestStatus(requestId, "Approved")
      .then(() =>
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId ? { ...r, status: "Approved" } : r
          )
        )
      )
      .catch((err) => console.error("Error approving on dashboard:", err));
  };

  const handleRejectRequest = (requestId, reason) => {
    updateBookingRequestStatus(requestId, "Rejected", reason)
      .then(() =>
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId
              ? { ...r, status: "Rejected", rejectionReason: reason }
              : r
          )
        )
      )
      .catch((err) => console.error("Error rejecting on dashboard:", err));
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <div className="flex flex-col lg:flex-row flex-1">
        <AdminLeftSidebar active="Dashboard" />

        {/* Center Content */}
        <main className="w-full lg:w-3/5 bg-gray-50 p-3 md:p-6 space-y-4 order-2 lg:order-none">
          {/* Main Search Bar - Styled like User's SearchBar.jsx */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-full sm:max-w-2xl md:max-w-3xl border border-gray-300 rounded-full">
              <Search
                size={25} // Matched User SearchBar
                className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-[#56708A]" // Admin color
              />
              <input
                type="text"
                placeholder="Search for event venues, locations, keywords, etc."
                className="w-full pl-12 pr-12 py-4 border-transparent rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-[#56708A] focus:border-[#56708A] text-xs md:text-base"
              />
              <Bookmark
                size={25} // Matched User SearchBar
                className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-[#56708A] hover:text-[#56708A]/80 cursor-pointer" // Admin color
              />
            </div>
          </div>

          {/* Main content grid: Requests on left, Stats/Calendar on right */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Requests Table Section (occupies 2/3 on md screens) */}
            <div className="md:col-span-2 bg-white rounded-xl shadow p-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#56708A] mb-3 md:mb-0">
                  Requests
                </h2>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-grow md:flex-grow-0">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Find a request by name or date"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#56708A] focus:border-[#56708A]"
                    />
                  </div>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                    <ListFilter size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                    <Filter size={20} className="text-gray-600" />
                  </button>
                </div>
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
                    {requests.map((req) => (
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
                                : "bg-red-100 text-red-800"
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
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <button className="text-[#56708A] text-sm hover:underline font-medium">
                  Full View
                </button>
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
                    <div className="h-2 bg-orange-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-orange-500"
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
                <Calendar primaryColor="#56708A" />
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
