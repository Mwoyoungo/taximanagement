"use client";

import { useState } from "react";

interface Trip {
  id: string;
  route: string;
  driver: string;
  taxi: string;
  startTime: string;
  endTime?: string;
  fare: number;
  status: "Live" | "Completed" | "Cancelled";
}

const sampleTrips: Trip[] = [
  {
    id: "TRIP-001",
    route: "Downtown to Airport",
    driver: "John Smith",
    taxi: "Toyota Camry (ABC-1234)",
    startTime: "2024-01-15 08:30",
    fare: 45,
    status: "Live",
  },
  {
    id: "TRIP-002",
    route: "City Center to Suburbs",
    driver: "Sarah Johnson",
    taxi: "Honda Accord (XYZ-7890)",
    startTime: "2024-01-15 09:15",
    endTime: "2024-01-15 09:43",
    fare: 32,
    status: "Completed",
  },
  {
    id: "TRIP-003",
    route: "Mall to Business District",
    driver: "Michael Brown",
    taxi: "Ford Escape (DEF-5678)",
    startTime: "2024-01-15 07:50",
    endTime: "2024-01-15 08:12",
    fare: 28,
    status: "Completed",
  },
  {
    id: "TRIP-004",
    route: "Airport to Downtown",
    driver: "Pending Assignment",
    taxi: "Not Assigned",
    startTime: "2024-01-15 10:00",
    fare: 0,
    status: "Cancelled",
  },
  {
    id: "TRIP-005",
    route: "Train Station to Hotel District",
    driver: "David Wilson",
    taxi: "Chevrolet Impala (GHI-9012)",
    startTime: "2024-01-15 10:30",
    fare: 22,
    status: "Live",
  },
];

const statusColors = {
  Live: "bg-[#ffc93e] text-[#0d0d0d]",
  Completed: "bg-[#d4fae8] text-[#0fa76e]",
  Cancelled: "bg-[#f5f5f5] text-[#666666]",
};

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>(sampleTrips);
  const [activeTab, setActiveTab] = useState<"live" | "history">("live");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const liveTrips = trips.filter((t) => t.status === "Live");
  const completedTrips = trips.filter((t) => t.status !== "Live");

  const filteredTrips = (activeTab === "live" ? liveTrips : completedTrips).filter(
    (trip) =>
      trip.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.taxi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-3xl sm:text-[40px] font-semibold text-[#0d0d0d] tracking-tight leading-tight">
          Trips Management
        </h1>
        <p className="text-base sm:text-lg text-[#666666] mt-2 leading-relaxed">
          Monitor live trips and search trip history
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-6 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ffc93e] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#0d0d0d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#0d0d0d]">{liveTrips.length}</p>
              <p className="text-sm text-[#666666]">Live Trips</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-6 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#d4fae8] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#0fa76e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#0d0d0d]">{completedTrips.length}</p>
              <p className="text-sm text-[#666666]">Completed Today</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-6 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f5f5f5] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#0d0d0d]">
                ${trips.reduce((sum, t) => sum + (t.fare || 0), 0)}
              </p>
              <p className="text-sm text-[#666666]">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[rgba(0,0,0,0.05)]">
        <button
          onClick={() => setActiveTab("live")}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === "live"
              ? "text-[#0d0d0d]"
              : "text-[#666666] hover:text-[#0d0d0d]"
          }`}
        >
          Live Trips
          {activeTab === "live" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffc93e]"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === "history"
              ? "text-[#0d0d0d]"
              : "text-[#666666] hover:text-[#0d0d0d]"
          }`}
        >
          Trip History
          {activeTab === "history" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffc93e]"></div>
          )}
        </button>
      </div>

      {/* Search & Filter */}
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
            placeholder="Search by route, driver, or taxi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-full text-sm text-[#0d0d0d] placeholder-[#888888] focus:outline-none focus:border-[#ffc93e] focus:ring-1 focus:ring-[#ffc93e] transition-all"
          />
        </div>
        {activeTab === "history" && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#666666]">Filter by date:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
            />
          </div>
        )}
      </div>

      {/* Trips Table */}
      <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl shadow-[rgba(0,0,0,0.03)_0px_2px_4px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.05)]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Trip ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Route</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Driver</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Taxi</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Start Time</th>
                {activeTab === "history" && (
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">End Time</th>
                )}
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Fare</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map((trip) => (
                <tr
                  key={trip.id}
                  className="border-b border-[rgba(0,0,0,0.05)] hover:bg-[#fafafa] transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-[#0d0d0d]">{trip.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#333333]">{trip.route}</td>
                  <td className="px-6 py-4 text-sm text-[#333333]">{trip.driver}</td>
                  <td className="px-6 py-4 text-sm text-[#666666]">{trip.taxi}</td>
                  <td className="px-6 py-4 text-sm text-[#666666]">{trip.startTime}</td>
                  {activeTab === "history" && (
                    <td className="px-6 py-4 text-sm text-[#666666]">
                      {trip.endTime || "--"}
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm font-medium text-[#0d0d0d]">
                    {trip.fare > 0 ? `$${trip.fare}` : "--"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[trip.status]}`}
                    >
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#888888] text-sm">
              {activeTab === "live" ? "No live trips at the moment." : "No trips found matching your search."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
