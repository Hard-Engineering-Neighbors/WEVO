// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Function to sync auth user to users table
async function syncUserToDatabase(authUser) {
  if (!authUser) return;

  try {
    // Check if user already exists in users table
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // Error other than "not found"
      console.error("Error checking existing user:", fetchError);
      return;
    }

    if (!existingUser) {
      // User doesn't exist in users table, create them
      const { error: insertError } = await supabase.from("users").insert({
        id: authUser.id,
        email: authUser.email,
        full_name:
          authUser.user_metadata?.full_name || authUser.email.split("@")[0],
        role: "user", // Default role
        position: "",
        contact_number: "",
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Error creating user in database:", insertError);
      } else {
        console.log("User synced to database:", authUser.email);
      }
    } else {
      // User exists, no need to update anything since updated_at column doesn't exist
      console.log("User already exists in database:", authUser.email);
    }
  } catch (error) {
    console.error("Error in syncUserToDatabase:", error);
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user || null;

        // Sync user to database when they sign in
        if (event === "SIGNED_IN" && user) {
          await syncUserToDatabase(user);
        }

        setCurrentUser(user);
        setLoading(false);
      }
    );

    // Get initial user and sync if they exist
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data?.user || null;
      if (user) {
        await syncUserToDatabase(user);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Add logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
// The AuthProvider component uses Supabase to listen for changes in the user's authentication state.
// When the component mounts, it sets up a listener that updates the currentUser state whenever the authentication state changes.
// Now it also automatically syncs authenticated users to the users table in the database.
