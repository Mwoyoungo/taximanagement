"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TripLog } from "@/app/types/trip-log";
import { getAllTripLogs, formatTimestamp, calculateDuration } from "@/app/services/tripLogService";
import TripLogModal from "@/app/components/TripLogModal";

const statusColors = {
  "in-progress": "bg-[#ffc93e] text-[#0d0d0d]",
  completed: "bg-[#d4fae8] text-[#0fa76e]",
  cancelled: "bg-[#f5f5f5] text-[#666666]",
};

const statusLabels = {
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function LogsPage() {
  const searchParams = useSearchParams();
  const routeFilter = searchParams.get("route");
  
  const [logs, setLogs] = useState<TripLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTaxi, setSelectedTaxi] = useState<{ id: string; registration: string } | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    setLoading(true);
    try {
      const data = await getAllTripLogs();
      setLogs(data);
    } catch (error) {
      console.error("Error loading trip logs:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.taxiRegistration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.departureLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    
    // If route filter is set from URL, match trips that use this route
    const matchesRoute = !routeFilter || 
      log.departureLocation.toLowerCase().includes(routeFilter.toLowerCase()) ||
      log.destination.toLowerCase().includes(routeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesRoute;
  });

  const stats = {
    total: logs.length,
    completed: logs.filter((l) => l.status === "completed").length,
    inProgress: logs.filter((l) => l.status === "in-progress").length,
    cancelled: logs.filter((l) => l.status === "cancelled").length,
    totalRevenue: logs.reduce((sum, l) => sum + (l.fare || 0), 0),
  };

  function openTaxiLogbook(taxiId: string, taxiRegistration: string) {
    setSelectedTaxi({ id: taxiId, registration: taxiRegistration });
    setShowLogModal(true);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-3xl sm:text-[40px] font-semibold text-[#0d0d0d] tracking-tight leading-tight">
            Trip Logs
          </h1>
          {routeFilter && (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#ffc93e] text-[#0d0d0d] rounded-full text-sm font-medium">
              <span>Route: {routeFilter}</span>
              <a href="/logs" className="hover:opacity-70">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </a>
            </div>
          )}
        </div>
        <p className="text-base sm:text-lg text-[#666666] mt-2 leading-relaxed">
          {routeFilter 
            ? `Viewing trips for route: ${routeFilter}`
            : "View and track all taxi trip records across your fleet"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <p className="text-2xl font-semibold text-[#0d0d0d]">{stats.total}</p>
          <p className="text-xs text-[#666666]">Total Trips</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <p className="text-2xl font-semibold text-[#0fa76e]">{stats.completed}</p>
          <p className="text-xs text-[#666666]">Completed</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <p className="text-2xl font-semibold text-[#ffc93e]">{stats.inProgress}</p>
          <p className="text-xs text-[#666666]">In Progress</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <p className="text-2xl font-semibold text-[#666666]">{stats.cancelled}</p>
          <p className="text-xs text-[#666666]">Cancelled</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 shadow-[rgba(0,0,0,0.03)_0px_2px_4px] col-span-2 sm:col-span-1">
          <p className="text-2xl font-semibold text-[#0fa76e]">${stats.totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-[#666666]">Total Revenue</p>
        </div>
      </div>

      {/* Filters */}
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
            placeholder="Search by taxi, driver, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-full text-sm text-[#0d0d0d] placeholder-[#888888] focus:outline-none focus:border-[#ffc93e] focus:ring-1 focus:ring-[#ffc93e] transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-full text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e]"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Logs List - Desktop Table / Mobile Cards */}
      <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl shadow-[rgba(0,0,0,0.03)_0px_2px_4px] overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-[#ffc93e] border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-[#666666] mt-2">Loading trip logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-[#666666]">No trip logs found.</p>
            <p className="text-sm text-[#888888] mt-1">Add trip entries from the Taxis page.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(0,0,0,0.05)]">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Taxi</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Route</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Driver</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Times</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Fare</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-[rgba(0,0,0,0.05)] hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openTaxiLogbook(log.taxiId, log.taxiRegistration)}
                          className="font-mono text-sm font-medium text-[#0d0d0d] hover:text-[#ffc93e] transition-colors"
                        >
                          {log.taxiRegistration}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#0d0d0d]">
                          {log.departureLocation} → {log.destination}
                        </div>
                        {log.distanceKm && (
                          <div className="text-xs text-[#666666]">{log.distanceKm} km</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#333333]">{log.driverName}</td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-[#666666]">
                          <div>Dep: {formatTimestamp(log.departureTime)}</div>
                          {log.arrivalTime && (
                            <>
                              <div>Arr: {formatTimestamp(log.arrivalTime)}</div>
                              <div className="text-[#0fa76e]">
                                {calculateDuration(log.departureTime, log.arrivalTime)}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {log.fare ? (
                          <span className="text-sm font-medium text-[#0fa76e]">${log.fare.toFixed(2)}</span>
                        ) : (
                          <span className="text-sm text-[#888888]">--</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[log.status]}`}>
                          {statusLabels[log.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-[rgba(0,0,0,0.05)]">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => openTaxiLogbook(log.taxiId, log.taxiRegistration)}
                      className="font-mono font-semibold text-[#0d0d0d] active:text-[#ffc93e]"
                    >
                      {log.taxiRegistration}
                    </button>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[log.status]}`}>
                      {statusLabels[log.status]}
                    </span>
                  </div>
                  <div className="text-sm text-[#0d0d0d]">
                    {log.departureLocation} → {log.destination}
                  </div>
                  <div className="text-sm text-[#666666]">Driver: {log.driverName}</div>
                  {log.distanceKm && (
                    <div className="text-sm text-[#888888]">Distance: {log.distanceKm} km</div>
                  )}
                  <div className="text-xs text-[#666666]">
                    <div>Dep: {formatTimestamp(log.departureTime)}</div>
                    {log.arrivalTime && (
                      <>
                        <div>Arr: {formatTimestamp(log.arrivalTime)}</div>
                        <div className="text-[#0fa76e] font-medium">
                          Duration: {calculateDuration(log.departureTime, log.arrivalTime)}
                        </div>
                      </>
                    )}
                  </div>
                  {log.fare && (
                    <div className="text-lg font-semibold text-[#0fa76e]">${log.fare.toFixed(2)}</div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Trip Log Modal */}
      <TripLogModal
        taxiId={selectedTaxi?.id || ""}
        taxiRegistration={selectedTaxi?.registration || ""}
        isOpen={showLogModal}
        onClose={() => {
          setShowLogModal(false);
          setSelectedTaxi(null);
        }}
      />
    </div>
  );
}
