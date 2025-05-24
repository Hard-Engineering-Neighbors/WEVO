import React from "react";

export default function NotificationDetailsModal({ notif, onClose }) {
  if (!notif) return null;
  let venue = "";
  let orgName = "";
  let eventName = "";
  let date = "";
  let participants = "";
  let type = "";
  let purpose = "";
  let cancellationReason = "";
  let rejectionReason = "";
  if (notif.data) {
    try {
      const data = typeof notif.data === "string" ? JSON.parse(notif.data) : notif.data;
      venue = data.venue?.name || data.venue || "";
      orgName = data.orgName || "";
      eventName = data.eventName || data.event || "";
      date = data.date || "";
      participants = data.participants || "";
      type = data.type || "";
      purpose = data.purpose || "";
      cancellationReason = data.cancellationReason || "";
      rejectionReason = data.rejectionReason || "";
    } catch (e) {}
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-8 flex flex-col gap-2">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {venue && (
          <div className="text-2xl font-bold text-[#0458A9] mb-1">{venue}</div>
        )}
        <div className="flex flex-wrap gap-4 mb-2">
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
            <span className="font-semibold">Date:</span> {new Date(notif.created_at).toLocaleString()}
          </div>
          {orgName && (
            <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
              <span className="font-semibold">Organization:</span> {orgName}
            </div>
          )}
        </div>
        {(!eventName && !participants && !type && !purpose && !cancellationReason && !rejectionReason) && (
          <div className="text-gray-700 text-base mb-2">{notif.message}</div>
        )}
        {eventName && (
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
            <span className="font-semibold">Event Name:</span> {eventName}
          </div>
        )}
        {date && (
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
            <span className="font-semibold">Event Date and Time:</span> {date}
          </div>
        )}
        {participants && (
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
            <span className="font-semibold">Participants:</span> {participants}
          </div>
        )}
        {type && (
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
            <span className="font-semibold">Event Type:</span> {type}
          </div>
        )}
        {purpose && (
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
            <span className="font-semibold">Event Purpose:</span> {purpose}
          </div>
        )}
        {rejectionReason && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-6 py-3 mt-4">
            <div className="font-semibold mb-1">Rejection Reason:</div>
            <div>{rejectionReason}</div>
          </div>
        )}
        {cancellationReason && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-6 py-3 mt-4">
            <div className="font-semibold mb-1">Cancellation Reason:</div>
            <div>{cancellationReason}</div>
          </div>
        )}
        {!venue && !eventName && !date && !participants && !type && !purpose && !cancellationReason && !rejectionReason && (
          <div className="text-gray-700 text-base mb-2">{notif.message}</div>
        )}
      </div>
    </div>
  );
} 