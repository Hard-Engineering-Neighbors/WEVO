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
import { fetchRequests } from "../api/requests";

import venueSample from "../assets/cultural_center.webp";

function RequestCard({ request, onDetails }) {
  return (
    <div className="flex bg-white rounded-xl shadow border border-[#C0C0C0] overflow-hidden max-w-2xl w-full">
      <img
        src={request.image}
        alt={request.venue}
        className="w-40 h-40 object-cover rounded-l-xl"
      />
      <div className="flex flex-col flex-1 p-4 gap-1">
        <h3 className="font-bold text-base md:text-lg mb-1">{request.venue}</h3>
        <div className="flex items-center text-xs text-gray-700 gap-2 mb-1">
          <Calendar size={14} /> {request.event}
          <FileText size={14} className="ml-2" /> {request.type}
        </div>
        <div className="flex items-center text-xs text-gray-500 gap-2 mb-2">
          <Clock size={14} /> {request.date}
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

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // TODO: Replace with real API call
    fetchRequests().then(setRequests);
  }, []);

  const handleDetails = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
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
          {/* Requests List */}
          <div className="flex flex-col gap-4">
            {requests.map((request, idx) => (
              <RequestCard
                key={idx}
                request={request}
                onDetails={handleDetails}
              />
            ))}
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
      />
    </div>
  );
}
