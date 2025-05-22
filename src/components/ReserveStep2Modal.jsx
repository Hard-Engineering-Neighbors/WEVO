import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import ReserveStep3Modal from "./ReserveStep3Modal";

export default function ReserveStep2Modal({
  open,
  onClose,
  onPrevious,
  onNext,
  venues = [],
  initialVenue = "",
  reservationData = {},
  onReservationSubmitted, // <-- add this prop
}) {
  // Initialize form state with all needed fields
  const [form, setForm] = useState({
    title: "",
    type: "",
    purpose: "",
    startTime: "07:00",
    endTime: "08:00",
    venue: initialVenue || (venues[0] ? venues[0].name : ""),
    participants: "",
    contactPerson: "",
    contactPosition: "",
    contactNumber: "",
    orgName: "", // Add organization name field
  });
  const [venueDropdown, setVenueDropdown] = useState(false);
  const [step3Open, setStep3Open] = useState(false);
  const [step2Data, setStep2Data] = useState(null);

  if (!open && !step3Open) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVenueSelect = (venue) => {
    setForm((prev) => ({ ...prev, venue }));
    setVenueDropdown(false);
  };

  // Helper to generate time options in 15-min increments from 7:00 to 19:00
  const generateTimeOptions = () => {
    const options = [];
    for (let h = 7; h <= 19; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 19 && m > 0) break;
        const hour = h.toString().padStart(2, "0");
        const min = m.toString().padStart(2, "0");
        options.push(`${hour}:${min}`);
      }
    }
    return options;
  };
  const timeOptions = generateTimeOptions();

  // Format time for display (24-hour to 12-hour with AM/PM)
  const formatTimeForDisplay = (time24) => {
    if (!time24) return "";
    const [hour, minute] = time24.split(":");
    const hourNum = parseInt(hour);
    const suffix = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${hour12}:${minute} ${suffix}`;
  };
  // Prepare combined data for Step 3
  const prepareStep3Data = () => {
    const venueObj = venues.find((v) => v.name === form.venue) || {
      name: form.venue,
    };

    return {
      ...reservationData,
      eventTitle: form.title,
      eventType: form.type,
      eventPurpose: form.purpose,
      startTime: formatTimeForDisplay(form.startTime),
      endTime: formatTimeForDisplay(form.endTime),
      venue: venueObj,
      participants: parseInt(form.participants),
      contactPerson: form.contactPerson || "",
      contactPosition: form.contactPosition || "",
      contactNumber: form.contactNumber || "",
      orgName: form.orgName || "",
    };
  };

  return (
    <>
      {/* Step 2 Modal */}
      {open && !step3Open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-2 my-8 flex flex-col gap-6 p-4 md:p-10 overflow-y-auto max-h-[95vh]">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={onClose}
            >
              <X size={28} />
            </button>
            {/* Step 2 label */}
            <div className="flex justify-end w-full">
              <span className="text-[#0458A9] font-semibold text-lg md:text-xl">
                Step 2
              </span>
            </div>
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#0458A9] mb-2">
              Event Details
            </h2>
            {/* Form */}
            <form className="flex flex-col gap-8 w-full">
              {/* Row 1: Title & Type */}
              <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="flex-1">
                  <label className="font-semibold text-gray-800 mb-1 block">
                    <span className="text-[#E53935]">*</span> Title of the Event
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Artikulo: Voices in Motion"
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="font-semibold text-gray-800 mb-1 block">
                    <span className="text-[#E53935]">*</span> Type of Activity
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="e.g., Workshop"
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                    required
                  />
                </div>
              </div>
              
              {/* Row 1.5: Organization Name */}
              <div className="w-full">
                <label className="font-semibold text-gray-800 mb-1 block">
                  <span className="text-[#E53935]">*</span> Organization Name
                </label>
                <input
                  type="text"
                  name="orgName"
                  value={form.orgName}
                  onChange={handleChange}
                  placeholder="e.g., CIPHER, WVSU Spark Hub"
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                  required
                />
              </div>

              {/* Row 2: Purpose */}
              <div>
                <label className="font-semibold text-gray-800 mb-1 block">
                  <span className="text-[#E53935]">*</span> Purpose of the Event
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  placeholder="e.g., Team-building and skill development"
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                  required
                />
              </div>
              
              {/* Row 3: Contact Information */}
              <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="flex-1">
                  <label className="font-semibold text-gray-800 mb-1 block">
                    <span className="text-[#E53935]">*</span> Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={form.contactPerson || ""}
                    onChange={handleChange}
                    placeholder="e.g., Juan Dela Cruz"
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="font-semibold text-gray-800 mb-1 block">
                    <span className="text-[#E53935]">*</span> Position
                  </label>
                  <input
                    type="text"
                    name="contactPosition"
                    value={form.contactPosition || ""}
                    onChange={handleChange}
                    placeholder="e.g., President"
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="font-semibold text-gray-800 mb-1 block">
                    <span className="text-[#E53935]">*</span> Contact Number
                  </label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={form.contactNumber || ""}
                    onChange={handleChange}
                    placeholder="e.g., +63 912 345 6789"
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                    required
                  />
                </div>
              </div>

              {/* Row 4: Start Time, End Time */}
              <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="flex-1">
                  <label className="font-semibold text-gray-800 mb-1 block">
                    <span className="text-[#E53935]">*</span> Start Time
                  </label>
                  <select
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                    required
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="font-semibold text-gray-800 mb-1 block">
                    <span className="text-[#E53935]">*</span> End Time
                  </label>
                  <select
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                    required
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Row 4: Venue, Participants */}
              <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="flex-1 relative">
                  <label className="font-semibold text-gray-800 mb-1 block">
                    <span className="text-[#E53935]">*</span> Preferred Venue
                  </label>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base flex items-center justify-between focus:outline-none focus:border-[#0458A9]"
                    onClick={() => setVenueDropdown((v) => !v)}
                  >
                    {form.venue || "Select Venue"}
                    <ChevronDown size={20} />
                  </button>
                  {venueDropdown && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                      {venues.map((v) => (
                        <div
                          key={v.name}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                          onClick={() => handleVenueSelect(v.name)}
                        >
                          {v.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>                <div className="flex-1">
                  <label className="font-semibold text-gray-800 mb-1 block">
                    <span className="text-[#E53935]">*</span> No. of
                    Participants
                  </label>
                  <input
                    type="number"
                    name="participants"
                    value={form.participants}
                    onChange={handleChange}
                    placeholder="e.g., 50"
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                    required
                    min={1}
                  />
                </div>
              </div>
            </form>
            {/* Footer: Previous/Next */}
            <div className="flex justify-between items-center mt-6 w-full">
              <button
                className="text-gray-400 font-semibold text-base px-6 py-2 rounded-full cursor-pointer hover:text-[#0458A9] hover:bg-gray-100 transition"
                onClick={onPrevious}
              >
                Previous
              </button>
              <button
                className="bg-[#0458A9] text-white rounded-full px-10 py-2 font-semibold text-base hover:bg-[#03407a] transition"
                onClick={() => {
                  const combinedData = prepareStep3Data();
                  setStep2Data(combinedData);
                  setStep3Open(true);
                }}
                disabled={
                  !form.title ||
                  !form.type ||
                  !form.purpose ||
                  !form.startTime ||
                  !form.endTime ||
                  !form.venue ||
                  !form.participants
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Step 3 Modal */}
      {step3Open && (
        <ReserveStep3Modal
          open={step3Open}
          onClose={() => {
            setStep3Open(false);
            onClose && onClose();
          }}
          onPrevious={() => setStep3Open(false)}
          onSubmit={(files) => {
            setStep3Open(false);
            onNext && onNext({ ...step2Data, files });
            if (onReservationSubmitted) onReservationSubmitted(); // <-- refresh requests
          }}
          reservationData={step2Data}
        />
      )}
    </>
  );
}
