import React, { useState } from "react";
import { User, Menu, LogOut, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (text && typeof text === "string" && text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

function LogoutConfirmModal({ open, onClose, onConfirm }) {
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

        <h3 className="text-xl font-bold text-[#0458A9] mb-4">
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
            className="px-6 py-2 bg-[#0458A9] text-white rounded-full font-medium hover:bg-[#03407a]"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RightSidebar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    navigate("/login", { replace: true });
  };

  const notifications = [
    {
      id: 1,
      user: "Admin",
      date: "Month, XX, XXXX at XX:XX",
      message: "System Generated.",
      read: false,
    },
    {
      id: 2,
      user: "Admin",
      date: "Month, XX, XXXX at XX:XX",
      message: "Congratulations! lorem ipsum lorem….",
      read: true,
    },
    {
      id: 3,
      user: "Admin",
      date: "Month, XX, XXXX at XX:XX",
      message: "Congratulations! lorem ipsum lorem….",
      read: false,
    },
  ];

  // Find the latest notification for mobile view
  // Prioritize the latest unread, then the latest overall if no unread
  const latestUnread = notifications
    .filter((n) => !n.read)
    .sort((a, b) => b.id - a.id)[0];
  const latestNotification =
    latestUnread ||
    (notifications.length > 0
      ? notifications.sort((a, b) => b.id - a.id)[0]
      : null);

  return (
    <>
      <aside className="w-full lg:w-1/5 bg-white lg:border-t-0 lg:border-l p-4 md:p-6 order-1 lg:order-none flex flex-col gap-4 border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-medium text-gray-700">
            {currentUser?.email || "Account Name"}
          </div>
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 gap-2">
            <span className="w-8 h-8 rounded-full bg-[#0458A9] flex items-center justify-center">
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
        <div className="rounded-2xl border border-[#C0C0C0] p-4 bg-white flex-grow flex flex-col">
          <h2 className="text-2xl font-bold text-[#0458A9] mb-2">
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
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#0458A9] focus:border-[#0458A9]"
            />
          </div>
          {/* Desktop: Full Notifications List (hidden on mobile) */}
          <ul
            className="hidden lg:block divide-y divide-gray-200 overflow-y-auto flex-grow pr-1"
            style={{ maxHeight: "calc(100vh - 350px)" }}
          >
            {notifications.map((notif) => (
              <li key={notif.id} className="flex items-center py-2">
                <div className="flex-1">
                  <span className="font-bold text-[#0458A9]">{notif.user}</span>
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
          {/* Mobile: Latest Notification (shown on mobile, hidden on lg and up) */}
          {latestNotification && (
            <div className="lg:hidden py-2 border-b border-gray-200 mb-2">
              <div className="flex items-center">
                <div className="flex-1">
                  <span className="font-bold text-[#0458A9]">
                    {latestNotification.user}
                  </span>
                  <span className="text-gray-400 text-sm ml-1">
                    {latestNotification.date}
                  </span>
                  <div className="text-gray-700 text-sm">
                    {truncateText(latestNotification.message, 50)}{" "}
                    {/* Truncate message to 50 chars */}
                  </div>
                </div>
                {!latestNotification.read && (
                  <span className="w-3 h-3 bg-yellow-400 rounded-full ml-2 flex-shrink-0"></span>
                )}
              </div>
            </div>
          )}
          {!latestNotification && notifications.length === 0 && (
            <div className="lg:hidden py-2 text-sm text-gray-500 text-center">
              No new notifications.
            </div>
          )}

          <div className="flex justify-center mt-auto pt-2 lg:mt-4 mb-1">
            {" "}
            {/* Adjusted margin for mobile */}
            <button className="border rounded-full py-2 px-4 text-xs md:text-base text-gray-700 hover:bg-gray-100 w-full">
              Show All Notifications
            </button>
          </div>
        </div>
      </aside>

      <LogoutConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
