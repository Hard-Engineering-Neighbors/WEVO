import { supabase } from "../supabase/supabaseClient";

// Fetch all venues
export async function fetchVenues() {
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
}

// Create a new venue
export async function createVenue(venueData) {
  const insertData = {
    name: venueData.name,
    location: venueData.location || null,
    capacity: venueData.capacity || null,
    description: venueData.description || null,
    image_url: venueData.image_url || null,
    location_image_url: venueData.location_image_url || null,
    features: venueData.features?.length ? venueData.features : null,
    status: venueData.status || "active",
    department: venueData.department || null,
  };
  const { data, error } = await supabase
    .from("venues")
    .insert([insertData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Edit venue
export async function editVenue(id, updates) {
  const updateData = {
    name: updates.name,
    location: updates.location || null,
    capacity: updates.capacity ? parseInt(updates.capacity) : null,
    description: updates.description || null,
    image_url: updates.image_url || null,
    location_image_url: updates.location_image_url || null,
    features: updates.features?.length ? updates.features : null,
    status: updates.status || "active",
    department: updates.department || null,
  };
  const { data, error } = await supabase
    .from("venues")
    .update(updateData)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Venue not found or not updated");
  return data;
}

// Delete venue
export async function removeVenue(id) {
  const { data, error } = await supabase
    .from("venues")
    .delete()
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Get venue by id
export async function getVenue(id) {
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
} 