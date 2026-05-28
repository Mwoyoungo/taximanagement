"use client";

import { useState, useEffect } from "react";
import { TripLog, TripLogInput, TripStatus } from "@/app/types/trip-log";
import {
  createTripLog,
  getTripLogsByTaxi,
  updateTripLog,
  deleteTripLog,
  completeTrip,
  formatTimestamp,
  calculateDuration,
} from "@/app/services/tripLogService";
import { getAllRoutes, Route } from "@/app/services/routeService";
import { Timestamp } from "firebase/firestore";

interface TripLogModalProps {
  taxiId: string;
  taxiRegistration: string;
  isOpen: boolean;
  onClose: () => void;
}

const statusColors: Record<TripStatus, string> = {
  "in-progress": "bg-[#ffc93e] text-[#0d0d0d]",
  completed: "bg-[#d4fae8] text-[#0fa76e]",
  cancelled: "bg-[#f5f5f5] text-[#666666]",
};

const statusLabels: Record<TripStatus, string> = {
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function TripLogModal({ taxiId, taxiRegistration, isOpen, onClose }: TripLogModalProps) {
  const [logs, setLogs] = useState<TripLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLog, setEditingLog] = useState<TripLog | null>(null);
  const [completingLog, setCompletingLog] = useState<TripLog | null>(null);

  // Form state
  const [formData, setFormData] = useState<TripLogInput>({
    taxiId,
    taxiRegistration,
    driverId: "",
    driverName: "",
    departureLocation: "",
    destination: "",
    routeId: "",
    routeName: "",
    departureTime: new Date(),
    arrivalTime: null,
    distanceKm: undefined,
    fare: undefined,
    notes: "",
    status: "in-progress",
  });
  
  // Routes for selector
  const [routes, setRoutes] = useState<Route[]>([]);

  // Completion form state
  const [completionData, setCompletionData] = useState({
    arrivalTime: new Date().toISOString().slice(0, 16),
    distanceKm: "",
    fare: "",
  });

  useEffect(() => {
    if (isOpen && taxiId) {
      loadLogs();
      loadRoutes();
    }
  }, [isOpen, taxiId]);
  
  async function loadRoutes() {
    try {
      const data = await getAllRoutes();
      setRoutes(data.filter(r => r.status === "Active"));
    } catch (error) {
      console.error("Error loading routes:", error);
    }
  }

  async function loadLogs() {
    setLoading(true);
    try {
      const data = await getTripLogsByTaxi(taxiId);
      setLogs(data);
    } catch (error) {
      console.error("Error loading trip logs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddLog(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createTripLog(formData);
      setShowAddForm(false);
      resetForm();
      await loadLogs();
    } catch (error) {
      console.error("Error creating trip log:", error);
      alert("Failed to create trip log. Please try again.");
    }
  }

  async function handleUpdateLog(e: React.FormEvent) {
    e.preventDefault();
    if (!editingLog?.id) return;

    try {
      await updateTripLog(editingLog.id, formData);
      setEditingLog(null);
      resetForm();
      await loadLogs();
    } catch (error) {
      console.error("Error updating trip log:", error);
      alert("Failed to update trip log. Please try again.");
    }
  }

  async function handleDeleteLog(id: string) {
    if (!confirm("Are you sure you want to delete this trip log?")) return;

    try {
      await deleteTripLog(id);
      await loadLogs();
    } catch (error) {
      console.error("Error deleting trip log:", error);
      alert("Failed to delete trip log. Please try again.");
    }
  }

  async function handleCompleteTrip(e: React.FormEvent) {
    e.preventDefault();
    if (!completingLog?.id) return;

    try {
      // Parse numbers safely to avoid NaN
      const distanceKm = completionData.distanceKm.trim() !== ""
        ? parseFloat(completionData.distanceKm)
        : undefined;
      const fare = completionData.fare.trim() !== ""
        ? parseFloat(completionData.fare)
        : undefined;

      await completeTrip(
        completingLog.id,
        new Date(completionData.arrivalTime),
        distanceKm && !isNaN(distanceKm) ? distanceKm : undefined,
        fare && !isNaN(fare) ? fare : undefined
      );
      setCompletingLog(null);
      setCompletionData({ arrivalTime: new Date().toISOString().slice(0, 16), distanceKm: "", fare: "" });
      await loadLogs();
    } catch (error) {
      console.error("Error completing trip:", error);
      alert("Failed to complete trip. Please try again.");
    }
  }

  function resetForm() {
    setFormData({
      taxiId,
      taxiRegistration,
      driverId: "",
      driverName: "",
      departureLocation: "",
      destination: "",
      departureTime: new Date(),
      arrivalTime: null,
      distanceKm: undefined,
      fare: undefined,
      notes: "",
      status: "in-progress",
    });
  }

  function startEditing(log: TripLog) {
    setEditingLog(log);
    setFormData({
      taxiId: log.taxiId,
      taxiRegistration: log.taxiRegistration,
      driverId: log.driverId,
      driverName: log.driverName,
      departureLocation: log.departureLocation,
      destination: log.destination,
      departureTime: log.departureTime?.toDate() || new Date(),
      arrivalTime: log.arrivalTime?.toDate() || null,
      distanceKm: log.distanceKm,
      fare: log.fare,
      notes: log.notes || "",
      status: log.status,
    });
    setShowAddForm(true);
  }

  function startCompleting(log: TripLog) {
    setCompletingLog(log);
    setCompletionData({
      arrivalTime: new Date().toISOString().slice(0, 16),
      distanceKm: log.distanceKm?.toString() || "",
      fare: log.fare?.toString() || "",
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#0d0d0d]">Trip Logbook</h2>
            <p className="text-sm text-[#666666]">Taxi: {taxiRegistration}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-[#fafafa] rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-[#0d0d0d] mb-4">
                {editingLog ? "Edit Trip Log" : "Add New Trip Entry"}
              </h3>
              <form onSubmit={editingLog ? handleUpdateLog : handleAddLog} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">Driver Name</label>
                    <input
                      type="text"
                      required
                      value={formData.driverName}
                      onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                      className="w-full px-4 py-2 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm focus:outline-none focus:border-[#ffc93e]"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">Driver ID</label>
                    <input
                      type="text"
                      value={formData.driverId}
                      onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                      className="w-full px-4 py-2 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm focus:outline-none focus:border-[#ffc93e]"
                      placeholder="DRV-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">Departure Location</label>
                    <input
                      type="text"
                      required
                      value={formData.departureLocation}
                      onChange={(e) => setFormData({ ...formData, departureLocation: e.target.value })}
                      className="w-full px-4 py-2 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm focus:outline-none focus:border-[#ffc93e]"
                      placeholder="Downtown Terminal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">Destination</label>
                    <input
                      type="text"
                      required
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-4 py-2 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm focus:outline-none focus:border-[#ffc93e]"
                      placeholder="Airport"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">Route (Optional)</label>
                    <select
                      value={formData.routeId || ""}
                      onChange={(e) => {
                        const selectedRoute = routes.find(r => r.id === e.target.value);
                        setFormData({ 
                          ...formData, 
                          routeId: e.target.value || undefined,
                          routeName: selectedRoute?.name || undefined,
                          // Auto-fill departure and destination from route
                          departureLocation: selectedRoute?.startPoint || formData.departureLocation,
                          destination: selectedRoute?.endPoint || formData.destination
                        });
                      }}
                      className="w-full px-4 py-2 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm focus:outline-none focus:border-[#ffc93e]"
                    >
                      <option value="">Select a route (optional)</option>
                      {routes.map((route) => (
                        <option key={route.id} value={route.id}>
                          {route.name} ({route.startPoint} → {route.endPoint})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">Departure Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.departureTime.toISOString().slice(0, 16)}
                      onChange={(e) => setFormData({ ...formData, departureTime: new Date(e.target.value) })}
                      className="w-full px-4 py-2 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm focus:outline-none focus:border-[#ffc93e]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as TripStatus })}
                      className="w-full px-4 py-2 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm focus:outline-none focus:border-[#ffc93e]"
                    >
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  {formData.status === "completed" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">Arrival Time</label>
                        <input
                          type="datetime-local"
                          value={formData.arrivalTime?.toISOString().slice(0, 16) || ""}
                          onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value ? new Date(e.target.value) : null })}
                          className="w-full px-4 py-2 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm focus:outline-none focus:border-[#ffc93e]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">Distance (km)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.distanceKm ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            const num = value === "" ? undefined : parseFloat(value);
                            setFormData({ ...formData, distanceKm: num && !isNaN(num) ? num : undefined });
                          }}
                          className="w-full px-4 py-2 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm focus:outline-none focus:border-[#ffc93e]"
                          placeholder="15.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-2">Fare ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.fare ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            const num = value === "" ? undefined : parseFloat(value);
                            setFormData({ ...formData, fare: num && !isNaN(num) ? num : undefined });
                          }}
                          className="w-full px-4 py-2 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm focus:outline-none focus:border-[#ffc93e]"
                          placeholder="25.00"
                        />
                      </div>
                    </>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#333333] mb-2">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm focus:outline-none focus:border-[#ffc93e] resize-none"
                      rows={2}
                      placeholder="Any additional notes..."
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0d0d0d] text-white rounded-full text-sm font-medium hover:opacity-90"
                  >
                    {editingLog ? "Update Entry" : "Add Entry"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingLog(null);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-[rgba(0,0,0,0.08)] text-[#0d0d0d] rounded-full text-sm font-medium hover:bg-[#f5f5f5]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Complete Trip Form */}
          {completingLog && (
            <div className="bg-[#d4fae8] rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-[#0d0d0d] mb-4">Complete Trip</h3>
              <p className="text-sm text-[#333333] mb-4">
                From: {completingLog.departureLocation} → To: {completingLog.destination}
              </p>
              <form onSubmit={handleCompleteTrip} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">Arrival Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={completionData.arrivalTime}
                      onChange={(e) => setCompletionData({ ...completionData, arrivalTime: e.target.value })}
                      className="w-full px-4 py-2 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm focus:outline-none focus:border-[#ffc93e]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">Distance (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={completionData.distanceKm}
                      onChange={(e) => setCompletionData({ ...completionData, distanceKm: e.target.value })}
                      className="w-full px-4 py-2 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm focus:outline-none focus:border-[#ffc93e]"
                      placeholder="15.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">Fare ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={completionData.fare}
                      onChange={(e) => setCompletionData({ ...completionData, fare: e.target.value })}
                      className="w-full px-4 py-2 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm focus:outline-none focus:border-[#ffc93e]"
                      placeholder="25.00"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0fa76e] text-white rounded-full text-sm font-medium hover:opacity-90"
                  >
                    Mark as Completed
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompletingLog(null)}
                    className="px-6 py-2 border border-[rgba(0,0,0,0.08)] text-[#0d0d0d] rounded-full text-sm font-medium hover:bg-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Action Buttons */}
          {!showAddForm && !completingLog && (
            <div className="mb-6">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-5 py-2 bg-[#0d0d0d] text-white rounded-full text-sm font-medium hover:opacity-90"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Trip Entry
              </button>
            </div>
          )}

          {/* Logs List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-[#ffc93e] border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-[#666666] mt-2">Loading trip logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 bg-[#fafafa] rounded-xl">
              <p className="text-[#666666]">No trip logs found for this taxi.</p>
              <p className="text-sm text-[#888888] mt-1">Add your first trip entry above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white border border-[rgba(0,0,0,0.05)] rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[log.status]}`}>
                          {statusLabels[log.status]}
                        </span>
                        <span className="text-xs text-[#888888]">
                          {formatTimestamp(log.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#0d0d0d]">
                        <span className="font-medium">{log.departureLocation}</span>
                        <svg className="w-4 h-4 text-[#ffc93e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="font-medium">{log.destination}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[#666666]">
                        <span>Driver: {log.driverName}</span>
                        <span>Departure: {formatTimestamp(log.departureTime)}</span>
                        {log.arrivalTime && (
                          <>
                            <span>Arrival: {formatTimestamp(log.arrivalTime)}</span>
                            <span className="text-[#0fa76e] font-medium">
                              Duration: {calculateDuration(log.departureTime, log.arrivalTime)}
                            </span>
                          </>
                        )}
                      </div>
                      {(log.distanceKm || log.fare) && (
                        <div className="flex gap-4 mt-2 text-sm">
                          {log.distanceKm && (
                            <span className="text-[#0d0d0d]">Distance: {log.distanceKm} km</span>
                          )}
                          {log.fare && (
                            <span className="text-[#0fa76e] font-medium">Fare: ${log.fare.toFixed(2)}</span>
                          )}
                        </div>
                      )}
                      {log.notes && (
                        <p className="text-sm text-[#888888] mt-2 italic">{log.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {log.status === "in-progress" && (
                        <button
                          onClick={() => startCompleting(log)}
                          className="px-4 py-2 bg-[#d4fae8] text-[#0fa76e] rounded-full text-sm font-medium hover:bg-[#c4ead8]"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => startEditing(log)}
                        className="p-2 text-[#666666] hover:bg-[#f5f5f5] rounded-full"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => log.id && handleDeleteLog(log.id)}
                        className="p-2 text-[#d45656] hover:bg-[#fce8e8] rounded-full"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
