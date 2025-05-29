import React from "react";
import { LayoutDashboard, Clock, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const adminSidebarLinks = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Reservations", icon: Clock, path: "/admin/reservations" },
  { name: "Management", icon: Settings, path: "/admin/management" },
];

export default function AdminLeftSidebar({ active = "Dashboard" }) {
  return (
    <aside className="w-full lg:w-1/5 bg-white lg:border-b-0 lg:border-r p-4 md:p-6 flex flex-col justify-between border-gray-200 lg:min-h-screen">
      {/* Centered nav section */}
      <div className="flex flex-1 flex-col items-center justify-start w-full">
        <img
          src="/wevoAdmin.png"
          alt="Wevo Admin Logo"
          className="h-10 md:h-12 mb-8 lg:mb-12" // Matched LeftSidebar
        />
        <nav className="flex flex-col gap-4 w-full items-center justify-center">
          {adminSidebarLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-2 px-3 md:px-20 py-2 md:py-3 rounded-full w-full justify-center text-xs md:text-base ${
                active === link.name
                  ? "bg-[#56708A] text-white" // Admin color
                  : "text-gray-500 hover:bg-[#56708A]/10" // Admin color on hover
              }`}
            >
              <link.icon size={20} />
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
