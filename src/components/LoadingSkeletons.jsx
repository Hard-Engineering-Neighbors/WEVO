import React from "react";

// Base skeleton shimmer animation
const SkeletonShimmer = ({ className = "", children }) => (
  <div className={`animate-pulse ${className}`}>{children}</div>
);

// Card skeleton for venue cards, request cards, etc.
export const CardSkeleton = ({ className = "" }) => (
  <SkeletonShimmer
    className={`bg-white rounded-xl shadow border border-gray-200 overflow-hidden ${className}`}
  >
    <div className="w-full h-32 bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/5"></div>
      </div>
    </div>
  </SkeletonShimmer>
);

// Table row skeleton for admin tables
export const TableRowSkeleton = ({ columns = 4 }) => (
  <SkeletonShimmer>
    <tr className="border-b border-gray-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      ))}
    </tr>
  </SkeletonShimmer>
);

// Sidebar skeleton
export const SidebarSkeleton = () => (
  <div className="w-full lg:w-1/5 bg-white shadow p-4 space-y-4">
    <SkeletonShimmer>
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-6"></div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-2">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
        </div>
      ))}
    </SkeletonShimmer>
  </div>
);

// Calendar skeleton
export const CalendarSkeleton = () => (
  <SkeletonShimmer className="bg-white rounded-2xl shadow p-6">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="flex space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="grid grid-cols-7 gap-2 mb-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded"></div>
      ))}
    </div>
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className="w-10 h-10 bg-gray-200 rounded-full"></div>
      ))}
    </div>
  </SkeletonShimmer>
);

// Stats card skeleton
export const StatsCardSkeleton = () => (
  <SkeletonShimmer className="bg-white rounded-xl shadow p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
    </div>
  </SkeletonShimmer>
);

// Event list skeleton
export const EventListSkeleton = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonShimmer key={i} className="bg-white rounded-lg border p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-1">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </SkeletonShimmer>
    ))}
  </div>
);

// Notification skeleton
export const NotificationSkeleton = ({ count = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonShimmer
        key={i}
        className="p-3 border-l-4 border-gray-200 bg-gray-50 rounded"
      >
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </SkeletonShimmer>
    ))}
  </div>
);

// Page header skeleton
export const PageHeaderSkeleton = () => (
  <SkeletonShimmer>
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </div>
      <div className="flex space-x-2 mt-4 sm:mt-0">
        <div className="w-10 h-10 bg-gray-200 rounded"></div>
        <div className="w-10 h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  </SkeletonShimmer>
);

// Search bar skeleton
export const SearchBarSkeleton = () => (
  <SkeletonShimmer className="relative">
    <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
  </SkeletonShimmer>
);

// Modal skeleton
export const ModalSkeleton = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <SkeletonShimmer className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </SkeletonShimmer>
  </div>
);

// Generic content skeleton
export const ContentSkeleton = ({ lines = 3, className = "" }) => (
  <SkeletonShimmer className={className}>
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 rounded ${
            i === lines - 1 ? "w-2/3" : "w-full"
          }`}
        ></div>
      ))}
    </div>
  </SkeletonShimmer>
);
