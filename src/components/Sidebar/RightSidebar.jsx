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
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter notifications based on searchTerm
  const filteredUserNotifications = userNotifications.filter((notif) => {
    if (!searchTerm.trim()) return true;
    const lowerSearchTerm = searchTerm.toLowerCase();
    const data =
      typeof notif.data === "string"
        ? JSON.parse(notif.data || "{}")
        : notif.data || {};

    // Check basic fields
    if (notif.message?.toLowerCase().includes(lowerSearchTerm)) return true;
    if (notif.type?.toLowerCase().includes(lowerSearchTerm)) return true;

    // Check fields within the 'data' object
    if (data.status?.toLowerCase().includes(lowerSearchTerm)) return true;
    if (data.requestStatus?.toLowerCase().includes(lowerSearchTerm))
      return true;
    if (data.reservationStatus?.toLowerCase().includes(lowerSearchTerm))
      return true;
    if (data.eventName?.toLowerCase().includes(lowerSearchTerm)) return true;
    if (data.event?.toLowerCase().includes(lowerSearchTerm)) return true; // Common alternative for eventName
    if (data.venueName?.toLowerCase().includes(lowerSearchTerm)) return true;
    if (
      typeof data.venue === "string" &&
      data.venue.toLowerCase().includes(lowerSearchTerm)
    )
      return true;
    if (
      typeof data.venue === "object" &&
      data.venue?.name?.toLowerCase().includes(lowerSearchTerm)
    )
      return true;
    if (data.orgName?.toLowerCase().includes(lowerSearchTerm)) return true;

    return false;
  });

  const unreadCount = userNotifications.filter(
    (notif) => notif.status === "unread"
  ).length;

  return (
    <>
      <aside className="w-full lg:w-1/5 bg-white lg:border-t-0 lg:border-l p-4 md:p-6 order-1 lg:order-none flex flex-col gap-4 border-gray-200 h-auto max-h-screen overflow-y-auto lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center justify-between mb-2 gap-2 min-h-[40px]">
          <div className="text-sm lg:text-base font-medium text-gray-700 truncate flex-1 min-w-0 pr-2">
            {currentUser?.email || "Account Name"}
          </div>
          <div className="flex items-center bg-gray-100 rounded-full px-2 lg:px-3 py-1 gap-1 lg:gap-2 flex-shrink-0">
            <span className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-[#0458A9] flex items-center justify-center">
              <User size={16} className="lg:w-[18px] lg:h-[18px] text-white" />
            </span>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center hover:bg-red-100 group"
              title="Logout"
            >
              <LogOut
                size={16}
                className="lg:w-5 lg:h-5 text-gray-600 group-hover:text-red-500 transition-colors"
              />
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-[#C0C0C0] p-4 bg-white flex-grow flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-[#0458A9]">Notifications</h2>
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
                unreadCount > 0 ? "bg-red-500" : "bg-gray-400"
              }`}
            >
              {unreadCount}
            </div>
          </div>
          <div className="relative mb-3">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search for a notification"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#0458A9] focus:border-[#0458A9]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Notifications List - Max height applied for desktop, mobile list will scroll with sidebar */}
          <ul className="divide-y divide-gray-200 overflow-y-auto flex-grow pr-1 max-h-[12rem] lg:max-h-[calc(100vh-220px)]">
            {/* Desktop Notifications */}
            <div className="hidden lg:block">
              {filteredUserNotifications.length > 0 ? (
                filteredUserNotifications.map((notif) => {
                  // Parse the data if it's a string
                  const data =
                    typeof notif.data === "string"
                      ? JSON.parse(notif.data || "{}")
                      : notif.data || {};
                  const isUnread = notif.status === "unread";

                  return (
                    <li
                      key={notif.id}
                      className={`relative flex items-start p-3 my-2 rounded-xl transition-all duration-300 ease-in-out hover:shadow-md cursor-pointer active:scale-[0.98] active:duration-150
                        ${
                          highlightedId === notif.id
                            ? "bg-blue-50 shadow-blue-100"
                            : isUnread
                            ? "bg-white hover:bg-gray-50"
                            : "bg-gray-50 hover:bg-gray-100"
                        }
                        ${
                          isUnread
                            ? "border border-blue-200"
                            : "border border-transparent"
                        }
                      `}
                      onClick={() => {
                        handleNotificationClick(notif);
                        setSelectedNotif(notif);
                      }}
                    >
                      {isUnread && (
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                      )}
                      <div className="flex-1 pr-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold text-sm ${
                                isUnread ? "text-blue-600" : "text-gray-700"
                              }`}
                            >
                              {notif.type === "System" || notif.type === "WEVO"
                                ? "WEVO System"
                                : notif.type === "Admin"
                                ? "Admin Update"
                                : "Notification"}
                            </span>
                            {(() => {
                              let status = "";
                              if (data) {
                                status = (
                                  data.status ||
                                  data.requestStatus ||
                                  data.reservationStatus ||
                                  ""
                                ).toLowerCase();
                              }
                              const statusStyles = {
                                submitted: "bg-yellow-100 text-yellow-700",
                                approved: "bg-green-100 text-green-700",
                                cancelled: "bg-red-100 text-red-700",
                                rejected: "bg-orange-100 text-orange-700",
                              };
                              const normalizeStatus = (status) => {
                                if (!status) return "";
                                status = status.toLowerCase().trim();
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
                              const style =
                                statusStyles[normalizedStatus] ||
                                "bg-gray-100 text-gray-600";
                              return normalizedStatus ? (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${style} capitalize`}
                                >
                                  {normalizedStatus}
                                </span>
                              ) : null;
                            })()}
                          </div>
                        </div>
                        <div
                          className={`text-xs mb-1.5 ${
                            isUnread ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          {new Date(notif.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                        <div
                          className={`text-sm leading-snug ${
                            isUnread
                              ? "text-gray-800 font-bold"
                              : "text-gray-600"
                          }`}
                        >
                          {truncateText(notif.message, 75)}
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="text-center text-gray-500 py-6 text-sm">
                  {searchTerm
                    ? "No notifications match your search."
                    : "No notifications yet."}
                </li>
              )}
            </div>

            {/* Mobile Notifications */}
            <div className="block lg:hidden">
              {filteredUserNotifications.length > 0 ? (
                filteredUserNotifications.map((notif) => {
                  const data =
                    typeof notif.data === "string"
                      ? JSON.parse(notif.data || "{}")
                      : notif.data || {};
                  const isUnread = notif.status === "unread";

                  return (
                    <li
                      key={notif.id}
                      className={`relative flex items-start p-3 my-2 rounded-xl transition-all duration-300 ease-in-out hover:shadow-md cursor-pointer active:scale-[0.98] active:duration-150
                        ${
                          highlightedId === notif.id
                            ? "bg-blue-50 shadow-blue-100"
                            : notif.status === "unread"
                            ? "bg-white hover:bg-gray-50 border border-blue-200"
                            : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                        }
                      `}
                      onClick={() => {
                        handleNotificationClick(notif);
                        setSelectedNotif(notif);
                      }}
                    >
                      {notif.status === "unread" && (
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                      )}
                      <div className="flex-1 pr-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold text-sm ${
                                notif.status === "unread"
                                  ? "text-blue-600"
                                  : "text-gray-700"
                              }`}
                            >
                              {notif.type === "System" || notif.type === "WEVO"
                                ? "WEVO System"
                                : notif.type === "Admin"
                                ? "Admin Update"
                                : "Notification"}
                            </span>
                            {(() => {
                              let status = "";
                              if (data) {
                                status = (
                                  data.status ||
                                  data.requestStatus ||
                                  data.reservationStatus ||
                                  ""
                                ).toLowerCase();
                              }
                              const statusStyles = {
                                submitted: "bg-yellow-100 text-yellow-700",
                                approved: "bg-green-100 text-green-700",
                                cancelled: "bg-red-100 text-red-700",
                                rejected: "bg-orange-100 text-orange-700",
                              };
                              const normalizeStatus = (status) => {
                                if (!status) return "";
                                status = status.toLowerCase().trim();
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
                              const style =
                                statusStyles[normalizedStatus] ||
                                "bg-gray-100 text-gray-600";
                              return normalizedStatus ? (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${style} capitalize`}
                                >
                                  {normalizedStatus}
                                </span>
                              ) : null;
                            })()}
                          </div>
                        </div>
                        <div
                          className={`text-xs mb-1.5 ${
                            notif.status === "unread"
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          {new Date(notif.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                        <div
                          className={`text-sm leading-snug ${
                            notif.status === "unread"
                              ? "text-gray-800 font-bold"
                              : "text-gray-600"
                          }`}
                        >
                          {truncateText(notif.message, 75)}
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="text-center text-gray-500 py-6 text-sm">
                  {searchTerm
                    ? "No notifications match your search."
                    : "No notifications yet."}
                </li>
              )}
            </div>
          </ul>
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
