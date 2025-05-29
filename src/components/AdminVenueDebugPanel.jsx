import React, { useState } from "react";
import { X, Download, Upload, RotateCcw, Database, Eye } from "lucide-react";
import {
  getAllVenues,
  resetVenuesToDefault,
  exportVenuesData,
  importVenuesData,
} from "../data/venues";

export default function AdminVenueDebugPanel({ open, onClose }) {
  const [venues, setVenues] = useState([]);
  const [showJson, setShowJson] = useState(false);
  const [importData, setImportData] = useState("");
  const [importError, setImportError] = useState("");

  const refreshVenues = () => {
    const currentVenues = getAllVenues();
    setVenues(currentVenues);
  };

  React.useEffect(() => {
    if (open) {
      refreshVenues();
    }
  }, [open]);

  const handleExport = () => {
    const venuesJson = exportVenuesData();
    const blob = new Blob([venuesJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `venues-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    setImportError("");
    if (!importData.trim()) {
      setImportError("Please paste venue data first");
      return;
    }

    const success = importVenuesData(importData);
    if (success) {
      alert("Venues data imported successfully!");
      setImportData("");
      refreshVenues();
    } else {
      setImportError("Invalid JSON data. Please check the format.");
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all venues to default? This will delete all custom venues!"
      )
    ) {
      resetVenuesToDefault();
      refreshVenues();
      alert("Venues have been reset to default data.");
    }
  };

  const clearLocalStorage = () => {
    if (
      window.confirm(
        "Are you sure you want to clear venue storage? This will reset everything!"
      )
    ) {
      localStorage.removeItem("wevo_venues_data");
      window.location.reload(); // Reload to reinitialize
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-[1200]">
      <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-yellow-50">
          <div className="flex items-center gap-3">
            <Database className="text-yellow-600" size={24} />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Venue Debug Panel
              </h2>
              <p className="text-yellow-600 text-sm">Admin development tool</p>
            </div>
          </div>
          <button
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onClose}
            aria-label="Close panel"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Current Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-600">Total Venues</div>
                <div className="text-xl font-bold text-blue-600">
                  {venues.length}
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-600">Active Venues</div>
                <div className="text-xl font-bold text-green-600">
                  {venues.filter((v) => v.status === "active").length}
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-600">Storage Used</div>
                <div className="text-xl font-bold text-orange-600">
                  {Math.round(JSON.stringify(venues).length / 1024)}KB
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Data Management</h3>

              <button
                onClick={refreshVenues}
                className="w-full flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Eye size={16} />
                Refresh Data
              </button>

              <button
                onClick={handleExport}
                className="w-full flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download size={16} />
                Export Venues
              </button>

              <button
                onClick={handleReset}
                className="w-full flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <RotateCcw size={16} />
                Reset to Default
              </button>

              <button
                onClick={clearLocalStorage}
                className="w-full flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <X size={16} />
                Clear Storage
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Import Data</h3>

              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste JSON venue data here..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm font-mono"
              />

              {importError && (
                <p className="text-red-600 text-sm">{importError}</p>
              )}

              <button
                onClick={handleImport}
                disabled={!importData.trim()}
                className="w-full flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload size={16} />
                Import Venues
              </button>
            </div>
          </div>

          {/* View Raw Data */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Raw Data</h3>
              <button
                onClick={() => setShowJson(!showJson)}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                {showJson ? "Hide JSON" : "Show JSON"}
              </button>
            </div>

            {showJson && (
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-80 overflow-y-auto">
                <pre>{JSON.stringify(venues, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Venue List */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">All Venues</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {venues.map((venue) => (
                <div
                  key={venue.id}
                  className="bg-gray-50 p-3 rounded-lg border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {venue.name}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        ID: {venue.id}
                      </p>
                      <p className="text-xs text-gray-600">
                        Capacity: {venue.participants}
                      </p>
                      <p className="text-xs text-gray-600">
                        Department: {venue.department}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        venue.status === "active"
                          ? "bg-green-100 text-green-800"
                          : venue.status === "maintenance"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {venue.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
