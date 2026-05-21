"use client";

import { useState, useEffect } from "react";
import { useAuth, UserRole } from "@/app/context/AuthContext";
import { getAllUsers, activateUser, deactivateUser, type UserProfile } from "@/app/services/userService";
import { auth, createUserWithEmailAndPassword, updateProfile, deleteDoc, doc, db } from "@/app/lib/firebase";

interface DisplayUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Inactive";
  phone?: string;
  createdAt: Date;
}

const roleColors = {
  Director: "bg-[#0d0d0d] text-white",
  "Super Admin": "bg-[#ffc93e] text-[#0d0d0d]",
  "Junior Admin": "bg-[#d4fae8] text-[#0fa76e]",
  "Route Admin": "bg-[#f5f5f5] text-[#666666]",
  Owner: "bg-[#fef3c7] text-[#92400e]",
};

const statusColors = {
  Active: "bg-[#d4fae8] text-[#0fa76e]",
  Inactive: "bg-[#f5f5f5] text-[#666666]",
};

export default function UsersPage() {
  const { user: currentUser, hasPermission, register } = useAuth();
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Junior Admin" as UserRole,
    status: "Active" as "Active" | "Inactive",
  });

  // Load users from Firestore
  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const profiles = await getAllUsers();
      const displayUsers: DisplayUser[] = profiles.map((profile) => ({
        id: profile.uid,
        uid: profile.uid,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        status: profile.isActive ? "Active" : "Inactive",
        phone: profile.phone,
        createdAt: profile.createdAt,
      }));
      setUsers(displayUsers);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }

  // Check if current user can create users (only Super Admin or Director)
  const canCreateUsers = hasPermission(["Super Admin", "Director"]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Register user with Firebase Auth
      const result = await register(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        formData.phone
      );

      if (!result.success) {
        setError(result.error || "Failed to create user");
        return;
      }

      // If status is Inactive, deactivate the user
      // Note: We need to get the UID from the created user, but since register logs them in,
      // we need to create the user differently for admin user creation

      setSuccessMessage(`User ${formData.name} created successfully!`);
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "Junior Admin",
        status: "Active",
      });

      // Reload users list
      await loadUsers();
    } catch (err: unknown) {
      console.error("Error creating user:", err);
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (uid: string, currentStatus: "Active" | "Inactive") => {
    try {
      if (currentStatus === "Active") {
        await deactivateUser(uid);
      } else {
        await activateUser(uid);
      }
      await loadUsers();
    } catch (err) {
      console.error("Error toggling user status:", err);
      setError("Failed to update user status");
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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 lg:mb-8">
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
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
          <p className="text-2xl font-semibold text-[#0d0d0d]">
            {users.filter((u) => u.role === "Owner").length}
          </p>
          <p className="text-sm text-[#666666]">Owners</p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-4 bg-[#d4fae8] border border-[#0fa76e] rounded-xl">
          <p className="text-sm text-[#0fa76e]">{successMessage}</p>
        </div>
      )}

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
            className="w-full pl-12 pr-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-full text-sm text-[#0d0d0d] placeholder-[#888888] focus:outline-none focus:border-[#ffc93e] focus:ring-1 focus:ring-[#ffc93e] transition-all"
          />
        </div>
        {canCreateUsers && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0d0d0d] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-[rgba(0,0,0,0.06)_0px_1px_2px] whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add User
          </button>
        )}
      </div>

      {/* Add User Form */}
      {showForm && canCreateUsers && (
        <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 sm:p-6 shadow-[rgba(0,0,0,0.03)_0px_2px_4px] mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#0d0d0d] tracking-tight mb-4 sm:mb-6">Add New User</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="user@taxi.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="Min 6 characters"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
              >
                <option value="Director">Director</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Junior Admin">Junior Admin</option>
                <option value="Route Admin">Route Admin</option>
                <option value="Owner">Owner</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] focus:outline-none focus:border-[#ffc93e] transition-colors"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleAddUser}
              disabled={isLoading}
              className="px-6 py-2 bg-[#0d0d0d] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-[rgba(0,0,0,0.06)_0px_1px_2px] disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create User"}
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
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-[#ffc93e] border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-[#666666] mt-2">Loading users...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(0,0,0,0.05)]">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">User</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Role</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Joined</th>
                    {canCreateUsers && <th className="text-left px-6 py-4 text-sm font-semibold text-[#0d0d0d]">Actions</th>}
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
                            {user.phone && <p className="text-xs text-[#888888]">{user.phone}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#666666]">
                        {user.createdAt.toLocaleDateString()}
                      </td>
                      {canCreateUsers && (
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(user.uid, user.status)}
                            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                              user.status === "Active"
                                ? "bg-red-100 text-red-600 hover:bg-red-200"
                                : "bg-[#d4fae8] text-[#0fa76e] hover:bg-[#c4ead8]"
                            }`}
                          >
                            {user.status === "Active" ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-[rgba(0,0,0,0.05)]">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#f5f5f5] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-base font-semibold text-[#666666]">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0d0d0d] truncate">{user.name}</p>
                      <p className="text-sm text-[#888888] truncate">{user.email}</p>
                    </div>
                  </div>
                  {user.phone && <p className="text-sm text-[#888888]">{user.phone}</p>}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                      {user.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#666666]">Joined: {user.createdAt.toLocaleDateString()}</p>
                  {canCreateUsers && (
                    <button
                      onClick={() => handleToggleStatus(user.uid, user.status)}
                      className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
                        user.status === "Active"
                          ? "bg-red-100 text-red-600 active:bg-red-200"
                          : "bg-[#d4fae8] text-[#0fa76e] active:bg-[#c4ead8]"
                      }`}
                    >
                      {user.status === "Active" ? "Deactivate User" : "Activate User"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12 px-4">
            <p className="text-[#888888] text-sm">No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
