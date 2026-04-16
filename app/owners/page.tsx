"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  taxiCount: number;
  driverCount: number;
  totalEarnings: string;
  status: "Active" | "Inactive";
  joinDate: string;
}

const sampleOwners: Owner[] = [
  {
    id: "1",
    name: "John's Fleet",
    email: "john@fleets.com",
    phone: "+1 234-567-8901",
    company: "John's Taxi Services Ltd",
    taxiCount: 12,
    driverCount: 15,
    totalEarnings: "$45,230",
    status: "Active",
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    name: "City Taxis Ltd",
    email: "contact@citytaxis.com",
    phone: "+1 234-567-8902",
    company: "City Taxis Corporation",
    taxiCount: 28,
    driverCount: 32,
    totalEarnings: "$128,450",
    status: "Active",
    joinDate: "2022-08-20",
  },
  {
    id: "3",
    name: "Metro Cars",
    email: "info@metrocars.com",
    phone: "+1 234-567-8903",
    company: "Metro Transportation Inc",
    taxiCount: 8,
    driverCount: 10,
    totalEarnings: "$23,890",
    status: "Inactive",
    joinDate: "2023-06-10",
  },
];

const statusColors = {
  Active: "bg-[#d4fae8] text-[#0fa76e]",
  Inactive: "bg-[#f5f5f5] text-[#666666]",
};

export default function OwnersPage() {
  const { user, hasPermission } = useAuth();
  const [owners, setOwners] = useState<Owner[]>(sampleOwners);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Partial<Owner>>({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Active",
  });

  // Only Director and Super Admin can access
  if (!hasPermission(["Director", "Super Admin"])) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h1 className="text-xl font-semibold text-red-800 mb-2">Access Denied</h1>
          <p className="text-red-600">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddOwner = () => {
    if (formData.name && formData.email) {
      const newOwner: Owner = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        company: formData.company || formData.name,
        taxiCount: 0,
        driverCount: 0,
        totalEarnings: "$0",
        status: formData.status as "Active" | "Inactive",
        joinDate: new Date().toISOString().split("T")[0],
      };
      setOwners([...owners, newOwner]);
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "Active",
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-3xl sm:text-[40px] font-semibold text-[#0d0d0d] tracking-tight leading-tight">
          Fleet Owners
        </h1>
        <p className="text-base sm:text-lg text-[#666666] mt-2 leading-relaxed">
          Manage taxi fleet owners and their performance
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <p className="text-2xl font-semibold text-[#0d0d0d]">{owners.length}</p>
          <p className="text-sm text-[#666666]">Total Owners</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <p className="text-2xl font-semibold text-[#0d0d0d]">
            {owners.filter((o) => o.status === "Active").length}
          </p>
          <p className="text-sm text-[#666666]">Active Owners</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <p className="text-2xl font-semibold text-[#0d0d0d]">
            {owners.reduce((sum, o) => sum + o.taxiCount, 0)}
          </p>
          <p className="text-sm text-[#666666]">Total Taxis</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <p className="text-2xl font-semibold text-[#0d0d0d]">
            {owners.reduce((sum, o) => sum + o.driverCount, 0)}
          </p>
          <p className="text-sm text-[#666666]">Total Drivers</p>
        </div>
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
            placeholder="Search by name, email, or company..."
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
          Add Owner
        </button>
      </div>

      {/* Add Owner Form */}
      {showForm && (
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 sm:p-6 shadow-[rgba(0,0,0,0.03)_0px_2px_4px] mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#0d0d0d] tracking-tight mb-4 sm:mb-6">Add New Owner</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Owner Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="Enter owner name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="owner@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="+1 234-567-8900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Company Name</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="Company Ltd"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Owner["status"] })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleAddOwner}
              className="px-6 py-2 bg-[#0d0d0d] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-[rgba(0,0,0,0.06)_0px_1px_2px]"
            >
              Save Owner
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

      {/* Owners Table */}
      <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl shadow-[rgba(0,0,0,0.03)_0px_2px_4px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.05)]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Owner</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Company</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Fleet</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Earnings</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredOwners.map((owner) => (
                <tr key={owner.id} className="border-b border-[rgba(0,0,0,0.05)] last:border-0 hover:bg-[#fafafa]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#d4fae8] rounded-xl flex items-center justify-center">
                        <span className="text-[#0fa76e] font-semibold text-sm">
                          {owner.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0d0d0d]">{owner.name}</p>
                        <p className="text-xs text-[#888888]">{owner.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#0d0d0d]">{owner.company}</p>
                    <p className="text-xs text-[#888888]">{owner.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#0d0d0d]">{owner.taxiCount}</p>
                        <p className="text-xs text-[#888888]">Taxis</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0d0d0d]">{owner.driverCount}</p>
                        <p className="text-xs text-[#888888]">Drivers</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#0fa76e]">{owner.totalEarnings}</p>
                    <p className="text-xs text-[#888888]">Total Revenue</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[owner.status]}`}>
                      {owner.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#0d0d0d]">{owner.joinDate}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOwners.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-[#666666]">No owners found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
