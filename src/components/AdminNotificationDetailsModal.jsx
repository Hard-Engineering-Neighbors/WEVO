import React from "react";
import { X } from "lucide-react";

export default function AdminNotificationDetailsModal({
  notif,
  booking,
  data,
  onClose,
}) {
  if (!notif) return null;
  const details = {
    venue: "",
    orgName: "",
    eventName: "",
    date: "",
    participants: "",
    type: "",
    purpose: "",
    cancellationReason: "",
    rejectionReason: "",
    perDayTimes: [],
    ...((data || {})),
    ...((booking || {})),
  };

  // Ensure all fields are strings or numbers for rendering
  const safe = (val) => {
    if (!val) return "";
    if (typeof val === "object") {
      if (val.name) return val.name;
      return JSON.stringify(val);
    }
    return val;
  };

  // Extract perDayTimes for event date/time display
  let perDayTimes = [];
  if (details.perDayTimes && Array.isArray(details.perDayTimes)) {
    perDayTimes = details.perDayTimes;
  } else if (details.per_day_times && Array.isArray(details.per_day_times)) {
    perDayTimes = details.per_day_times;
  }

  // Compose main message (never include reason)
  let mainMessage = notif.message;
  let showRejectionReason = false;
  let showCancellationReason = false;
  if (details.cancellationReason) {
    // Remove 'Reason:' and everything after from the message
    mainMessage = notif.message.replace(/\s*Reason:[\s\S]*/i, "").trim();
    if (!mainMessage || mainMessage === notif.message) {
      mainMessage = `${details.orgName || "An organization"} cancelled their approved event${details.eventName ? `: ${safe(details.eventName)}` : ""}${details.date ? ` on ${safe(details.date)}` : ""}${details.venue ? ` at ${safe(details.venue)}` : ""}.`;
    }
    showCancellationReason = true;
  } else if (
    details.rejectionReason &&
    (notif.type === "Admin" || notif.type === "System") &&
    details.venue &&
    details.orgName
  ) {
    mainMessage = `You have rejected ${details.orgName} request for ${safe(details.venue)}${details.eventName ? ` for ${safe(details.eventName)}` : ""}${details.date ? ` on ${safe(details.date)}` : ""}.`;
    showRejectionReason = true;
  } else if (
    notif.type === "Admin" &&
    details.venue &&
    details.orgName &&
    details.eventName &&
    (perDayTimes.length > 0 || details.date)
  ) {
    mainMessage = `You have approved ${details.orgName} request for ${safe(details.venue)} for ${safe(details.eventName)}${perDayTimes.length > 0 ? " on " + perDayTimes.map((d) => new Date(d.date).toLocaleDateString()).join(", ") : details.date ? ` on ${safe(details.date)}` : ""}.`;
  } else if (
    notif.type === "System" &&
    details.venue &&
    details.orgName
  ) {
    mainMessage = `New booking request from ${details.orgName} for ${safe(details.venue)}${perDayTimes.length > 0 ? " on " + perDayTimes.map((d) => new Date(d.date).toLocaleDateString()).join(", ") : details.date ? ` on ${safe(details.date)}` : ""}.`;
  } else if (
    notif.type === "Admin" &&
    details.orgName &&
    details.eventName
  ) {
    mainMessage = `You have approved ${details.orgName}'s event: ${safe(details.eventName)}${perDayTimes.length > 0 ? " on " + perDayTimes.map((d) => new Date(d.date).toLocaleDateString()).join(", ") : details.date ? ` on ${safe(details.date)}` : ""}.`;
  }

  // Always show event details
  const eventDetails = (
    <div className="flex flex-wrap gap-4 mb-2 justify-start">
      {perDayTimes.length > 0 ? (
        perDayTimes.map((d, i) => (
          <div key={i} className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
            <span className="font-semibold">Event Date and Time:</span> {new Date(d.date).toLocaleDateString()} {d.startTime} - {d.endTime}
          </div>
        ))
      ) : details.start_time && details.end_time ? (
        <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
          <span className="font-semibold">Event Date and Time:</span> {new Date(details.start_time).toLocaleDateString()} {new Date(details.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(details.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      ) : details.date ? (
        <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
          <span className="font-semibold">Event Date and Time:</span> {safe(details.date)}
        </div>
      ) : null}
      {details.orgName && (
        <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
          <span className="font-semibold">Organization:</span> {details.orgName}
        </div>
      )}
      {details.venue && (
        <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
          <span className="font-semibold">Venue:</span> {safe(details.venue)}
        </div>
      )}
    </div>
  );

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
        <div className="text-gray-700 text-base mb-2">{mainMessage}</div>
        {eventDetails}
        {details.eventName && (
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
            <span className="font-semibold">Event Name:</span> {safe(details.eventName)}
          </div>
        )}
        {details.participants && (
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
            <span className="font-semibold">Participants:</span> {safe(details.participants)}
          </div>
        )}
        {details.type && (
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
            <span className="font-semibold">Event Type:</span> {safe(details.type)}
          </div>
        )}
        {details.purpose && (
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
            <span className="font-semibold">Event Purpose:</span> {safe(details.purpose)}
          </div>
        )}
        {showRejectionReason && details.rejectionReason && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-6 py-3 mt-4">
            <div className="font-semibold mb-1">Rejection Reason</div>
            <div>{safe(details.rejectionReason)}</div>
          </div>
        )}
        {showCancellationReason && details.cancellationReason && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-6 py-3 mt-4">
            <div className="font-semibold mb-1">Cancellation Reason</div>
            <div>{safe(details.cancellationReason)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
