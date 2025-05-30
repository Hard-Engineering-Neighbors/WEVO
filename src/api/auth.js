import { supabase } from "../supabase/supabaseClient";

/**
 * Send password reset email to user
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendPasswordResetEmail(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/set-password`,
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Password reset email error:", error);
    return { 
      success: false, 
      error: error.message || "Failed to send password reset email" 
    };
  }
}

/**
 * Update user password (used in reset password flow)
 * @param {string} newPassword - New password
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateUserPassword(newPassword) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Password update error:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update password" 
    };
  }
}

/**
 * Set session from reset password tokens
 * @param {string} accessToken - Access token from reset URL
 * @param {string} refreshToken - Refresh token from reset URL
 * @returns {Promise<{success: boolean, session?: object, error?: string}>}
 */
export async function setPasswordResetSession(accessToken, refreshToken) {
  try {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      throw error;
    }

    return { success: true, session: data.session };
  } catch (error) {
    console.error("Session setup error:", error);
    return { 
      success: false, 
      error: error.message || "Failed to establish session" 
    };
  }
}

/**
 * Sign out user
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { 
      success: false, 
      error: error.message || "Failed to sign out" 
    };
  }
}

/**
 * Get current session
 * @returns {Promise<{success: boolean, session?: object, error?: string}>}
 */
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }

    return { success: true, session };
  } catch (error) {
    console.error("Get session error:", error);
    return { 
      success: false, 
      error: error.message || "Failed to get session" 
    };
  }
} 