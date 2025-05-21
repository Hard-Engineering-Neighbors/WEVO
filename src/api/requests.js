import { supabase } from "../supabase/supabaseClient";
import culturalCenterImg from "../assets/cultural_center.webp";

// Fetch all requests for the current user, including event and pdf_files
export async function fetchRequests(userId) {
  const { data, error } = await supabase
    .from("booking_requests")
    .select(`*, events(*)`)
    .eq("requested_by", userId)
    .order("created_at", { foreignTable: "events", ascending: false });
  if (error) throw error;
  // For each request, fetch related pdf_files (best-effort: uploaded_by user and uploaded_at after event creation)
  const requests = await Promise.all((data || []).map(async (req) => {
    const event = req.events || {};
    let pdf_files = [];
    if (event.created_at) {
      const { data: pdfs } = await supabase
        .from("pdf_files")
        .select("*")
        .eq("uploaded_by", userId)
        .gte("uploaded_at", event.created_at)
        .order("uploaded_at", { ascending: true });
      pdf_files = pdfs || [];
    }
    return {
      id: req.id,
      venue: event.venue,
      event: event.title,
      type: event.org || "-",
      date: `${formatDate(event.start_time)} - ${formatDate(event.end_time)}`,
      participants: event.participants,
      purpose: event.purpose,
      description: event.description,
      image: event.image_url || culturalCenterImg,
      pdf_files,
      status: req.status, // <-- add status to request card data
      ...req,
    };
  }));
  return requests;
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

// Create a new reservation request (event, pdf_files, booking_request)
export async function createReservation({ form, files, user }) {
  // Convert time fields to ISO 8601 if needed
  function toISODateTime(date, time) {
    if (!time) return new Date(date).toISOString();
    // If already ISO, return as is
    if (/T\d{2}:\d{2}/.test(time)) return time;
    let d = date instanceof Date ? new Date(date) : new Date(date);
    let hour = 0, minute = 0;
    let t = time.trim();
    // Handle 12-hour format with AM/PM
    const ampmMatch = t.match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
    if (ampmMatch) {
      hour = parseInt(ampmMatch[1], 10);
      minute = parseInt(ampmMatch[2], 10);
      const pm = /PM/i.test(ampmMatch[3]);
      if (pm && hour < 12) hour += 12;
      if (!pm && hour === 12) hour = 0;
    } else {
      // 24-hour format
      const parts = t.split(":");
      hour = parseInt(parts[0], 10);
      minute = parseInt(parts[1], 10);
    }
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  }

  // Use today's date if not provided
  const today = new Date();
  // Use selectedDates if provided, else fallback to eventDate
  let startTimeISO, endTimeISO;
  if (Array.isArray(form.selectedDates) && form.selectedDates.length > 0) {
    // Sort dates to get the earliest and latest
    const sortedDates = form.selectedDates.map(d => new Date(d)).sort((a, b) => a - b);
    const firstDate = sortedDates[0];
    const lastDate = sortedDates[sortedDates.length - 1];
    startTimeISO = toISODateTime(firstDate, form.startTime);
    endTimeISO = toISODateTime(lastDate, form.endTime);
  } else {
    // Single date fallback
    const eventDate = form.eventDate || today;
    startTimeISO = form.startTimeISO || toISODateTime(eventDate, form.startTime);
    endTimeISO = form.endTimeISO || toISODateTime(eventDate, form.endTime);
  }

  // 1. Insert event
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .insert([
      {
        title: form.eventTitle || form.title,
        org: form.eventType || form.type,
        venue: form.venue?.name || form.venue,
        start_time: startTimeISO,
        end_time: endTimeISO,
        created_by: user.id,
        created_at: new Date().toISOString(),
        purpose: form.eventPurpose || form.purpose, // <-- add purpose
      },
    ])
    .select()
    .single();
  if (eventError) throw eventError;

  // 2. Upload files and insert into pdf_files
  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(`user-${user.id}/${Date.now()}-${file.name}`, file);
      if (uploadError) throw uploadError;
      const fileUrl = uploadData.path;
      const { data: pdfData, error: pdfError } = await supabase
        .from("pdf_files")
        .insert([
          {
            file_name: file.name,
            file_url: fileUrl,
            uploaded_by: user.id,
            uploaded_at: new Date().toISOString(),
            label: "Reservation Form",
            description: "Uploaded reservation form",
            event_id: eventData.id, // <-- always set event_id
          },
        ])
        .select()
        .single();
      if (pdfError) throw pdfError;
      return pdfData;
    })
  );

  // 3. Insert booking request
  const { data: bookingData, error: bookingError } = await supabase
    .from("booking_requests")
    .insert([
      {
        event_id: eventData.id,
        requested_by: user.id,
        status: "pending",
        notes: "",
      },
    ])
    .select()
    .single();
  if (bookingError) throw bookingError;

  return { event: eventData, pdf_files: uploadedFiles, booking_request: bookingData };
}

// Delete a reservation, its associated event, and uploaded pdf files from the database and storage
export async function cancelReservation(bookingRequestId) {
  // 1. Get the booking request to find the event_id
  const { data: booking, error: fetchError } = await supabase
    .from("booking_requests")
    .select("id, event_id")
    .eq("id", bookingRequestId)
    .single();
  if (fetchError) throw fetchError;

  // 2. Get the event to find the user and event creation time
  let event = null;
  let eventId = null;
  if (booking && booking.event_id) {
    eventId = booking.event_id;
    const { data: eventData } = await supabase
      .from("events")
      .select("id, created_by, created_at")
      .eq("id", booking.event_id)
      .single();
    event = eventData;
  }

  // 3. Always delete all pdf_files with event_id first, even if event is missing
  if (eventId) {
    let { data: pdfFiles } = await supabase
      .from("pdf_files")
      .select("id, file_url")
      .eq("event_id", eventId);
    if (pdfFiles && pdfFiles.length > 0) {
      // Delete files from Supabase Storage
      for (const file of pdfFiles) {
        await supabase.storage.from("pdfs").remove([file.file_url]);
      }
      // Delete pdf_files records
      const pdfFileIds = pdfFiles.map(f => f.id);
      await supabase.from("pdf_files").delete().in("id", pdfFileIds);
    }
  }

  // 4. Delete the user's booking_request, then the event if no more requests reference it
  if (booking && booking.event_id) {
    // Delete only the current user's booking_request
    await supabase
      .from("booking_requests")
      .delete()
      .eq("id", bookingRequestId);
    // Check if any booking_requests remain for this event
    const { data: remainingBookings, error: remainingError } = await supabase
      .from("booking_requests")
      .select("id, event_id, status")
      .eq("event_id", booking.event_id);
    if (remainingBookings && remainingBookings.length === 0) {
      // No more requests reference this event, safe to delete event
      await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
      await supabase
        .from("events")
        .delete()
        .eq("id", booking.event_id);
    } else if (remainingBookings && remainingBookings.length > 0) {
      // There are still requests referencing this event, do not delete event
      console.warn("[cancelReservation] Event not deleted, still referenced by:", remainingBookings);
    }
    if (remainingError) {
      console.error("[cancelReservation] Error checking for orphaned booking_requests:", remainingError);
    }
  } else {
    // If no event_id, just delete the booking request
    await supabase
      .from("booking_requests")
      .delete()
      .eq("id", bookingRequestId);
  }

  return true;
}