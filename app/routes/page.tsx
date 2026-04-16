"use client";

import { useState } from "react";

interface Route {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  distance: string;
  estimatedTime: string;
  assignedAdmin: string;
  vehiclesCount: number;
  status: "Active" | "Inactive";
}

const sampleRoutes: Route[] = [
  {
    id: "1",
    name: "Downtown - Airport",
    startPoint: "City Center",
    endPoint: "International Airport",
    distance: "25 km",
    estimatedTime: "45 min",
    assignedAdmin: "Route Admin A",
    vehiclesCount: 8,
    status: "Active",
  },
  {
    id: "2",
    name: "City Center - Suburbs",
    startPoint: "Main Square",
    endPoint: "North Suburbs",
    distance: "18 km",
    estimatedTime: "30 min",
    assignedAdmin: "Route Admin B",
    vehiclesCount: 6,
    status: "Active",
  },
  {
    id: "3",
    name: "Mall District Loop",
    startPoint: "Shopping Mall",
    endPoint: "Business District",
    distance: "12 km",
    estimatedTime: "20 min",
    assignedAdmin: "Unassigned",
    vehiclesCount: 0,
    status: "Inactive",
  },
];

const statusColors = {
  Active: "bg-[#d4fae8] text-[#0fa76e]",
  Inactive: "bg-[#f5f5f5] text-[#666666]",
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>(sampleRoutes);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Partial<Route>>({
    name: "",
    startPoint: "",
    endPoint: "",
    distance: "",
    estimatedTime: "",
    assignedAdmin: "",
    status: "Active",
  });

  const filteredRoutes = routes.filter(
    (route) =>
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.startPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.endPoint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRoute = () => {
    if (formData.name && formData.startPoint && formData.endPoint) {
      const newRoute: Route = {
        id: Date.now().toString(),
        name: formData.name,
        startPoint: formData.startPoint,
        endPoint: formData.endPoint,
        distance: formData.distance || "0 km",
        estimatedTime: formData.estimatedTime || "0 min",
        assignedAdmin: formData.assignedAdmin || "Unassigned",
        vehiclesCount: 0,
        status: formData.status as "Active" | "Inactive",
      };
      setRoutes([...routes, newRoute]);
      setShowForm(false);
      setFormData({
        name: "",
        startPoint: "",
        endPoint: "",
        distance: "",
        estimatedTime: "",
        assignedAdmin: "",
        status: "Active",
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-3xl sm:text-[40px] font-semibold text-[#0d0d0d] tracking-tight leading-tight">
          Routes Management
        </h1>
        <p className="text-base sm:text-lg text-[#666666] mt-2 leading-relaxed">
          Create routes, assign admins, and manage vehicle allocation
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
            placeholder="Search by route name or location..."
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
          Create Route
        </button>
      </div>

      {/* Add Route Form */}
      {showForm && (
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 sm:p-6 shadow-[rgba(0,0,0,0.03)_0px_2px_4px] mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#0d0d0d] tracking-tight mb-4 sm:mb-6">Create New Route</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Route Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="e.g., Downtown - Airport"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Start Point</label>
              <input
                type="text"
                value={formData.startPoint}
                onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="Starting location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">End Point</label>
              <input
                type="text"
                value={formData.endPoint}
                onChange={(e) => setFormData({ ...formData, endPoint: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="Destination"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Distance</label>
              <input
                type="text"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="e.g., 25 km"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Estimated Time</label>
              <input
                type="text"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="e.g., 45 min"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Assign Route Admin</label>
              <select
                value={formData.assignedAdmin}
                onChange={(e) => setFormData({ ...formData, assignedAdmin: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
              >
                <option value="">Select admin</option>
                <option value="Route Admin A">Route Admin A</option>
                <option value="Route Admin B">Route Admin B</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleAddRoute}
              className="px-6 py-2 bg-[#0d0d0d] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-[rgba(0,0,0,0.06)_0px_1px_2px]"
            >
              Create Route
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

      {/* Table */}
      <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl shadow-[rgba(0,0,0,0.03)_0px_2px_4px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.05)]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Route Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Start Point</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">End Point</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Distance</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Est. Time</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Admin</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Vehicles</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((route) => (
                <tr
                  key={route.id}
                  className="border-b border-[rgba(0,0,0,0.05)] hover:bg-[#fafafa] transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-sm text-[#0d0d0d]">{route.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#333333]">{route.startPoint}</td>
                  <td className="px-6 py-4 text-sm text-[#333333]">{route.endPoint}</td>
                  <td className="px-6 py-4 text-sm text-[#666666]">{route.distance}</td>
                  <td className="px-6 py-4 text-sm text-[#666666]">{route.estimatedTime}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm ${
                        route.assignedAdmin === "Unassigned" ? "text-[#888888]" : "text-[#333333]"
                      }`}
                    >
                      {route.assignedAdmin}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#0d0d0d]">{route.vehiclesCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[route.status]}`}
                    >
                      {route.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRoutes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#888888] text-sm">No routes found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
