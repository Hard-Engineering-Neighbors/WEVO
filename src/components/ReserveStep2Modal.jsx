import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  // State for multi-day time handling
  const isMultipleDays =
    reservationData?.bookingType === "multiple" &&
    reservationData?.rawSelectedDays?.length > 1;
  const [sameTimeForAllDays, setSameTimeForAllDays] = useState(true);
  const [dailyTimes, setDailyTimes] = useState([]);

  // Initialize dailyTimes and manage main form times based on booking type
  useEffect(() => {
    if (open) {
      // Only run these initializations/resets when the modal is opened or critical data changes
      if (isMultipleDays && reservationData.rawSelectedDays) {
        const initialStartTimeForDaily = sameTimeForAllDays
          ? form.startTime || "07:00"
          : "07:00";
        const initialEndTimeForDaily = sameTimeForAllDays
          ? form.endTime || "08:00"
          : "08:00";

        let newDailyTimes = reservationData.rawSelectedDays.map((day) => ({
          date: day.formattedDate,
          startTime: initialStartTimeForDaily,
          endTime: initialEndTimeForDaily,
        }));

        // If not using sameTimeForAllDays, try to preserve existing dailyTimes if they match the dates
        if (
          !sameTimeForAllDays &&
          dailyTimes.length === reservationData.rawSelectedDays.length
        ) {
          const currentDates = dailyTimes.map((dt) => dt.date).join(",");
          const newDates = reservationData.rawSelectedDays
            .map((day) => day.formattedDate)
            .join(",");
          if (currentDates === newDates) {
            newDailyTimes = dailyTimes; // Keep existing if dates match
          }
        }
        setDailyTimes(newDailyTimes);

        if (sameTimeForAllDays) {
          // If multi-day and sameTimeForAll, ensure main form times are set (once)
          setForm((prev) => ({
            ...prev,
            startTime: prev.startTime || "07:00",
            endTime: prev.endTime || "08:00",
          }));
        }
      } else {
        // Single day booking or no rawSelectedDays
        setDailyTimes([]);
        setSameTimeForAllDays(true); // Should be true for single day
        // For single day, ensure main form times are set (once) or preserved if already changed by user
        setForm((prev) => ({
          ...prev,
          startTime:
            prev.startTime && prev.bookingType === reservationData?.bookingType
              ? prev.startTime
              : "07:00",
          endTime:
            prev.endTime && prev.bookingType === reservationData?.bookingType
              ? prev.endTime
              : "08:00",
          // Persist bookingType from reservationData if it exists
          bookingType: reservationData?.bookingType || prev.bookingType,
        }));
      }
    }
  }, [open, reservationData?.bookingType, reservationData?.rawSelectedDays]); // Removed isMultipleDays, sameTimeForAllDays, form.startTime, form.endTime from main dependencies

  // Effect to handle changes when 'sameTimeForAllDays' toggle changes for multi-day
  useEffect(() => {
    if (open && isMultipleDays) {
      if (sameTimeForAllDays) {
        // When toggling TO sameTimeForAllDays, set main form times from the first dailyTime or defaults
        const firstDailyStartTime = dailyTimes[0]?.startTime || "07:00";
        const firstDailyEndTime = dailyTimes[0]?.endTime || "08:00";
        setForm((prev) => ({
          ...prev,
          startTime: firstDailyStartTime,
          endTime: firstDailyEndTime,
        }));
      } else {
        // When toggling FROM sameTimeForAllDays, re-initialize dailyTimes using current form times
        // or defaults if form times are not sensible for individual setting.
        const currentFormStartTime = form.startTime || "07:00";
        const currentFormEndTime = form.endTime || "08:00";
        if (reservationData.rawSelectedDays) {
          setDailyTimes(
            reservationData.rawSelectedDays.map((day) => ({
              date: day.formattedDate,
              startTime: currentFormStartTime,
              endTime: currentFormEndTime,
            }))
          );
        }
      }
    }
  }, [sameTimeForAllDays, open, isMultipleDays]); // Only depends on sameTimeForAllDays, open, and isMultipleDays

  if (!open && !step3Open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const newForm = { ...prev, [name]: value };
      // If startTime is changed, update endTime accordingly
      if (name === "startTime") {
        const validEndTimes = getEndTimeOptions(value);
        if (validEndTimes.length > 0) {
          // Check if current endTime is still valid
          if (!validEndTimes.includes(newForm.endTime)) {
            newForm.endTime = validEndTimes[0]; // Set to first valid endTime
          }
        } else {
          newForm.endTime = ""; // No valid end times
        }
      }
      return newForm;
    });
  };

  const handleVenueSelect = (venue) => {
    setForm((prev) => ({ ...prev, venue }));
    setVenueDropdown(false);
  };

  const handleDailyTimeChange = (index, field, value) => {
    setDailyTimes((currentDailyTimes) =>
      currentDailyTimes.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          // If startTime is changed for a day, update its endTime accordingly
          if (field === "startTime") {
            const validEndTimes = getEndTimeOptions(value);
            if (validEndTimes.length > 0) {
              if (!validEndTimes.includes(updatedItem.endTime)) {
                updatedItem.endTime = validEndTimes[0];
              }
            } else {
              updatedItem.endTime = "";
            }
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Helper to generate time options in 15-min increments from 7:00 to 19:00
  const generateTimeOptions = () => {
    const options = [];
    for (let h = 7; h <= 19; h++) {
      for (let m = 0; m < 60; m += 30) {
        // Changed increment to 30 minutes
        if (h === 19 && m > 0) break;
        const hour24 = h.toString().padStart(2, "0");
        const min = m.toString().padStart(2, "0");
        const timeValue = `${hour24}:${min}`; // Value will be 24-hour format

        // Format for display (AM/PM)
        let displayHour = h;
        const suffix = displayHour >= 12 ? "PM" : "AM";
        if (displayHour === 0) {
          displayHour = 12; // Midnight
        } else if (displayHour > 12) {
          displayHour -= 12;
        }
        const timeDisplay = `${displayHour
          .toString()
          .padStart(2, "0")}:${min} ${suffix}`;

        options.push({ value: timeValue, display: timeDisplay });
      }
    }
    return options;
  };
  const timeOptionsWithFormat = generateTimeOptions();
  // Keep a simple array of 24-hour values for internal logic if needed, though getEndTimeOptions will use the objects
  const timeOptions = timeOptionsWithFormat.map((opt) => opt.value);

  // Helper to get valid end time options based on selected start time
  const getEndTimeOptions = (selectedStartTime) => {
    if (!selectedStartTime) return timeOptionsWithFormat; // Return all if no start time selected
    const startIndex = timeOptions.indexOf(selectedStartTime);
    if (startIndex === -1 || startIndex >= timeOptions.length - 1) return [];
    return timeOptionsWithFormat.slice(startIndex + 1);
  };

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

    let timeDetails = {};
    if (isMultipleDays && !sameTimeForAllDays) {
      timeDetails = {
        eventTimesPerDay: dailyTimes.map((dt) => ({
          date: (() => {
            // Always store as local YYYY-MM-DD
            const local = new Date(dt.date);
            return (
              local.getFullYear() +
              "-" +
              String(local.getMonth() + 1).padStart(2, "0") +
              "-" +
              String(local.getDate()).padStart(2, "0")
            );
          })(),
          startTime: formatTimeForDisplay(dt.startTime),
          endTime: formatTimeForDisplay(dt.endTime),
        })),
        // Explicitly nullify or omit single startTime/endTime if using daily times
        startTime: null,
        endTime: null,
      };
    } else {
      timeDetails = {
        startTime: formatTimeForDisplay(form.startTime),
        endTime: formatTimeForDisplay(form.endTime),
        eventTimesPerDay: null, // Explicitly nullify or omit if using single time
      };
    }

    return {
      ...reservationData,
      eventTitle: form.title,
      eventType: form.type,
      eventPurpose: form.purpose,
      ...timeDetails, // Spread the determined time details
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
      <AnimatePresence>
        {open && !step3Open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={onClose}
          >
            <motion.div
              className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-2 my-8 flex flex-col gap-6 p-4 md:p-10 overflow-y-auto max-h-[95vh]"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                className="absolute top-3 right-3 z-10 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
                onClick={onClose}
                aria-label="Close modal"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
              {/* Step 2 label */}
              <motion.div
                className="flex justify-end w-full"
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.05 }}
              >
                <span className="text-[#0458A9] font-semibold text-lg md:text-xl">
                  Step 2
                </span>
              </motion.div>
              {/* Title */}
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-[#0458A9] mb-2"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.1 }}
              >
                Event Details
              </motion.h2>
              {/* Form */}
              <motion.form
                className="flex flex-col gap-8 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.15 }}
              >
                {/* Row 1: Title & Type */}
                <motion.div
                  className="flex flex-col md:flex-row gap-6 w-full"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.2 }}
                >
                  <div className="flex-1">
                    <label className="font-semibold text-gray-800 mb-1 block">
                      <span className="text-[#E53935]">*</span> Title of the
                      Event
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
                </motion.div>

                {/* Row 1.5: Organization Name */}
                <motion.div
                  className="w-full"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.25 }}
                >
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
                </motion.div>

                {/* Row 2: Purpose */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.3 }}
                >
                  <label className="font-semibold text-gray-800 mb-1 block">
                    <span className="text-[#E53935]">*</span> Purpose of the
                    Event
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
                </motion.div>

                {/* Row 3: Contact Information */}
                <motion.div
                  className="flex flex-col md:flex-row gap-6 w-full"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.35 }}
                >
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
                </motion.div>

                {/* Conditional Time Inputs based on booking type and toggle */}
                {isMultipleDays && (
                  <motion.div
                    className="my-4 p-4 border border-gray-200 rounded-lg"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.4 }}
                  >
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="sameTimeToggle"
                        checked={sameTimeForAllDays}
                        onChange={(e) => {
                          setSameTimeForAllDays(e.target.checked);
                          // If unchecking, might need to re-initialize dailyTimes or form times if logic demands
                          if (
                            !e.target.checked &&
                            dailyTimes.length === 0 &&
                            reservationData.rawSelectedDays
                          ) {
                            // Initialize dailyTimes if it's empty and we are unchecking
                            setDailyTimes(
                              reservationData.rawSelectedDays.map((day) => ({
                                date: day.formattedDate,
                                startTime: form.startTime || "07:00", // Use current form time or default
                                endTime: form.endTime || "08:00", // Use current form time or default
                              }))
                            );
                          } else if (e.target.checked) {
                            // When checking, ensure main form times are reasonable
                            setForm((prev) => ({
                              ...prev,
                              startTime: "07:00",
                              endTime: "08:00",
                            }));
                          }
                        }}
                        className="h-4 w-4 text-[#0458A9] border-gray-300 rounded focus:ring-[#0458A9] mr-2"
                      />
                      <label
                        htmlFor="sameTimeToggle"
                        className="font-medium text-gray-700"
                      >
                        Use the same start and end time for all selected days
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Main Start Time / End Time (conditionally shown or used for all days) */}
                {(sameTimeForAllDays || !isMultipleDays) && (
                  <motion.div
                    className="flex flex-col md:flex-row gap-6 w-full"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.45 }}
                  >
                    <div className="flex-1">
                      <label className="font-semibold text-gray-800 mb-1 block">
                        <span className="text-[#E53935]">*</span> Start Time{" "}
                        {isMultipleDays && sameTimeForAllDays
                          ? "(for all days)"
                          : ""}
                      </label>
                      <select
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                        required
                      >
                        {timeOptionsWithFormat.slice(0, -1).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.display}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="font-semibold text-gray-800 mb-1 block">
                        <span className="text-[#E53935]">*</span> End Time{" "}
                        {isMultipleDays && sameTimeForAllDays
                          ? "(for all days)"
                          : ""}
                      </label>
                      <select
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                        required
                        disabled={!form.startTime}
                      >
                        {getEndTimeOptions(form.startTime).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.display}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Individual Day Time Inputs (shown if multi-day and sameTimeForAllDays is false) */}
                <AnimatePresence>
                  {isMultipleDays &&
                    !sameTimeForAllDays &&
                    reservationData.rawSelectedDays && (
                      <motion.div
                        className="space-y-6 my-4 p-4 border border-gray-200 rounded-lg"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <h3 className="text-lg font-semibold text-[#0458A9] mb-2">
                          Set Time for Each Day:
                        </h3>
                        {dailyTimes.map((dayTime, index) => (
                          <motion.div
                            key={dayTime.date}
                            className="p-3 bg-gray-50 rounded-md"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.15, delay: index * 0.05 }}
                          >
                            <label className="font-semibold text-gray-700 mb-2 block">
                              Date:{" "}
                              {new Date(
                                dayTime.date + "T00:00:00"
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </label>
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="flex-1">
                                <label className="text-sm text-gray-600 mb-1 block">
                                  Start Time
                                </label>
                                <select
                                  name={`dailyStartTime-${index}`}
                                  value={dayTime.startTime}
                                  onChange={(e) =>
                                    handleDailyTimeChange(
                                      index,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                                >
                                  {timeOptionsWithFormat
                                    .slice(0, -1)
                                    .map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.display}
                                      </option>
                                    ))}
                                </select>
                              </div>
                              <div className="flex-1">
                                <label className="text-sm text-gray-600 mb-1 block">
                                  End Time
                                </label>
                                <select
                                  name={`dailyEndTime-${index}`}
                                  value={dayTime.endTime}
                                  onChange={(e) =>
                                    handleDailyTimeChange(
                                      index,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base focus:outline-none focus:border-[#0458A9]"
                                  disabled={!dayTime.startTime}
                                >
                                  {getEndTimeOptions(dayTime.startTime).map(
                                    (opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.display}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                </AnimatePresence>

                {/* Row 4: Venue, Participants */}
                <motion.div
                  className="flex flex-col md:flex-row gap-6 w-full"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.5 }}
                >
                  <div className="flex-1 relative">
                    <label className="font-semibold text-gray-800 mb-1 block">
                      <span className="text-[#E53935]">*</span> Preferred Venue
                    </label>
                    <motion.button
                      type="button"
                      className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-base flex items-center justify-between focus:outline-none focus:border-[#0458A9]"
                      onClick={() => setVenueDropdown((v) => !v)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {form.venue || "Select Venue"}
                      <ChevronDown size={20} />
                    </motion.button>
                    <AnimatePresence>
                      {venueDropdown && (
                        <motion.div
                          className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.1 }}
                        >
                          {venues.map((v, index) => (
                            <motion.div
                              key={v.name}
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                              onClick={() => handleVenueSelect(v.name)}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.1,
                                delay: index * 0.02,
                              }}
                              whileHover={{ backgroundColor: "#eff6ff" }}
                            >
                              {v.name}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex-1">
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
                </motion.div>
              </motion.form>
              {/* Footer: Previous/Next */}
              <motion.div
                className="flex justify-between items-center mt-6 w-full"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: 0.55 }}
              >
                <motion.button
                  className="text-gray-400 font-semibold text-base px-6 py-2 rounded-full cursor-pointer hover:text-[#0458A9] hover:bg-gray-100 transition"
                  onClick={onPrevious}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Previous
                </motion.button>
                <motion.button
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
                    ((sameTimeForAllDays || !isMultipleDays) &&
                      (!form.startTime || !form.endTime)) ||
                    (isMultipleDays &&
                      !sameTimeForAllDays &&
                      dailyTimes.some((dt) => !dt.startTime || !dt.endTime)) ||
                    !form.venue ||
                    !form.participants
                  }
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Next
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
