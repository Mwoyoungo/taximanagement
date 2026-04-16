"use client";

import { useState } from "react";

interface Taxi {
  id: string;
  registrationNumber: string;
  model: string;
  capacity: number;
  owner: string;
  assignedRoute: string;
  status: "Active" | "Maintenance" | "Inactive";
}

const sampleTaxis: Taxi[] = [
  {
    id: "1",
    registrationNumber: "ABC-1234",
    model: "Toyota Camry",
    capacity: 4,
    owner: "John's Fleet",
    assignedRoute: "Downtown - Airport",
    status: "Active",
  },
  {
    id: "2",
    registrationNumber: "XYZ-7890",
    model: "Honda Accord",
    capacity: 4,
    owner: "City Taxis Ltd",
    assignedRoute: "City Center - Suburbs",
    status: "Active",
  },
  {
    id: "3",
    registrationNumber: "DEF-5678",
    model: "Ford Escape",
    capacity: 5,
    owner: "John's Fleet",
    assignedRoute: "Mall District",
    status: "Maintenance",
  },
  {
    id: "4",
    registrationNumber: "GHI-9012",
    model: "Chevrolet Impala",
    capacity: 4,
    owner: "Metro Cars",
    assignedRoute: "Not Assigned",
    status: "Inactive",
  },
];

const statusColors = {
  Active: "bg-[#d4fae8] text-[#0fa76e]",
  Maintenance: "bg-[#fef3c7] text-[#c37d0d]",
  Inactive: "bg-[#f5f5f5] text-[#666666]",
};

export default function TaxisPage() {
  const [taxis, setTaxis] = useState<Taxi[]>(sampleTaxis);
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

  const filteredTaxis = taxis.filter(
    (taxi) =>
      taxi.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      taxi.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      taxi.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTaxi = () => {
    if (formData.registrationNumber && formData.model) {
      const newTaxi: Taxi = {
        id: Date.now().toString(),
        registrationNumber: formData.registrationNumber,
        model: formData.model,
        capacity: formData.capacity || 4,
        owner: formData.owner || "Unassigned",
        assignedRoute: formData.assignedRoute || "Not Assigned",
        status: formData.status as "Active" | "Maintenance" | "Inactive",
      };
      setTaxis([...taxis, newTaxi]);
      setShowForm(false);
      setFormData({
        registrationNumber: "",
        model: "",
        capacity: 4,
        owner: "",
        assignedRoute: "",
        status: "Active",
      });
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
            className="w-full pl-12 pr-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-full text-sm text-[#0d0d0d] placeholder-[#888888] focus:outline-none focus:border-[#18E299] focus:ring-1 focus:ring-[#18E299] transition-all"
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
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#18E299] transition-colors"
                placeholder="ABC-1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#18E299] transition-colors"
                placeholder="Toyota Camry"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#18E299] transition-colors"
                placeholder="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Owner</label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#18E299] transition-colors"
                placeholder="Owner name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Assigned Route</label>
              <input
                type="text"
                value={formData.assignedRoute}
                onChange={(e) => setFormData({ ...formData, assignedRoute: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#18E299] transition-colors"
                placeholder="Route name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Taxi["status"] })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#18E299] transition-colors"
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

      {/* Table */}
      <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl shadow-[rgba(0,0,0,0.03)_0px_2px_4px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.05)]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Registration</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Model</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Capacity</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Owner</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Route</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Status</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTaxis.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#888888] text-sm">No taxis found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
