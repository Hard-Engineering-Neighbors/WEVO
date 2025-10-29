import { supabase } from "../supabase/supabaseClient";
import culturalCenterImg from "../assets/cultural_center.webp";

// Helper to format a date string as 'Month Day, Year'
function formatDateStr(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// Helper to format a date string as 'HH:MM AM/PM'
function formatTimeStr(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

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
    if (event.created_at && req.event_id) {
      const { data: pdfs } = await supabase
        .from("pdf_files")
        .select("*")
        .eq("event_id", req.event_id)
        .order("uploaded_at", { ascending: true });
      pdf_files = pdfs || [];
    }
    // Parse per_day_times if present
    let perDayTimes = [];
    if (req.per_day_times) {
      try {
        perDayTimes = typeof req.per_day_times === 'string' ? JSON.parse(req.per_day_times) : req.per_day_times;
      } catch (e) { perDayTimes = []; }
    }
    return {
      id: req.id,
      venue: event.venue,
      event: event.title,
      type: event.type || event.org || "-", // Prefer type field, fall back to org for compatibility
      organizationName: req.organization_name || event.org || "-", // Organization name
      date: `${formatDate(event.start_time)} - ${formatDate(event.end_time)}`,
      participants: event.participants,
      purpose: event.purpose,
      description: event.description,
      image: event.image_url || culturalCenterImg,
      pdf_files,
      status: req.status, // <-- add status to request card data
      perDayTimes,
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
    // Accept date as YYYY-MM-DD or Date object
    let year, month, day;
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      [year, month, day] = date.split('-').map(Number);
    } else {
      const d = new Date(date);
      year = d.getFullYear();
      month = d.getMonth() + 1;
      day = d.getDate();
    }
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
    // JS months are 0-based
    const localDate = new Date(year, month - 1, day, hour, minute, 0);
    return localDate.toISOString();
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
        org: form.orgName || "", // Store organization name in org field
        type: form.eventType || form.type, // Store event type in separate field
        venue: form.venue?.name || form.venue,
        start_time: startTimeISO,
        end_time: endTimeISO,
        created_by: user.id,
        created_at: new Date().toISOString(),
        participants: parseInt(form.participants) || 0,  // parse to integer
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
  // 3. Insert booking request with contact information and per_day_times
  const { data: bookingData, error: bookingError } = await supabase
    .from("booking_requests")
    .insert([
      {
        event_id: eventData.id,
        requested_by: user.id,
        status: "pending",
        notes: "",
        contact_person: form.contactPerson || "",
        contact_position: form.contactPosition || "", 
        contact_number: form.contactNumber || "",
        organization_name: form.orgName || "",
        per_day_times: form.perDayTimes ? JSON.stringify(form.perDayTimes) : null
      },
    ])
    .select()
    .single();
  if (bookingError) throw bookingError;

  // Notify all admins (do NOT notify the user here)
  const { data: admins } = await supabase
    .from("users")
    .select("id")
    .eq("role", "admin");
  if (admins) {
    // Send a single global admin notification
    await createNotification({
      userId: null,
      type: "System",
      message: `New booking request from ${form.orgName || user.email} for ${form.venue?.name || form.venue}`,
      relatedRequestId: bookingData.id,
      data: { orgName: form.orgName, venue: form.venue },
      role: "admin"
    });
  }
  // Notify ONLY the user (not admins)
  await createNotification({
    userId: user.id,
    type: "System",
    message: `Your booking request for ${form.venue?.name || form.venue} has been submitted and is awaiting approval.`,
    relatedRequestId: bookingData.id,
    data: { orgName: form.orgName, venue: form.venue },
    role: "user"
  });

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

// Cancel an approved reservation (set status to 'cancelled', save reason, notify admins)
export async function cancelApprovedReservation({ bookingRequestId, userId, reason }) {
  // 1. Update booking request status and reason
  const { data: booking, error: updateError } = await supabase
    .from("booking_requests")
    .update({
      status: "cancelled",
      cancellation_reason: reason,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", bookingRequestId)
    .eq("requested_by", userId)
    .select("*, events(*)")
    .single();
  if (updateError) throw updateError;

  // 2. Notify all admins
  const { data: admins } = await supabase
    .from("users")
    .select("id")
    .eq("role", "admin");
  if (admins) {
    await Promise.all(admins.map(admin =>
      createNotification({
        userId: admin.id,
        type: "System",
        message: `Reservation for ${booking.events?.title || booking.events?.venue || "venue"} by ${booking.organization_name || "an organization"} was cancelled by the user. Reason: ${reason}`,
        relatedRequestId: booking.id,
        data: {
          orgName: booking.organization_name,
          venue: booking.events?.venue,
          cancellationReason: reason,
        },
        role: "admin"
      })
    ));
    // --- GLOBAL ADMIN NOTIFICATION ---
    await sendAdminNotification({
      message: `The reservation for ${booking.events?.title || booking.events?.venue || "venue"} by ${booking.organization_name || "an organization"} has been cancelled. Reason: ${reason}`,
      related_request_id: booking.id,
    });
  }
  // 3. Notify the user about the cancellation
  await createNotification({
    userId: booking.requested_by,
    type: "System",
    message: `Your cancellation request for ${booking.events?.venue || "venue"} was sent to the venue administration with the following reason: ${reason}`,
    relatedRequestId: booking.id,
    data: {
      orgName: booking.organization_name,
      venue: booking.events?.venue,
      cancellationReason: reason,
    },
    role: "user"
  });
  return booking;
}

// Fetch all booking requests for admin view (includes events and uploaded docs)
export async function fetchAdminRequests() {
  // Fetch booking requests with related event
  const { data: requests, error: fetchError } = await supabase
    .from("booking_requests")
    .select("*, events(*)");
  if (fetchError) throw fetchError;

  const results = await Promise.all(
    (requests || []).map(async (req) => {
      const ev = req.events || {};

      // fetch pdf files for this event
      const { data: pdfs, error: pdfError } = await supabase
        .from("pdf_files")
        .select("*")
        .eq("event_id", ev.id);
      if (pdfError) {
        console.error("Error fetching pdf_files for event", ev.id, pdfError);
      }
      // generate public URLs
      const uploadedDocuments = (pdfs || []).map((f) => {
        const { data } = supabase.storage.from("pdfs").getPublicUrl(f.file_url);
        return { name: f.file_name, url: data.publicUrl };
      });
      // Use contact info from booking request first, fall back to user profile
      let contactPerson = req.contact_person || "";
      let position = req.contact_position || "";
      let contactNumber = req.contact_number || "";
      let organizationName = req.organization_name || "";
      // If any contact info is missing, try to fetch from user profile as fallback
      if (!contactPerson || !position || !contactNumber) {
        const { data: profile, error: userErr } = await supabase
          .from("users")
          .select("full_name, position, contact_number")
          .eq("id", req.requested_by)
          .single();
        if (userErr) {
          console.warn("Could not fetch user profile for request", req.id, userErr);
        } else if (profile) {
          contactPerson = contactPerson || profile.full_name || "";
          position = position || profile.position || "";
          contactNumber = contactNumber || profile.contact_number || "";
        }
      }
      // Always declare perDayTimes
      let perDayTimes = [];
      if (req.per_day_times) {
        try {
          perDayTimes = typeof req.per_day_times === 'string' ? JSON.parse(req.per_day_times) : req.per_day_times;
        } catch (e) { perDayTimes = []; }
      }
      return {
        id: req.id,
        orgName: organizationName || ev.org || "",
        location: ev.venue || "",
        type: ev.type || ev.org || "",  // Try to use ev.type, fall back to ev.org for backward compatibility
        eventName: ev.title || "",
        date: formatDateStr(ev.start_time),
        time: `${formatTimeStr(ev.start_time)} - ${formatTimeStr(ev.end_time)}`,
        startDate: ev.start_time || null,
        endDate: ev.end_time || null,
        // normalize status to Title Case e.g. 'pending' -> 'Pending'
        status: (() => {
          const s = (req.status || '').toString().toLowerCase();
          return s.charAt(0).toUpperCase() + s.slice(1);
        })(),
        contactPerson,
        position,
        contactNumber,
        eventPurpose: ev.purpose || "",
        participants: ev.participants || "",
        uploadedDocuments,
        rejectionReason: req.rejection_reason || "",
        perDayTimes,
      };
    })
  );
  // Optionally sort by date descending
  return results.sort((a, b) => new Date(b.startDate || b.date) - new Date(a.startDate || a.date));
}

// Update booking request status (Approve or Reject)
export async function updateBookingRequestStatus(requestId, status, reason) {
  const updates = {
    status: status.toLowerCase(),
    reviewed_at: new Date().toISOString(),
  };
  if (reason) updates.rejection_reason = reason;
  const { data, error } = await supabase
    .from("booking_requests")
    .update(updates)
    .eq("id", requestId)
    .select()
    .single();
  if (error) throw error;

  // Fetch the booking request to get the user_id and venue
  const { data: booking } = await supabase
    .from("booking_requests")
    .select("requested_by, id, events(title, venue, start_time, end_time), organization_name, per_day_times")
    .eq("id", requestId)
    .single();

  // --- AUTO-REJECT LOGIC FOR CONFLICTING REQUESTS ---
  if (status.toLowerCase() === "approved" && booking && booking.events) {
    // 1. Get approved venue, date(s), and time(s)
    const approvedVenue = booking.events.venue;
    let approvedPerDay = [];
    if (booking.per_day_times) {
      try {
        approvedPerDay = typeof booking.per_day_times === 'string' ? JSON.parse(booking.per_day_times) : booking.per_day_times;
      } catch (e) { approvedPerDay = []; }
    }
    // Fallback to single date/time if per_day_times is empty
    if (!approvedPerDay.length && booking.events.start_time && booking.events.end_time) {
      approvedPerDay = [{
        date: new Date(booking.events.start_time).toISOString().split('T')[0],
        startTime: new Date(booking.events.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        endTime: new Date(booking.events.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      }];
    }
    // 2. Find all other pending requests for the same venue and date(s)
    const { data: pendingRequests } = await supabase
      .from("booking_requests")
      .select("id, requested_by, events(title, venue, start_time, end_time), organization_name, per_day_times")
      .neq("id", requestId)
      .eq("status", "pending");
    for (const req of pendingRequests || []) {
      if (!req.events || req.events.venue !== approvedVenue) continue;
      let reqPerDay = [];
      if (req.per_day_times) {
        try {
          reqPerDay = typeof req.per_day_times === 'string' ? JSON.parse(req.per_day_times) : req.per_day_times;
        } catch (e) { reqPerDay = []; }
      }
      if (!reqPerDay.length && req.events.start_time && req.events.end_time) {
        reqPerDay = [{
          date: new Date(req.events.start_time).toISOString().split('T')[0],
          startTime: new Date(req.events.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          endTime: new Date(req.events.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        }];
      }
      // 3. Check for overlap on any day
      let conflict = false;
      for (const aDay of approvedPerDay) {
        for (const rDay of reqPerDay) {
          if (aDay.date === rDay.date) {
            // Convert times to minutes for comparison
            const [aStartH, aStartM] = aDay.startTime.split(":").map(Number);
            const [aEndH, aEndM] = aDay.endTime.split(":").map(Number);
            const [rStartH, rStartM] = rDay.startTime.split(":").map(Number);
            const [rEndH, rEndM] = rDay.endTime.split(":").map(Number);
            const aStart = aStartH * 60 + aStartM;
            const aEnd = aEndH * 60 + aEndM;
            const rStart = rStartH * 60 + rStartM;
            const rEnd = rEndH * 60 + rEndM;
            // --- PARTIAL DAY LOGIC ---
            // If approved ends <= 12:30pm (750 min), allow new to start at 13:00 (780 min)
            // If approved ends > 12:30pm, no afternoon slot
            if (aEnd <= 750 && rStart === 780 && rEnd > rStart) {
              // Allow 1pm+ booking if morning event ends at/before 12:30pm
              continue;
            }
            // If times overlap, mark as conflict
            if (aStart < rEnd && rStart < aEnd) {
              conflict = true;
              break;
            }
          }
        }
        if (conflict) break;
      }
      if (conflict) {
        // 4. Reject the conflicting request
        const rejectionReason = `This venue has been booked by ${booking.organization_name} on this date/time. Please request another date or time.`;
        await supabase
          .from("booking_requests")
          .update({ status: "rejected", rejection_reason: rejectionReason, reviewed_at: new Date().toISOString() })
          .eq("id", req.id);
        // Notify the user
        await createNotification({
          userId: req.requested_by,
          type: "Admin",
          message: rejectionReason,
          relatedRequestId: req.id,
          data: {
            status: "rejected",
            venue: booking.events.venue,
            date: aDay.date,
            orgName: booking.organization_name,
            rejectionReason,
          },
          role: "user"
        });
      }
    }
  }
  // --- END AUTO-REJECT LOGIC ---

  if (booking) {
    // Format date or dates
    let dateStr = "";
    if (booking.per_day_times) {
      try {
        const perDay = typeof booking.per_day_times === 'string' ? JSON.parse(booking.per_day_times) : booking.per_day_times;
        if (Array.isArray(perDay) && perDay.length > 0) {
          if (perDay.length === 1) {
            dateStr = new Date(perDay[0].date).toLocaleDateString() + ' ' + perDay[0].startTime + ' - ' + perDay[0].endTime;
          } else {
            dateStr = perDay.map(d => new Date(d.date).toLocaleDateString()).join(', ');
          }
        }
      } catch (e) {}
    }
    if (!dateStr && booking.events?.start_time && booking.events?.end_time) {
      dateStr = new Date(booking.events.start_time).toLocaleString() + ' - ' + new Date(booking.events.end_time).toLocaleString();
    }
    await createNotification({
      userId: booking.requested_by,
      type: "Admin",
      message: `Your booking request for ${booking.events?.venue || ""}${dateStr ? ` (${dateStr})` : ""}${booking.organization_name ? ` by ${booking.organization_name}` : ""} has been ${status.toLowerCase()}.`,
      relatedRequestId: booking.id,
      data: {
        status,
        venue: booking.events?.venue,
        date: dateStr,
        orgName: booking.organization_name,
        rejectionReason: booking.rejection_reason || reason,
      },
      role: "user"
    });
    // --- ADMIN NOTIFICATION ---
    let adminMsg = "";
    if (status.toLowerCase() === "approved") {
      adminMsg = `You have approved ${booking.organization_name || "an organization"}'s event: ${booking.events?.title || "an event"}.`;
    } else if (status.toLowerCase() === "rejected") {
      adminMsg = `You have rejected ${booking.organization_name || "an organization"}'s request for ${booking.events?.title || "an event"}. Reason: ${reason || booking.rejection_reason || "No reason provided."}`;
    }
    if (adminMsg) {
      await sendAdminNotification({
        message: adminMsg,
        related_request_id: booking.id,
      });
    }
  }

  return data;
}

// Fetch statistics for admin dashboard
export async function fetchStatistics() {
  // Get all booking requests
  const { data, error } = await supabase
    .from("booking_requests")
    .select("status");
  
  if (error) throw error;
  
  // Default stats
  const stats = {
    totalRequests: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0
  };
  
  // If there are no requests, return default stats
  if (!data || data.length === 0) return stats;
  
  // Count requests by status
  stats.totalRequests = data.length;
  
  data.forEach(request => {
    const status = (request.status || "").toLowerCase();
    if (status === "pending") stats.pending++;
    else if (status === "approved") stats.approved++;
    else if (status === "rejected") stats.rejected++;
    else if (status === "cancelled") stats.cancelled++;
  });
  
  return stats;
}

// Helper to create a notification
export async function createNotification({ userId, type, message, relatedRequestId, data, role }) {
  const { error } = await supabase
    .from("notifications")
    .insert([{
      user_id: userId,
      type,
      message,
      related_request_id: relatedRequestId,
      status: "unread",
      data: data ? JSON.stringify(data) : null,
      role: role || "user"
    }]);
  if (error) throw error;
}

// Fetch notifications for a user, most recent first
export async function fetchNotifications(userId) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// Mark a notification as read
export async function markNotificationAsRead(notificationId) {
  const { error } = await supabase
    .from("notifications")
    .update({ status: "read" })
    .eq("id", notificationId);
  if (error) throw error;
}

// Get all bookings (with per-day times and status) for a given venue
export async function getVenueBookings(venueName) {
  const { data, error } = await supabase
    .from("booking_requests")
    .select("id, status, events(start_time, end_time, venue), per_day_times, rejection_reason")
    .in("status", ["approved", "pending"]); // Removed .order("created_at", ...)
  if (error) throw error;
  // Filter for the selected venue
  const bookings = (data || []).filter(req => req.events && req.events.venue === venueName);
  // Map to per-day times for blackout logic
  return bookings.map(req => {
    let perDayTimes = [];
    if (req.per_day_times) {
      try {
        perDayTimes = typeof req.per_day_times === 'string' ? JSON.parse(req.per_day_times) : req.per_day_times;
      } catch (e) { perDayTimes = []; }
    }
    // Fallback to single date/time if perDayTimes is empty
    if (!perDayTimes.length && req.events.start_time && req.events.end_time) {
      // Convert to local date string
      const localStart = new Date(req.events.start_time);
      const localEnd = new Date(req.events.end_time);
      const localDateStr = localStart.getFullYear() + '-' +
        String(localStart.getMonth() + 1).padStart(2, '0') + '-' +
        String(localStart.getDate()).padStart(2, '0');
      perDayTimes = [{
        date: localDateStr,
        startTime: localStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        endTime: localEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      }];
    }
    return {
      id: req.id,
      status: req.status,
      perDayTimes,
      rejectionReason: req.rejection_reason,
    };
  });
}

// Fetch a booking request by ID (with event details)
export async function fetchBookingRequest(requestId) {
  const { data, error } = await supabase
    .from('booking_requests')
    .select('*, events(*)')
    .eq('id', requestId)
    .single();
  if (error) throw error;
  return data;
}

// Send a global admin notification
export async function sendAdminNotification({ message, related_request_id }) {
  const { error } = await supabase
    .from("notifications")
    .insert([
      {
        message,
        related_request_id,
        role: "admin",
        status: "unread",
        type: "admin",
      },
    ]);
  if (error) throw error;
}

// Fetch global admin notifications
export async function fetchGlobalAdminNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("role", "admin")
    .filter("user_id", "is", null)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// Fetch all approved events (for calendar)
export async function fetchApprovedEvents() {
  const { data, error } = await supabase
    .from("booking_requests")
    .select("id, status, per_day_times, events(id, title, org, venue, start_time, end_time)")
    .eq("status", "approved");
  if (error) throw error;
  // Flatten and format the data for calendar use
  return (data || []).map((req) => {
    const event = req.events || {};
    let perDayTimes = [];
    if (req.per_day_times) {
      try {
        perDayTimes = typeof req.per_day_times === 'string' ? JSON.parse(req.per_day_times) : req.per_day_times;
      } catch (e) { perDayTimes = []; }
    }
    return {
      id: event.id || req.id,
      title: event.title || "",
      org: event.org || "",
      venue: event.venue || "",
      start_time: event.start_time || "",
      end_time: event.end_time || "",
      perDayTimes,
    };
  });
}