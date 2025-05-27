import React, { useState, useEffect } from "react";
import { User, Menu, LogOut, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { fetchNotifications, markNotificationAsRead } from "../../api/requests";
import NotificationDetailsModal from "../NotificationDetailsModal";
import { supabase } from "../../supabase/supabaseClient";

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

function useRealtimeNotifications(userId, setNotifications, setHighlightedId) {
  React.useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("user_notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => {
              // Prevent duplicates
              if (prev.some((n) => n.id === payload.new.id)) return prev;
              return [payload.new, ...prev];
            });
            setHighlightedId(payload.new.id);
            setTimeout(() => setHighlightedId(null), 2000);
          }
          if (payload.eventType === "DELETE") {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== payload.old.id)
            );
          }
          if (payload.eventType === "UPDATE") {
            setNotifications((prev) =>
              prev.map((n) => (n.id === payload.new.id ? payload.new : n))
            );
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, setNotifications, setHighlightedId]);
}

export default function RightSidebar({ onNotificationClick }) {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    fetchNotifications(currentUser.id).then(setNotifications);
  }, [currentUser]);

  useRealtimeNotifications(currentUser?.id, setNotifications, setHighlightedId);

  const handleNotificationClick = async (notif) => {
    if (notif.status === "unread") {
      await markNotificationAsRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, status: "read" } : n))
      );
    }
    if (onNotificationClick) onNotificationClick(notif);
  };

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
    navigate("/login", { replace: true });
  };

  // Find the latest notification for mobile view
  // Prioritize the latest unread, then the latest overall if no unread
  const latestUnread = notifications
    .filter((n) => n.status === "unread")
    .sort((a, b) => b.id - a.id)[0];
  const latestNotification =
    latestUnread ||
    (notifications.length > 0
      ? notifications.sort((a, b) => b.id - a.id)[0]
      : null);

  const userNotifications = notifications.filter(
    (notif) => notif.role === "user"
  );
  const visibleNotifications = showAll
    ? userNotifications
    : userNotifications.slice(0, 5);

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
          {/* Desktop & Mobile: Full Notifications List */}
          <ul
            className="divide-y divide-gray-200 overflow-y-auto flex-grow pr-1"
            style={{ maxHeight: showAll ? "none" : "calc(100vh - 350px)" }}
          >
            {visibleNotifications.map((notif) => {
              // Parse the data if it's a string
              const data =
                typeof notif.data === "string"
                  ? JSON.parse(notif.data)
                  : notif.data;
              const isUnread = notif.status === "unread";

              return (
                <li
                  key={notif.id}
                  className={`flex items-start py-3 cursor-pointer hover:bg-gray-50 transition-all duration-500 ${
                    highlightedId === notif.id ? "bg-yellow-50" : ""
                  }`}
                  onClick={() => {
                    handleNotificationClick(notif);
                    setSelectedNotif(notif);
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-[#0458A9] ${
                            isUnread ? "text-base" : "text-sm"
                          }`}
                        >
                          {notif.type === "System" || notif.type === "WEVO"
                            ? "WEVO"
                            : notif.type === "Admin"
                            ? "Admin"
                            : ""}
                        </span>
                        {(() => {
                          let status = "";
                          // Try to get status from different possible locations in the data
                          if (data) {
                            // Debug log to see what status we're getting
                            console.log("Notification status data:", data);
                            status = (
                              data.status ||
                              data.requestStatus ||
                              data.reservationStatus ||
                              ""
                            ).toLowerCase();
                            // Debug log to see the extracted status
                            console.log("Extracted status:", status);
                          }
                          const statusStyles = {
                            submitted:
                              "bg-yellow-100 text-yellow-800 border border-yellow-200",
                            approved:
                              "bg-green-100 text-green-800 border border-green-200",
                            cancelled:
                              "bg-red-100 text-red-800 border border-red-200",
                            rejected:
                              "bg-red-100 text-red-800 border border-red-200",
                          };

                          // Normalize the status to handle different variations
                          const normalizeStatus = (status) => {
                            if (!status) return "";
                            status = status.toLowerCase().trim();
                            // Map various status formats to our standard ones
                            const statusMap = {
                              pending: "submitted",
                              submitted: "submitted",
                              approve: "approved",
                              approved: "approved",
                              cancel: "cancelled",
                              cancelled: "cancelled",
                              canceled: "cancelled",
                              reject: "rejected",
                              rejected: "rejected",
                            };
                            return statusMap[status] || status;
                          };

                          const normalizedStatus = normalizeStatus(status);
                          // Debug log to see the normalized status
                          console.log("Normalized status:", normalizedStatus);

                          const style = statusStyles[normalizedStatus] || "";
                          return normalizedStatus ? (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${style} capitalize`}
                            >
                              {normalizedStatus}
                            </span>
                          ) : null;
                        })()}
                      </div>
                      {isUnread && (
                        <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full flex-shrink-0"></span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mb-1">
                      {new Date(notif.created_at).toLocaleString()}
                    </div>
                    <div
                      className={`text-gray-700 ${
                        isUnread ? "font-medium" : ""
                      } text-sm`}
                    >
                      {truncateText(notif.message, 85)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {/* Show All/Show Less button for both desktop and mobile */}
          {userNotifications.length > 5 && (
            <div className="flex justify-center mt-auto pt-2 lg:mt-4 mb-1">
              <button
                className="w-full py-2.5 bg-white rounded-lg border border-gray-300 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                onClick={() => setShowAll((v) => !v)}
              >
                {showAll ? "Show Less" : "Show All Notifications"}
              </button>
            </div>
          )}
        </div>
      </aside>

      {selectedNotif && (
        <NotificationDetailsModal
          notif={selectedNotif}
          onClose={() => setSelectedNotif(null)}
        />
      )}

      <LogoutConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
