import React, { useState } from "react";
import { User, Menu, LogOut, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Re-styled Logout Modal for Admin theme, aligned with User's modal text
function AdminLogoutConfirmModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-[#56708A] mb-4">
          Confirm Logout
        </h3>
        <p className="text-gray-700 mb-6">Are you sure you want to log out?</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-[#56708A] text-white rounded-full font-medium hover:bg-[#455b74]"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminRightSidebar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    navigate("/admin/login", { replace: true });
  };

  // Dummy notifications data for admin
  const notifications = [
    {
      id: 1,
      user: "System",
      date: "Month, XX, XXXX at XX:XX",
      message: "User [UserEmail] submitted a new venue request.",
      read: false,
    },
    {
      id: 2,
      user: "System",
      date: "Month, XX, XXXX at XX:XX",
      message: "Request for [VenueName] approved.",
      read: true,
    },
    {
      id: 3,
      user: "Alert",
      date: "Month, XX, XXXX at XX:XX",
      message: "High traffic warning for Cultural Center.",
      read: false,
    },
    {
      id: 4,
      user: "System",
      date: "Month, XX, XXXX at XX:XX",
      message: "User [AnotherUser] updated their profile.",
      read: true,
    },
  ];

  return (
    <>
      <aside className="w-full lg:w-1/5 bg-white lg:border-t-0 lg:border-l p-4 md:p-6 order-1 lg:order-none flex flex-col gap-4 border-gray-200">
        {/* Account Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-medium text-gray-700">
            {currentUser?.email || "Admin Portal"}
          </div>
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 gap-2">
            <span className="w-8 h-8 rounded-full bg-[#56708A] flex items-center justify-center">
              <User size={18} className="text-white" />
            </span>
            {/* <Menu size={20} className="text-gray-600 cursor-pointer" /> */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-100 group"
              title="Logout"
            >
              <LogOut
                size={20}
                className="text-gray-600 group-hover:text-red-500 transition-colors"
              />
            </button>
          </div>
        </div>
        {/* Notifications Box */}
        <div className="rounded-2xl border border-[#C0C0C0] p-4 bg-white flex-grow flex flex-col">
          <h2 className="text-2xl font-bold text-[#56708A] mb-2">
            Notifications
          </h2>
          <div className="relative mb-3">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search for a notification"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#56708A] focus:border-[#56708A]"
            />
          </div>

          <ul
            className="divide-y divide-gray-200 overflow-y-auto flex-grow pr-1"
            style={{ maxHeight: "calc(100vh - 350px)" }}
          >
            {notifications.map((notif) => (
              <li key={notif.id} className="flex items-center py-2">
                <div className="flex-1">
                  <span className="font-bold text-[#56708A]">{notif.user}</span>
                  <span className="text-gray-400 text-sm ml-1">
                    {notif.date}
                  </span>
                  <div className="text-gray-700 text-sm">{notif.message}</div>
                </div>
                {!notif.read && (
                  <span className="w-3 h-3 bg-yellow-400 rounded-full ml-2 flex-shrink-0"></span>
                )}
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-4 mb-1">
            <button className="w-full py-2.5 bg-white rounded-lg border border-gray-300 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Show All Notifications
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <AdminLogoutConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
