// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user || null);
      setLoading(false);
    });
    // Get initial user
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data?.user || null);
      setLoading(false);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
// The AuthProvider component uses Supabase to listen for changes in the user's authentication state.
// When the component mounts, it sets up a listener that updates the currentUser state whenever the authentication state changes.