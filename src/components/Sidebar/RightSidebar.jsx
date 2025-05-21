import React, { useState } from "react";
import { User, Menu, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function LogoutConfirmModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
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

  return (
    <>
      <aside className="w-full lg:w-1/5 bg-white lg:border-t-0 lg:border-l p-4 md:p-6 order-1 lg:order-none flex flex-col gap-4 border-gray-400">
        {/* Account Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-base font-medium text-gray-700">
            {currentUser?.email || "Account Name"}
          </div>
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 gap-2">
            <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User size={22} className="text-gray-600" />
            </span>
            <Menu size={22} className="text-gray-600" />
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut
                size={22}
                className="text-gray-600 group-hover:text-red-600"
              />
            </button>
          </div>
        </div>
        {/* Notifications Box */}
        <div className="rounded-2xl border border-[#C0C0C0] p-4 bg-white">
          <h2 className="text-2xl font-bold text-[#0458A9] mb-2">
            Notifications
          </h2>
          <ul className="divide-y divide-gray-100">
            <li className="flex items-center py-2">
              <div className="flex-1">
                <span className="text-[#0458A9] font-bold">Admin</span>
                <span className="text-gray-400 font-medium ml-1">
                  Month, XX, XXXX at XX:XX
                </span>
                <div className="text-gray-700 text-sm">System Generated.</div>
              </div>
              <span className="w-3 h-3 bg-yellow-400 rounded-full ml-2"></span>
            </li>
            <li className="flex items-center py-2">
              <div className="flex-1">
                <span className="text-[#0458A9] font-bold">Admin</span>
                <span className="text-gray-400 font-medium ml-1">
                  Month, XX, XXXX at XX:XX
                </span>
                <div className="text-gray-700 text-sm">
                  Congratulations! lorem ipsum lorem….
                </div>
              </div>
            </li>
            <li className="flex items-center py-2">
              <div className="flex-1">
                <span className="text-[#0458A9] font-bold">Admin</span>
                <span className="text-gray-400 font-medium ml-1">
                  Month, XX, XXXX at XX:XX
                </span>
                <div className="text-gray-700 text-sm">
                  Congratulations! lorem ipsum lorem….
                </div>
              </div>
              <span className="w-3 h-3 bg-yellow-400 rounded-full ml-2"></span>
            </li>
            <li className="flex items-center py-2">
              <div className="flex-1">
                <span className="text-[#0458A9] font-bold">Admin</span>
                <span className="text-gray-400 font-medium ml-1">
                  Month, XX, XXXX at XX:XX
                </span>
                <div className="text-gray-700 text-sm">
                  Congratulations! lorem ipsum lorem….
                </div>
              </div>
            </li>
            <li className="flex items-center py-2">
              <div className="flex-1">
                <span className="text-[#0458A9] font-bold">Admin</span>
                <span className="text-gray-400 font-medium ml-1">
                  Month, XX, XXXX at XX:XX
                </span>
                <div className="text-gray-700 text-sm">
                  Congratulations! lorem ipsum ...
                </div>
              </div>
            </li>
          </ul>
          <div className="flex justify-center mt-6 mb-2">
            <button className="w-full h-9 p-2.5 bg-white rounded-2xl outline-offset-[-1px] outline-zinc-400 inline-flex justify-center items-center gap-2.5">
              see all notifications
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
