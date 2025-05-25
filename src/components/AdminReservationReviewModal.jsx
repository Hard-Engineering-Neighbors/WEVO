import React, { useState } from "react";
import { X, FileText, DownloadCloud } from "lucide-react";
import RejectionReasonModal from "./RejectionReasonModal";

export default function AdminReservationReviewModal({
  open,
  onClose,
  onApprove,
  onReject,
  requestData = {},
}) {
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);

  if (!open) return null;

  const handleOpenRejectionModal = () => {
    setIsRejectionModalOpen(true);
  };

  const handleCloseRejectionModal = () => {
    setIsRejectionModalOpen(false);
  };

  const handleSubmitRejectionReason = (reason) => {
    onReject(requestData.id, reason);
    handleCloseRejectionModal();
    onClose();
  };

  // Format date from ISO string or existing string to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    // Attempt to parse if it's not already in a simple format like "April 10, 2025"
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if parsing fails (already formatted?)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Extract data with defaults from requestData
  const {
    orgName = "N/A",
    location = "N/A",
    type = "N/A",
    eventName = "N/A",
    date: eventDateRaw = "N/A",
    time: eventTimeRaw = "N/A",
    // Actual contact info from requestData
    contactPerson = "",
    position = "",
    contactNumber = "",
    eventPurpose = "",
    participants = "",
    uploadedDocuments = [],
  } = requestData;

  const perDayTimes =
    requestData.perDayTimes || requestData.per_day_times || [];

  // For display, try to split date and time if they are combined in 'date' field
  let displayDate = eventDateRaw;
  let displayTime = eventTimeRaw;

  if (
    (typeof requestData.date === "string" &&
      requestData.date.includes(" AM")) ||
    requestData.date.includes(" PM")
  ) {
    // If requestData.date contains time, and requestData.time is also present, prioritize requestData.time
    // If requestData.time is NOT present, then parse from requestData.date
    if (eventTimeRaw === "N/A" || eventTimeRaw === "") {
      const parts = requestData.date.split(" "); // Simplistic split
      if (parts.length > 2) {
        displayDate = parts.slice(0, parts.length - 2).join(" ");
        displayTime = parts.slice(parts.length - 2).join(" ");
      } else {
        displayDate = requestData.date;
        displayTime = "N/A";
      }
    } else {
      displayDate = formatDate(requestData.date.split(" ")[0]); // assume date is first part if combined
    }
  } else {
    displayDate = formatDate(eventDateRaw);
  }

  return (
    <>
      {/* Main Review Modal */}
      {open && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl mx-auto flex flex-col gap-5 p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 z-10 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="w-full">
              <h2 className="text-2xl md:text-3xl font-bold text-[#56708A] mb-1">
                Request Details
              </h2>
              <p className="text-gray-600 text-sm">
                Review the reservation details below and choose an action.
              </p>
            </div>

            {/* Requesting Party Information */}
            <div className="w-full">
              <h3 className="text-xl font-semibold text-[#56708A] mb-3">
                Requesting Party Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <label className="block text-gray-500 text-xs font-medium">
                    Name of Organization / Individual
                  </label>
                  <div className="p-2.5 bg-gray-100 rounded-md mt-1 truncate">
                    {orgName}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs font-medium">
                    Contact Person
                  </label>
                  <div className="p-2.5 bg-gray-100 rounded-md mt-1 truncate">
                    {contactPerson}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs font-medium">
                    Position
                  </label>
                  <div className="p-2.5 bg-gray-100 rounded-md mt-1 truncate">
                    {position}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs font-medium">
                    Contact Number
                  </label>
                  <div className="p-2.5 bg-gray-100 rounded-md mt-1 truncate">
                    {contactNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="w-full">
              <h3 className="text-xl font-semibold text-[#56708A] mb-3">
                Event Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <label className="block text-gray-500 text-xs font-medium">
                    Title of the Event
                  </label>
                  <div className="p-2.5 bg-gray-100 rounded-md mt-1 truncate">
                    {eventName}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs font-medium">
                    Type of Activity
                  </label>
                  <div className="p-2.5 bg-gray-100 rounded-md mt-1 truncate">
                    {type}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <label className="block text-gray-500 text-xs font-medium">
                  Purpose of the Event
                </label>
                <div className="p-2.5 bg-gray-100 rounded-md mt-1 leading-relaxed">
                  {eventPurpose}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 mt-3 text-sm">
                <div>
                  <label className="block text-gray-500 text-xs font-medium">
                    Event Date
                  </label>
                  <div className="p-2.5 bg-gray-100 rounded-md mt-1">
                    {displayDate}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs font-medium">
                    Event Time
                  </label>
                  <div className="p-2.5 bg-gray-100 rounded-md mt-1">
                    {displayTime}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs font-medium">
                    Preferred Venue
                  </label>
                  <div className="p-2.5 bg-gray-100 rounded-md mt-1 truncate">
                    {location}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs font-medium">
                    No. of Participants
                  </label>
                  <div className="p-2.5 bg-gray-100 rounded-md mt-1 truncate">
                    {participants
                      ? typeof participants === "number"
                        ? `${participants} Participants`
                        : participants
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Date and Time (per-day times) */}
            <div className="w-full">
              <label className="block text-gray-600 text-sm mb-1">
                Event Date and Time
              </label>
              <div className="flex flex-col gap-2">
                {perDayTimes.length > 0 ? (
                  perDayTimes.map(({ date, startTime, endTime }) => (
                    <div
                      key={date}
                      className="p-2.5 bg-gray-100 rounded-md flex justify-between"
                    >
                      <span>{new Date(date).toLocaleDateString()}</span>
                      <span>
                        {startTime} - {endTime}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-2.5 bg-gray-100 rounded-md flex justify-between">
                    <span>{requestData.date || "-"}</span>
                    <span>{requestData.time || "-"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Event Duration (summary) */}
            <div className="w-full">
              <label className="block text-gray-600 text-sm mb-1">
                Event Duration
              </label>
              <div className="p-2.5 bg-gray-100 rounded-md">
                {perDayTimes.length > 0
                  ? `${new Date(perDayTimes[0].date).toLocaleDateString()} ${
                      perDayTimes[0].startTime
                    } - ${new Date(
                      perDayTimes[perDayTimes.length - 1].date
                    ).toLocaleDateString()} ${
                      perDayTimes[perDayTimes.length - 1].endTime
                    }`
                  : `${requestData.date || "-"} ${requestData.time || "-"}`}
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className="w-full">
              <h3 className="text-xl font-semibold text-[#56708A] mb-3">
                Uploaded Documents
              </h3>
              {uploadedDocuments && uploadedDocuments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                  {uploadedDocuments.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 bg-gray-100 rounded-md hover:bg-gray-200 transition group"
                    >
                      <FileText
                        size={28}
                        className="text-[#56708A] flex-shrink-0"
                      />
                      <span className="text-gray-700 truncate group-hover:underline">
                        {doc.name}
                      </span>
                      <DownloadCloud
                        size={20}
                        className="text-gray-400 ml-auto group-hover:text-[#56708A] transition flex-shrink-0"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No documents uploaded.</p>
              )}
            </div>

            {/* Footer: Action Buttons */}
            {requestData.status === "Pending" && (
              <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="w-full sm:w-auto bg-red-600 text-white rounded-lg px-6 py-2.5 font-medium text-sm hover:bg-red-700 transition"
                  onClick={handleOpenRejectionModal}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto bg-[#56708A] text-white rounded-lg px-6 py-2.5 font-medium text-sm hover:bg-[#455b74] transition"
                  onClick={() => {
                    onApprove(requestData.id);
                    onClose();
                  }}
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejection Reason Modal - always rendered on top */}
      <RejectionReasonModal
        open={isRejectionModalOpen}
        onClose={handleCloseRejectionModal}
        onSubmit={handleSubmitRejectionReason}
      />
    </>
  );
}
