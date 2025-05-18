import React from "react";
import { User, Menu } from "lucide-react";

export default function RightSidebar() {
  return (
    <aside className="w-full lg:w-1/5 bg-white lg:border-t-0 lg:border-l p-4 md:p-6 order-1 lg:order-none flex flex-col gap-4 border-gray-400">
      {/* Account Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-base font-medium text-gray-700">Account Name</div>
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 gap-2">
          <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <User size={22} className="text-gray-600" />
          </span>
          <Menu size={22} className="text-gray-600" />
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
          <button className="w-full h-9 p-2.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-400 inline-flex justify-center items-center gap-2.5">
            see all notifications
          </button>
        </div>
      </div>
    </aside>
  );
}
