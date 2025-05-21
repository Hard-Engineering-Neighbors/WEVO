import React from "react";
import {
  LayoutDashboard,
  Clock,
  Settings,
  // Users, // Assuming Users icon is not needed based on current admin links
  // Search, // Not used in nav
  // ListFilter, // Not used in nav
  // Filter, // Not used in nav
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext"; // Consider if admin needs separate auth context or logic

const adminSidebarLinks = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Reservations", icon: Clock, path: "/admin/reservations" }, // Mockup shows "Reservations"
  { name: "Management", icon: Settings, path: "/admin/management" }, // Mockup shows "Management"
];

export default function AdminLeftSidebar({ active = "Dashboard" }) {
  const navigate = useNavigate();
  // const { currentUser } = useAuth(); // Placeholder if auth logic is needed

  // Basic navigation, can be expanded with guards like in LeftSidebar
  const handleNav = (path) => {
    // Example guard (optional, adapt as needed):
    // if (!currentUser && path.startsWith("/admin")) {
    //   navigate("/admin/login", { replace: true });
    //   return;
    // }
    navigate(path);
  };

  return (
    <aside className="w-full lg:w-1/5 bg-white lg:border-b-0 lg:border-r p-4 md:p-6 flex flex-col justify-between border-gray-200 lg:min-h-screen">
      {/* Centered nav section */}
      <div className="flex flex-1 flex-col items-center justify-start w-full">
        <img
          src="/wevoLogoPng.png"
          alt="Wevo Logo"
          className="h-10 md:h-12 mb-8 lg:mb-12" // Matched LeftSidebar
        />
        <nav className="flex flex-col gap-4 w-full items-center justify-center">
          {adminSidebarLinks.map((link) => (
            <button
              key={link.name}
              className={`flex items-center gap-2 px-3 md:px-20 py-2 md:py-3 rounded-full w-full justify-center text-xs md:text-base ${
                active === link.name
                  ? "bg-[#56708A] text-white" // Admin color
                  : "text-gray-500 hover:bg-[#56708A]/10" // Admin color on hover
              }`}
              onClick={() => handleNav(link.path)}
            >
              <link.icon size={20} />
              <span className="font-medium">{link.name}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Support Tools at the bottom, styled like LeftSidebar */}
      <div className="mt-8 w-full flex flex-col items-center hidden md:flex">
        <h3 className="text-[#56708A] font-bold text-lg mb-2">Support Tools</h3>
        <div className="flex flex-col gap-2 w-full">
          {/* Example support buttons, paths should be updated for admin */}
          <button
            onClick={() => handleNav("/admin/faq")} // Example path
            className="border rounded-full py-2 px-3 md:px-20 text-xs md:text-base text-gray-700 hover:bg-gray-100 w-full"
          >
            FAQ
          </button>
          <button
            onClick={() => handleNav("/admin/manual")} // Example path
            className="border rounded-full py-2 px-3 md:px-20 text-xs md:text-base text-gray-700 hover:bg-gray-100 w-full"
          >
            Admin Manual
          </button>
          <button
            onClick={() => handleNav("/admin/preferences")} // Example path
            className="border rounded-full py-2 px-3 md:px-20 text-xs md:text-base text-gray-700 hover:bg-gray-100 w-full"
          >
            Preferences
          </button>
          {/* No "Contact Admin" in admin sidebar mockup, can be added if needed */}
        </div>
      </div>
    </aside>
  );
}
