// filepath: src/supabase/checkAdminRole.js
// Helper function to check if a user is in the admins table
import { supabase } from "./supabaseClient";

export async function isAdmin(email) {
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("email", email)
    .single();
  // If there's an error, no record, or role isn't 'admin', reject
  if (error || !data || data.role !== "admin") {
    return false;
  }
  return true;
}
