"use client";

import { useState, useEffect } from "react";
import TripLogModal from "@/app/components/TripLogModal";
import { createTaxi, getAllTaxis, Taxi } from "@/app/services/taxiService";
import { getAllRoutes, Route } from "@/app/services/routeService";

const statusColors = {
  Active: "bg-[#d4fae8] text-[#0fa76e]",
  Maintenance: "bg-[#fef3c7] text-[#c37d0d]",
  Inactive: "bg-[#f5f5f5] text-[#666666]",
};

export default function TaxisPage() {
  const [taxis, setTaxis] = useState<Taxi[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Partial<Taxi>>({
    registrationNumber: "",
    model: "",
    capacity: 4,
    owner: "",
    assignedRoute: "",
    status: "Active",
  });
  const [selectedTaxi, setSelectedTaxi] = useState<Taxi | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);

  // Load taxis and routes from Firebase on mount
  useEffect(() => {
    loadTaxis();
    loadRoutes();
  }, []);

  async function loadRoutes() {
    try {
      const data = await getAllRoutes();
      setRoutes(data.filter(r => r.status === "Active"));
    } catch (error) {
      console.error("Error loading routes:", error);
    }
  }

  async function loadTaxis() {
    setLoading(true);
    try {
      const data = await getAllTaxis();
      setTaxis(data);
    } catch (error) {
      console.error("Error loading taxis:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTaxis = taxis.filter(
    (taxi) =>
      taxi.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      taxi.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      taxi.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTaxi = async () => {
    if (formData.registrationNumber && formData.model) {
      try {
        await createTaxi({
          registrationNumber: formData.registrationNumber,
          model: formData.model,
          capacity: formData.capacity || 4,
          owner: formData.owner || "Unassigned",
          assignedRoute: formData.assignedRoute || "Not Assigned",
          status: formData.status as "Active" | "Maintenance" | "Inactive",
        });
        // Reload taxis from Firebase
        await loadTaxis();
        setShowForm(false);
        setFormData({
          registrationNumber: "",
          model: "",
          capacity: 4,
          owner: "",
          assignedRoute: "",
          status: "Active",
        });
      } catch (error) {
        console.error("Error adding taxi:", error);
        alert("Failed to add taxi. Please try again.");
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-3xl sm:text-[40px] font-semibold text-[#0d0d0d] tracking-tight leading-tight">
          Taxis Management
        </h1>
        <p className="text-base sm:text-lg text-[#666666] mt-2 leading-relaxed">
          Manage your fleet, track assignments, and monitor status
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by registration, model, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-full text-sm text-[#0d0d0d] placeholder-[#888888] focus:outline-none focus:border-[#ffc93e] focus:ring-1 focus:ring-[#ffc93e] transition-all"
          />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0d0d0d] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-[rgba(0,0,0,0.06)_0px_1px_2px] whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Taxi
        </button>
      </div>

      {/* Add Taxi Form */}
      {showForm && (
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 sm:p-6 shadow-[rgba(0,0,0,0.03)_0px_2px_4px] mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#0d0d0d] tracking-tight mb-4 sm:mb-6">Add New Taxi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Registration Number</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="ABC-1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="Toyota Camry"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Owner</label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="Owner name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Assigned Route</label>
              <select
                value={formData.assignedRoute || ""}
                onChange={(e) => setFormData({ ...formData, assignedRoute: e.target.value || "Not Assigned" })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
              >
                <option value="">Select a route (optional)</option>
                {routes.length === 0 && <option value="" disabled>No routes available</option>}
                {routes.map((route) => (
                  <option key={route.id} value={route.name}>
                    {route.name} ({route.startPoint} → {route.endPoint})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Taxi["status"] })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
              >
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleAddTaxi}
              className="px-6 py-2 bg-[#0d0d0d] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-[rgba(0,0,0,0.06)_0px_1px_2px]"
            >
              Save Taxi
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 border border-[rgba(0,0,0,0.08)] text-[#0d0d0d] rounded-full text-sm font-medium hover:bg-[#f5f5f5] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table / Mobile Cards */}
      <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl shadow-[rgba(0,0,0,0.03)_0px_2px_4px] overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.05)]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Registration</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Model</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Capacity</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Owner</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Route</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTaxis.map((taxi) => (
                <tr
                  key={taxi.id}
                  className="border-b border-[rgba(0,0,0,0.05)] hover:bg-[#fafafa] transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-[#0d0d0d]">
                      {taxi.registrationNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#333333]">{taxi.model}</td>
                  <td className="px-6 py-4 text-sm text-[#666666]">{taxi.capacity} seats</td>
                  <td className="px-6 py-4 text-sm text-[#333333]">{taxi.owner}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm ${
                        taxi.assignedRoute === "Not Assigned" ? "text-[#888888]" : "text-[#333333]"
                      }`}
                    >
                      {taxi.assignedRoute}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[taxi.status]}`}
                    >
                      {taxi.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedTaxi(taxi);
                        setShowLogModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#ffc93e] text-[#0d0d0d] rounded-full text-xs font-medium hover:opacity-90 transition-opacity"
                      title="View trip logbook"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      View Logbook
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-[rgba(0,0,0,0.05)]">
          {filteredTaxis.map((taxi) => (
            <div key={taxi.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-[#0d0d0d]">{taxi.registrationNumber}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[taxi.status]}`}>
                  {taxi.status}
                </span>
              </div>
              <div className="text-sm text-[#333333]">{taxi.model}</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-[#888888]">Capacity:</span> {taxi.capacity} seats</div>
                <div><span className="text-[#888888]">Owner:</span> {taxi.owner}</div>
              </div>
              <div className="text-sm text-[#666666]">Route: {taxi.assignedRoute}</div>
              <button
                onClick={() => {
                  setSelectedTaxi(taxi);
                  setShowLogModal(true);
                }}
                className="w-full py-3 bg-[#ffc93e] text-[#0d0d0d] rounded-xl text-sm font-medium active:scale-95 transition-transform"
              >
                View Logbook
              </button>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 px-4">
            <div className="animate-spin w-8 h-8 border-2 border-[#ffc93e] border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-[#666666] mt-2">Loading taxis...</p>
          </div>
        ) : filteredTaxis.length === 0 && (
          <div className="text-center py-12 px-4">
            <p className="text-[#888888] text-sm">No taxis found. Add your first taxi above!</p>
          </div>
        )}
      </div>

      {/* Trip Log Modal */}
      <TripLogModal
        taxiId={selectedTaxi?.id || ""}
        taxiRegistration={selectedTaxi?.registrationNumber || ""}
        isOpen={showLogModal}
        onClose={() => {
          setShowLogModal(false);
          setSelectedTaxi(null);
        }}
      />
    </div>
  );
}
