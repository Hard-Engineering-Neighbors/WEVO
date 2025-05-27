import React from "react";
import { X } from "lucide-react";

export default function AdminNotificationDetailsModal({
  notif,
  booking,
  onClose,
}) {
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
  if (booking) {
    venue = booking.venue?.name || booking.venue || "";
    orgName = booking.organization_name || booking.organization || "";
    eventName = booking.eventName || booking.event || booking.event_name || "";
    date = booking.date || "";
    participants = booking.participants || "";
    type = booking.type || "";
    purpose = booking.purpose || "";
    cancellationReason =
      booking.cancellation_reason || booking.cancellationReason || "";
    rejectionReason = booking.rejection_reason || booking.rejectionReason || "";
  }
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-8 flex flex-col gap-2">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close notification popup"
        >
          <X size={24} />
        </button>
        <div className="text-2xl font-bold text-[#56708A] mb-1 text-left">
          Notification Details
        </div>
        <div className="flex flex-wrap gap-4 mb-2 justify-start">
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
            <span className="font-semibold">Date:</span>{" "}
            {new Date(notif.created_at).toLocaleString()}
          </div>
          {orgName && (
            <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
              <span className="font-semibold">Organization:</span> {orgName}
            </div>
          )}
        </div>
        {!eventName &&
          !participants &&
          !type &&
          !purpose &&
          !cancellationReason &&
          !rejectionReason && (
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
      </div>
    </div>
  );
}
