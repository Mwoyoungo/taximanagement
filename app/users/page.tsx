"use client";

import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Director" | "Super Admin" | "Junior Admin" | "Route Admin";
  status: "Active" | "Inactive";
  lastActive: string;
}

const sampleUsers: User[] = [
  {
    id: "1",
    name: "James Wilson",
    email: "james@taxi.com",
    role: "Director",
    status: "Active",
    lastActive: "Just now",
  },
  {
    id: "2",
    name: "Super Admin",
    email: "admin@taxi.com",
    role: "Super Admin",
    status: "Active",
    lastActive: "2 min ago",
  },
  {
    id: "3",
    name: "Maria Garcia",
    email: "maria@taxi.com",
    role: "Junior Admin",
    status: "Active",
    lastActive: "1 hour ago",
  },
  {
    id: "4",
    name: "Robert Chen",
    email: "robert@taxi.com",
    role: "Route Admin",
    status: "Active",
    lastActive: "3 hours ago",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa@taxi.com",
    role: "Route Admin",
    status: "Inactive",
    lastActive: "2 days ago",
  },
];

const roleColors = {
  Director: "bg-[#0d0d0d] text-white",
  "Super Admin": "bg-[#18E299] text-[#0d0d0d]",
  "Junior Admin": "bg-[#d4fae8] text-[#0fa76e]",
  "Route Admin": "bg-[#f5f5f5] text-[#666666]",
};

const statusColors = {
  Active: "bg-[#d4fae8] text-[#0fa76e]",
  Inactive: "bg-[#f5f5f5] text-[#666666]",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "Junior Admin",
    status: "Active",
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    if (formData.name && formData.email) {
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role as User["role"],
        status: formData.status as User["status"],
        lastActive: "Just now",
      };
      setUsers([...users, newUser]);
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        role: "Junior Admin",
        status: "Active",
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-3xl sm:text-[40px] font-semibold text-[#0d0d0d] tracking-tight leading-tight">
          Users Management
        </h1>
        <p className="text-base sm:text-lg text-[#666666] mt-2 leading-relaxed">
          Manage system users and role assignments
        </p>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <p className="text-2xl font-semibold text-[#0d0d0d]">
            {users.filter((u) => u.role === "Director").length}
          </p>
          <p className="text-sm text-[#666666]">Directors</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <p className="text-2xl font-semibold text-[#0d0d0d]">
            {users.filter((u) => u.role === "Super Admin").length}
          </p>
          <p className="text-sm text-[#666666]">Super Admins</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <p className="text-2xl font-semibold text-[#0d0d0d]">
            {users.filter((u) => u.role === "Junior Admin").length}
          </p>
          <p className="text-sm text-[#666666]">Junior Admins</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <p className="text-2xl font-semibold text-[#0d0d0d]">
            {users.filter((u) => u.role === "Route Admin").length}
          </p>
          <p className="text-sm text-[#666666]">Route Admins</p>
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
            placeholder="Search by name, email, or role..."
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
          Add User
        </button>
      </div>

      {/* Add User Form */}
      {showForm && (
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 sm:p-6 shadow-[rgba(0,0,0,0.03)_0px_2px_4px] mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#0d0d0d] tracking-tight mb-4 sm:mb-6">Add New User</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#18E299] transition-colors"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#18E299] transition-colors"
                placeholder="user@taxi.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as User["role"] })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#18E299] transition-colors"
              >
                <option value="Director">Director</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Junior Admin">Junior Admin</option>
                <option value="Route Admin">Route Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as User["status"] })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#18E299] transition-colors"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleAddUser}
              className="px-6 py-2 bg-[#0d0d0d] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-[rgba(0,0,0,0.06)_0px_1px_2px]"
            >
              Create User
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
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Role</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[rgba(0,0,0,0.05)] hover:bg-[#fafafa] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#f5f5f5] rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-[#666666]">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#0d0d0d]">{user.name}</p>
                        <p className="text-xs text-[#888888]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666666]">{user.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#888888] text-sm">No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
