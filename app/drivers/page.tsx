"use client";

import { useState } from "react";

interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  assignedTaxi: string;
  assignedRoute: string;
  status: "Active" | "Inactive";
}

const sampleDrivers: Driver[] = [
  {
    id: "1",
    name: "John Smith",
    phone: "+1 555-0101",
    licenseNumber: "DL-123456",
    assignedTaxi: "Toyota Camry (ABC-1234)",
    assignedRoute: "Downtown - Airport",
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    phone: "+1 555-0102",
    licenseNumber: "DL-789012",
    assignedTaxi: "Honda Accord (XYZ-7890)",
    assignedRoute: "City Center - Suburbs",
    status: "Active",
  },
  {
    id: "3",
    name: "Michael Brown",
    phone: "+1 555-0103",
    licenseNumber: "DL-345678",
    assignedTaxi: "Not Assigned",
    assignedRoute: "Not Assigned",
    status: "Inactive",
  },
];

const statusColors = {
  Active: "bg-[#d4fae8] text-[#0fa76e]",
  Inactive: "bg-[#f5f5f5] text-[#666666]",
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(sampleDrivers);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Partial<Driver>>({
    name: "",
    phone: "",
    licenseNumber: "",
    assignedTaxi: "",
    assignedRoute: "",
    status: "Active",
  });

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDriver = () => {
    if (formData.name && formData.phone && formData.licenseNumber) {
      const newDriver: Driver = {
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        licenseNumber: formData.licenseNumber,
        assignedTaxi: formData.assignedTaxi || "Not Assigned",
        assignedRoute: formData.assignedRoute || "Not Assigned",
        status: formData.status as "Active" | "Inactive",
      };
      setDrivers([...drivers, newDriver]);
      setShowForm(false);
      setFormData({
        name: "",
        phone: "",
        licenseNumber: "",
        assignedTaxi: "",
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
          Drivers Management
        </h1>
        <p className="text-base sm:text-lg text-[#666666] mt-2 leading-relaxed">
          Manage drivers, assign taxis and routes
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
            placeholder="Search by name, license, or phone..."
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
          Add Driver
        </button>
      </div>

      {/* Add Driver Form */}
      {showForm && (
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 sm:p-6 shadow-[rgba(0,0,0,0.03)_0px_2px_4px] mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#0d0d0d] tracking-tight mb-4 sm:mb-6">Add New Driver</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="Enter driver name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="+1 555-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">License Number</label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="DL-000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Assigned Taxi</label>
              <input
                type="text"
                value={formData.assignedTaxi}
                onChange={(e) => setFormData({ ...formData, assignedTaxi: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="Vehicle model - Plate"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Assigned Route</label>
              <input
                type="text"
                value={formData.assignedRoute}
                onChange={(e) => setFormData({ ...formData, assignedRoute: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="Route name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Driver["status"] })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleAddDriver}
              className="px-6 py-2 bg-[#0d0d0d] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-[rgba(0,0,0,0.06)_0px_1px_2px]"
            >
              Save Driver
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
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Driver Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">License</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Phone</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Assigned Taxi</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Assigned Route</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr
                  key={driver.id}
                  className="border-b border-[rgba(0,0,0,0.05)] hover:bg-[#fafafa] transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-sm text-[#0d0d0d]">{driver.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-[#333333]">{driver.licenseNumber}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666666]">{driver.phone}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm ${
                        driver.assignedTaxi === "Not Assigned" ? "text-[#888888]" : "text-[#333333]"
                      }`}
                    >
                      {driver.assignedTaxi}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm ${
                        driver.assignedRoute === "Not Assigned" ? "text-[#888888]" : "text-[#333333]"
                      }`}
                    >
                      {driver.assignedRoute}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[driver.status]}`}
                    >
                      {driver.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDrivers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#888888] text-sm">No drivers found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
