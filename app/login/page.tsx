"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth, UserRole } from "../context/AuthContext";

const roles: { value: UserRole; label: string; description: string; color: string }[] = [
  {
    value: "Director",
    label: "Director",
    description: "Full system access, financial oversight",
    color: "bg-[#0d0d0d]",
  },
  {
    value: "Super Admin",
    label: "Super Admin",
    description: "System administration, user management",
    color: "bg-[#ffc93e]",
  },
  {
    value: "Junior Admin",
    label: "Junior Admin",
    description: "Trip management, limited access",
    color: "bg-[#d4fae8]",
  },
  {
    value: "Route Admin",
    label: "Route Admin",
    description: "Manage assigned routes only",
    color: "bg-[#f5f5f5]",
  },
  {
    value: "Owner",
    label: "Fleet Owner",
    description: "View your taxis, drivers, and earnings",
    color: "bg-[#fef3c7]",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("Super Admin");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const success = login(email, password, selectedRole);
      if (success) {
        router.push("/");
      } else {
        setError("Invalid credentials");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-[#ffc93e]/20 rounded-2xl flex items-center justify-center p-3">
            <Image src="/taxi-logo.png" alt="Taxi Logo" width={72} height={72} className="object-contain" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-[#0d0d0d] tracking-tight mb-2">
            Taxi System Management
          </h1>
          <p className="text-[#666666]">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] placeholder-[#888888] focus:outline-none focus:border-[#ffc93e] focus:ring-1 focus:ring-[#ffc93e] transition-all"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#0d0d0d] placeholder-[#888888] focus:outline-none focus:border-[#ffc93e] focus:ring-1 focus:ring-[#ffc93e] transition-all"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-3">
              Select Your Role
            </label>
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                    selectedRole === role.value
                      ? "border-[#ffc93e] bg-[#f5f5f5]"
                      : "border-[rgba(0,0,0,0.08)] hover:bg-[#fafafa]"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${role.color} ${role.value === "Owner" ? "border border-[#d4d4d4]" : ""}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${selectedRole === role.value ? "text-[#0d0d0d]" : "text-[#333333]"}`}>
                      {role.label}
                    </p>
                    <p className="text-xs text-[#888888]">{role.description}</p>
                  </div>
                  {selectedRole === role.value && (
                    <svg className="w-5 h-5 text-[#ffc93e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#0d0d0d] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-[rgba(0,0,0,0.06)_0px_1px_2px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-[#fafafa] rounded-xl border border-[rgba(0,0,0,0.05)]">
          <p className="text-xs font-medium text-[#666666] mb-2">Demo Credentials:</p>
          <p className="text-xs text-[#888888]">
            Any email works with password <span className="font-mono text-[#0d0d0d]">password123</span>
          </p>
          <p className="text-xs text-[#888888] mt-1">
            Or use: director@taxi.com, admin@taxi.com, junior@taxi.com, route@taxi.com, owner@taxi.com
          </p>
        </div>
      </div>
    </div>
  );
}
