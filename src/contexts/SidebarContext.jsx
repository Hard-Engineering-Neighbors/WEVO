import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({ children }) {
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        isRightSidebarCollapsed,
        setIsRightSidebarCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
