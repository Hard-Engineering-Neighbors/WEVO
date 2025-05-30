import React, { useState, useEffect } from "react";
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
  partialDayInfo = null, // <-- new prop
}) {
  // Debug log
  console.log(
    "ReserveStep2Modal venues:",
    venues,
    "reservationData:",
    reservationData,
    "initialVenue:",
    initialVenue
  );

  // Initialize form state with all needed fields
  const [form, setForm] = useState({
    title: "",
    type: "",
    purpose: "",
    startTime: "07:00",
    endTime: "08:00",
    venue:
      reservationData?.venue?.name ||
      initialVenue ||
      (venues[0] ? venues[0].name : ""),
    participants: reservationData?.participants || "",
    contactPerson: "",
    contactPosition: "",
    contactNumber: "",
    orgName: "", // Add organization name field
  });
  const [venueDropdown, setVenueDropdown] = useState(false);
  const [step3Open, setStep3Open] = useState(false);
  const [step2Data, setStep2Data] = useState(null);
  const [errors, setErrors] = useState({
    participants: "",
    contactNumber: "",
  });

  // State for multi-day time handling
  const isMultipleDays =
    reservationData?.bookingType === "multiple" &&
    reservationData?.rawSelectedDays?.length > 1;
  const [sameTimeForAllDays, setSameTimeForAllDays] = useState(true);
  const [dailyTimes, setDailyTimes] = useState([]);

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
  const timeOptions = timeOptionsWithFormat.map((opt) => opt.value);

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
      setForm((prev) => ({
        ...prev,
        venue:
          reservationData?.venue?.name ||
          initialVenue ||
          (venues[0] ? venues[0].name : ""),
        participants: reservationData?.participants || prev.participants || "",
      }));
    }
  }, [
    open,
    reservationData?.bookingType,
    reservationData?.rawSelectedDays,
    reservationData?.venue?.name,
    initialVenue,
    venues,
  ]); // Removed isMultipleDays, sameTimeForAllDays, form.startTime, form.endTime from main dependencies

  // Effect to handle changes when 'sameTimeForAllDays' toggle changes for multi-day
  useEffect(() => {
    if (open && isMultipleDays) {
      if (sameTimeForAllDays) {
        // When toggling TO sameTimeForAllDays, set main form times from the first dailyTime or defaults
        const firstDailyStartTime =
          dailyTimes[0]?.startTime || form.startTime || "07:00";
        const firstDailyEndTime =
          dailyTimes[0]?.endTime || form.endTime || "08:00";
        setForm((prev) => ({
          ...prev,
          startTime: firstDailyStartTime,
          endTime: firstDailyEndTime,
        }));
        // Also update all dailyTimes to match
        if (reservationData.rawSelectedDays) {
          setDailyTimes(
            reservationData.rawSelectedDays.map((day) => ({
              date: day.formattedDate,
              startTime: firstDailyStartTime,
              endTime: firstDailyEndTime,
            }))
          );
        }
      } else {
        // When toggling FROM sameTimeForAllDays, re-initialize dailyTimes using current form times
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

  // Helper to get valid start time options based on partialDayInfo
  const getStartTimeOptions = () => {
    if (!isMultipleDays && partialDayInfo) {
      if (partialDayInfo.amBooked) {
        // Only PM available
        return timeOptionsWithFormat
          .slice(0, -1)
          .filter((opt) => opt.value >= "13:00" && opt.value <= "18:30");
      } else if (partialDayInfo.pmBooked) {
        // Only AM available
        return timeOptionsWithFormat
          .slice(0, -1)
          .filter((opt) => opt.value >= "07:00" && opt.value <= "12:00");
      }
    }
    // Whole day available
    return timeOptionsWithFormat.slice(0, -1);
  };

  // Helper to get valid end time options based on selected start time and partialDayInfo
  const getFilteredEndTimeOptions = (selectedStartTime) => {
    if (!isMultipleDays && partialDayInfo) {
      if (partialDayInfo.amBooked) {
        // Only PM available
        return timeOptionsWithFormat.filter(
          (opt) =>
            opt.value > selectedStartTime &&
            opt.value >= "13:30" &&
            opt.value <= "19:00"
        );
      } else if (partialDayInfo.pmBooked) {
        // Only AM available
        return timeOptionsWithFormat.filter(
          (opt) =>
            opt.value > selectedStartTime &&
            opt.value >= "07:30" &&
            opt.value <= "12:30"
        );
      }
    }
    // Whole day available
    return timeOptionsWithFormat.filter((opt) => opt.value > selectedStartTime);
  };

  // Ensure startTime and endTime are always valid when available window changes
  useEffect(() => {
    if (!isMultipleDays) {
      const validStartOptions = getStartTimeOptions();
      if (!validStartOptions.some((opt) => opt.value === form.startTime)) {
        // If current startTime is not valid, set to first valid
        setForm((prev) => ({
          ...prev,
          startTime: validStartOptions[0]?.value || "",
        }));
      }
    }
  }, [partialDayInfo, isMultipleDays]);

  useEffect(() => {
    if (!isMultipleDays) {
      const validEndOptions = getFilteredEndTimeOptions(form.startTime);
      if (!validEndOptions.some((opt) => opt.value === form.endTime)) {
        // If current endTime is not valid, set to first valid
        setForm((prev) => ({
          ...prev,
          endTime: validEndOptions[0]?.value || "",
        }));
      }
    }
  }, [form.startTime, partialDayInfo, isMultipleDays]);

  if (!open && !step3Open) return null;

  const validateParticipants = (value) => {
    if (!value) return "Number of participants is required";
    if (!/^\d+$/.test(value)) return "Please enter a valid number";
    if (parseInt(value) <= 0)
      return "Number of participants must be greater than 0";
    return "";
  };

  const validateContactNumber = (value) => {
    if (!value) return "Contact number is required";
    // Allow numbers, spaces, +, -, and () for phone numbers
    if (!/^[\d\s+\-()]+$/.test(value))
      return "Please enter a valid phone number";
    // Remove all non-digit characters and check length
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length < 10)
      return "Phone number must have at least 10 digits";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for participants and contact number
    if (name === "participants") {
      // Only allow digits
      if (value && !/^\d*$/.test(value)) return;
      const error = validateParticipants(value);
      setErrors((prev) => ({ ...prev, participants: error }));
    } else if (name === "contactNumber") {
      // Allow numbers, spaces, +, -, and ()
      if (value && !/^[\d\s+\-()]*$/.test(value)) return;
      const error = validateContactNumber(value);
      setErrors((prev) => ({ ...prev, contactNumber: error }));
    }

    setForm((prev) => {
      const newForm = { ...prev, [name]: value };
      // If startTime is changed, update endTime accordingly
      if (name === "startTime") {
        const validEndTimes = getEndTimeOptions(value);
        if (validEndTimes.length > 0) {
          if (!validEndTimes.includes(newForm.endTime)) {
            newForm.endTime = validEndTimes[0];
          }
        } else {
          newForm.endTime = "";
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

  // Helper to get valid end time options based on selected start time
  const getEndTimeOptions = (selectedStartTime) => {
    if (!selectedStartTime) return timeOptionsWithFormat; // Return all if no start time selected
    const startIndex = timeOptions.indexOf(selectedStartTime);
    if (startIndex === -1 || startIndex >= timeOptions.length - 1) return [];
    return timeOptionsWithFormat.slice(startIndex + 1);
  };

  // Format time for display (24-hour to 12-hour with AM/PM)
  const formatTimeForDisplay = (time24) => {
    if (!time24 || typeof time24 !== "string") return "";
    try {
      const [hour, minute] = time24.split(":");
      if (!hour || !minute) return "";
      const hourNum = parseInt(hour);
      if (isNaN(hourNum)) return "";
      const suffix = hourNum >= 12 ? "PM" : "AM";
      const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
      return `${hour12}:${minute} ${suffix}`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };
  // Prepare combined data for Step 3
  const prepareStep3Data = () => {
    const venueObj = venues.find((v) => v.name === form.venue) || {
      name: form.venue,
    };

    let timeDetails = {};
    if (isMultipleDays) {
      // Always set eventTimesPerDay for multi-day, regardless of sameTimeForAllDays
      timeDetails = {
        eventTimesPerDay: sameTimeForAllDays
          ? reservationData.rawSelectedDays.map((day) => ({
              date: day.formattedDate,
              startTime: formatTimeForDisplay(form.startTime),
              endTime: formatTimeForDisplay(form.endTime),
            }))
          : dailyTimes.map((dt) => ({
              date: (() => {
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
        startTime: null,
        endTime: null,
      };
    } else {
      timeDetails = {
        startTime: formatTimeForDisplay(form.startTime),
        endTime: formatTimeForDisplay(form.endTime),
        eventTimesPerDay: null,
      };
    }

    return {
      ...reservationData,
      eventTitle: form.title,
      eventType: form.type,
      eventPurpose: form.purpose,
      ...timeDetails,
      venue: venueObj,
      participants: parseInt(form.participants),
      contactPerson: form.contactPerson || "",
      contactPosition: form.contactPosition || "",
      contactNumber: form.contactNumber || "",
      orgName: form.orgName || "",
      perDayTimes: timeDetails.eventTimesPerDay || [],
      per_day_times: timeDetails.eventTimesPerDay || [],
    };
  };

  const validateForm = () => {
    const newErrors = {
      participants: validateParticipants(form.participants),
      contactNumber: validateContactNumber(form.contactNumber),
    };
    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    // Check other required fields
    const missingFields =
      !form.title ||
      !form.type ||
      !form.purpose ||
      !form.contactPerson ||
      !form.contactPosition ||
      !form.orgName ||
      (!form.startTime && sameTimeForAllDays) ||
      (!form.endTime && sameTimeForAllDays);

    if (hasErrors || missingFields) {
      if (missingFields) {
        alert("Please fill in all required fields.");
      }
      return false;
    }
    return true;
  };

  return (
    <>
      {/* Step 2 Modal */}
      {open && !step3Open && (
        <div className="fixed inset-0 z-[1400] flex items-center justify-center bg-black/30 backdrop-blur-sm p-2 md:p-4">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-auto my-2 md:my-8 flex flex-col gap-4 md:gap-6 px-4 pt-4 pb-24 md:p-10 overflow-y-auto max-h-[95vh]">
            {/* Notice for half-day bookings */}
            {!isMultipleDays &&
              partialDayInfo &&
              (partialDayInfo.amBooked || partialDayInfo.pmBooked) && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 md:p-4 mb-3 md:mb-4 rounded text-sm md:text-base">
                  Notice: On this date, this venue has been booked{" "}
                  {partialDayInfo.amBooked
                    ? `from 7:00 to ${partialDayInfo.amEnd}`
                    : `from ${partialDayInfo.pmStart} to 19:00`}
                  .<br />
                  As such, only{" "}
                  {partialDayInfo.amBooked
                    ? "13:00 to 19:00"
                    : "7:00 to 12:00"}{" "}
                  is available for booking.
                </div>
              )}
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 z-10 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            {/* Step 2 label */}
            <div className="flex justify-end w-full pr-8 md:pr-12">
              <span className="text-[#0458A9] font-semibold text-base md:text-lg lg:text-xl">
                Step 2
              </span>
            </div>
            {/* Title */}
            <div className="pr-8 md:pr-12">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0458A9] mb-2">
                Event Details
              </h2>
            </div>
            {/* Form */}
            <form className="flex flex-col gap-6 md:gap-8 w-full">
              {/* Row 0: Preferred Venue & Participants */}
              <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full">
                <div className="flex-1">
                  <label className="font-semibold text-gray-800 mb-1 block text-sm md:text-base">
                    <span className="text-[#E53935]">*</span> Preferred Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={form.venue}
                    disabled
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#0458A9] cursor-not-allowed"
                  />
                </div>
                <div className="flex-1">
                  <label className="font-semibold text-gray-800 mb-1 block text-sm md:text-base">
                    <span className="text-[#E53935]">*</span> No. of
                    Participants
                  </label>
                  <input
                    type="text"
                    name="participants"
                    value={form.participants}
                    onChange={handleChange}
                    placeholder="e.g., 50"
                    className={`w-full rounded-xl border ${
                      errors.participants ? "border-red-500" : "border-gray-300"
                    } bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#0458A9]`}
                    required
                  />
                  {errors.participants && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">
                      {errors.participants}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 1: Title & Type */}
              <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full">
                <div className="flex-1">
                  <label className="font-semibold text-gray-800 mb-1 block text-sm md:text-base">
                    <span className="text-[#E53935]">*</span> Title of the Event
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Artikulo: Voices in Motion"
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#0458A9]"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="font-semibold text-gray-800 mb-1 block text-sm md:text-base">
                    <span className="text-[#E53935]">*</span> Type of Activity
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="e.g., Workshop"
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#0458A9]"
                    required
                  />
                </div>
              </div>

              {/* Row 1.5: Organization Name */}
              <div className="w-full">
                <label className="font-semibold text-gray-800 mb-1 block text-sm md:text-base">
                  <span className="text-[#E53935]">*</span> Organization Name
                </label>
                <input
                  type="text"
                  name="orgName"
                  value={form.orgName}
                  onChange={handleChange}
                  placeholder="e.g., CIPHER, WVSU Spark Hub"
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#0458A9]"
                  required
                />
              </div>

              {/* Row 2: Purpose */}
              <div>
                <label className="font-semibold text-gray-800 mb-1 block text-sm md:text-base">
                  <span className="text-[#E53935]">*</span> Purpose of the Event
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  placeholder="e.g., Team-building and skill development"
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#0458A9]"
                  required
                />
              </div>

              {/* Row 3: Contact Information */}
              <div className="flex flex-col gap-4 md:gap-6 w-full">
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full">
                  <div className="flex-1">
                    <label className="font-semibold text-gray-800 mb-1 block text-sm md:text-base">
                      <span className="text-[#E53935]">*</span> Contact Person
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={form.contactPerson || ""}
                      onChange={handleChange}
                      placeholder="e.g., Juan Dela Cruz"
                      className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#0458A9]"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="font-semibold text-gray-800 mb-1 block text-sm md:text-base">
                      <span className="text-[#E53935]">*</span> Position
                    </label>
                    <input
                      type="text"
                      name="contactPosition"
                      value={form.contactPosition || ""}
                      onChange={handleChange}
                      placeholder="e.g., President"
                      className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#0458A9]"
                      required
                    />
                  </div>
                </div>
                <div className="w-full sm:w-auto sm:flex-1">
                  <label className="font-semibold text-gray-800 mb-1 block text-sm md:text-base">
                    <span className="text-[#E53935]">*</span> Contact Number
                  </label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={form.contactNumber || ""}
                    onChange={handleChange}
                    placeholder="e.g., +63 912 345 6789"
                    className={`w-full rounded-xl border ${
                      errors.contactNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#0458A9]`}
                    required
                  />
                  {errors.contactNumber && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">
                      {errors.contactNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Conditional Time Inputs based on booking type and toggle */}
              {isMultipleDays && (
                <div className="my-4 p-3 md:p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="sameTimeToggle"
                      checked={sameTimeForAllDays}
                      onChange={(e) => {
                        setSameTimeForAllDays(e.target.checked);
                        if (
                          !e.target.checked &&
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
                      className="h-4 w-4 text-[#0458A9] border-gray-300 rounded focus:ring-[#0458A9] mr-2 flex-shrink-0"
                    />
                    <label
                      htmlFor="sameTimeToggle"
                      className="font-medium text-gray-700 text-sm md:text-base leading-relaxed"
                    >
                      Use the same start and end time for all selected days
                    </label>
                  </div>
                </div>
              )}

              {/* Main Start Time / End Time (conditionally shown or used for all days) */}
              {(sameTimeForAllDays || !isMultipleDays) && (
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full">
                  <div className="flex-1">
                    <label className="font-semibold text-gray-800 mb-1 block text-sm md:text-base">
                      <span className="text-[#E53935]">*</span> Start Time{" "}
                      {isMultipleDays && sameTimeForAllDays
                        ? "(for all days)"
                        : ""}
                    </label>
                    <select
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#0458A9]"
                      required
                    >
                      {getStartTimeOptions().map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.display}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="font-semibold text-gray-800 mb-1 block text-sm md:text-base">
                      <span className="text-[#E53935]">*</span> End Time{" "}
                      {isMultipleDays && sameTimeForAllDays
                        ? "(for all days)"
                        : ""}
                    </label>
                    <select
                      name="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#0458A9]"
                      required
                    >
                      {getFilteredEndTimeOptions(form.startTime).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.display}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Individual Day Time Inputs (shown if multi-day and sameTimeForAllDays is false) */}
              {isMultipleDays &&
                !sameTimeForAllDays &&
                reservationData.rawSelectedDays && (
                  <div className="space-y-4 md:space-y-6 my-4 p-3 md:p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-base md:text-lg font-semibold text-[#0458A9] mb-2">
                      Set Time for Each Day:
                    </h3>
                    {dailyTimes.map((dayTime, index) => (
                      <div
                        key={dayTime.date}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <label className="font-semibold text-gray-700 mb-2 block text-sm md:text-base">
                          Date:{" "}
                          {new Date(
                            dayTime.date + "T00:00:00"
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                          <div className="flex-1">
                            <label className="text-xs md:text-sm text-gray-600 mb-1 block">
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
                              className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#0458A9]"
                            >
                              {timeOptionsWithFormat.slice(0, -1).map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.display}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex-1">
                            <label className="text-xs md:text-sm text-gray-600 mb-1 block">
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
                              className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-[#0458A9]"
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
                      </div>
                    ))}
                  </div>
                )}
            </form>
            <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 mt-6 md:mt-8">
              <button
                type="button"
                className="px-6 py-3 sm:py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition text-sm md:text-base order-2 sm:order-1"
                onClick={onPrevious}
              >
                Previous
              </button>
              <button
                type="button"
                className="px-8 py-3 sm:py-2 rounded-full bg-[#0458A9] text-white font-semibold hover:bg-[#02396b] transition text-sm md:text-base order-1 sm:order-2"
                onClick={() => {
                  if (validateForm()) {
                    setStep3Open(true);
                    setStep2Data(prepareStep3Data());
                  }
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {step3Open && (
        <ReserveStep3Modal
          open={step3Open}
          onClose={() => {
            setStep3Open(false);
            onClose && onClose();
          }}
          onPrevious={() => setStep3Open(false)}
          reservationData={step2Data}
          onReservationSubmitted={() => {
            setStep3Open(false);
            onClose && onClose();
          }}
        />
      )}
    </>
  );
}
