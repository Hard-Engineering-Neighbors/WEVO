import React, { useState, useEffect } from "react";
import AdminLeftSidebar from "../components/Sidebar/AdminLeftSidebar";
import AdminRightSidebar from "../components/Sidebar/AdminRightSidebar";
import AdminReservationReviewModal from "../components/AdminReservationReviewModal";
import {
  Search,
  ListFilter,
  Filter,
  User,
  Bookmark,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy data - can be expanded or fetched from an API
// Ensure this data includes a mix of pending, approved (ongoing), and potentially completed reservations
const allReservations = [
  {
    id: 1,
    orgName: "Organization Name",
    location: "Med Gym",
    type: "Seminar",
    eventName: "Himig at Hiwaga 2025",
    date: "April 10, 2025",
    time: "7:30 AM - 5:30 PM",
    status: "Approved", // Could be 'Ongoing' if current, or 'Upcoming'
    contactPerson: "Maria Dela Cruz",
    position: "Event Coordinator",
    contactNumber: "+63 917 123 4567",
    eventPurpose: "Annual university-wide cultural night and talent showcase.",
    participants: "250 Participants",
    uploadedDocuments: [{ name: "Event_Proposal.pdf", url: "#" }],
  },
  {
    id: 2,
    orgName: "College of CS",
    location: "CIT Audi",
    type: "Workshop",
    eventName: "Tech Summit 2025",
    date: "May 5, 2025",
    time: "1:00 PM - 5:00 PM",
    status: "Pending",
    contactPerson: "John Doe",
    position: "Lead Organizer",
    contactNumber: "+63 918 111 2222",
    eventPurpose: "A workshop on emerging technologies.",
    participants: "75 Participants",
    uploadedDocuments: [{ name: "Workshop_Outline.pdf", url: "#" }],
  },
  {
    id: 3,
    orgName: "University Student Council",
    location: "Cultural Center",
    type: "General Assembly",
    eventName: "USC General Assembly",
    date: "May 20, 2025",
    time: "8:00 AM - 12:00 PM",
    status: "Approved",
    contactPerson: "Jane Smith",
    position: "USC Chairperson",
    contactNumber: "+63 919 333 4444",
    eventPurpose: "Quarterly general assembly for all students.",
    participants: "500 Participants",
    uploadedDocuments: [],
  },
  {
    id: 4,
    orgName: "Engineering Dept.",
    location: "Engineering Hall",
    type: "Exhibit",
    eventName: "InnovateX 2025",
    date: "June 10-12, 2025",
    time: "9:00 AM - 5:00 PM daily",
    status: "Pending",
    contactPerson: "Engr. Alex Tan",
    position: "Department Head",
    contactNumber: "+63 920 555 6666",
    eventPurpose: "Showcase of engineering student projects.",
    participants: "Open to Public",
    uploadedDocuments: [
      { name: "Exhibit_Layout.pdf", url: "#" },
      { name: "Safety_Plan.pdf", url: "#" },
    ],
  },
];

export default function AdminReservationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Ongoing"); // "Ongoing" or "Pending"
  const [reservations, setReservations] = useState(allReservations);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    // Potentially lock navigation similar to AdminDashboardPage if needed
    // window.history.pushState({ page: "admin-reservations" }, "", "/admin/reservations");
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
    console.log("Approving request from Reservations Page:", requestId);
    setReservations(
      reservations.map((res) =>
        res.id === requestId ? { ...res, status: "Approved" } : res
      )
    );
    // Modal will close itself
  };

  const handleRejectRequest = (requestId, reason) => {
    console.log(
      "Rejecting request from Reservations Page:",
      requestId,
      "Reason:",
      reason
    );
    setReservations(
      reservations.map((res) =>
        res.id === requestId
          ? { ...res, status: "Rejected", rejectionReason: reason }
          : res
      )
    );
    // Modal will close itself
  };

  const filteredReservations = reservations.filter((res) => {
    if (activeTab === "Ongoing") {
      // Define what 'Ongoing' means, e.g., Approved and not past (or some other logic)
      // For now, let's assume 'Approved' status means ongoing/upcoming for simplicity
      return res.status === "Approved";
    }
    if (activeTab === "Pending") {
      return res.status === "Pending";
    }
    return true; // Should not happen with current tabs
  });

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
        <main className="w-full lg:w-3/5 bg-gray-50 p-3 md:p-6 space-y-6 order-2 lg:order-none">
          {/* Top Search Bar (copied from AdminDashboardPage) */}
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
                  {filteredReservations.map((res) => (
                    <tr
                      key={res.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User size={16} className="text-gray-500" />
                        </span>
                        {res.orgName}
                      </td>
                      <td className="px-4 py-3">{res.location}</td>
                      <td className="px-4 py-3">{res.type}</td>
                      <td className="px-4 py-3">{res.eventName}</td>
                      <td className="px-4 py-3">
                        <div>{res.date}</div>
                        <div className="text-xs text-gray-500">{res.time}</div>
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
                  {filteredReservations.length === 0 && (
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
          </div>
        </main>
        <AdminRightSidebar />
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
