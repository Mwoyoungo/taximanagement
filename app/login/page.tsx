"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { seedUsers } from "@/app/services/seedService";

export default function LoginPage() {
  const router = useRouter();
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [seedStatus, setSeedStatus] = useState<{ message: string; type: "success" | "error" | null }>({ message: "", type: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Login failed");
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await resetPassword(email);

    if (result.success) {
      setResetSuccess(true);
    } else {
      setError(result.error || "Password reset failed");
    }

    setIsLoading(false);
  };

  const handleSeed = async () => {
    setIsLoading(true);
    setSeedStatus({ message: "", type: null });
    
    const result = await seedUsers();
    
    if (result.success) {
      setSeedStatus({ message: result.message, type: "success" });
    } else {
      setSeedStatus({ message: result.message, type: "error" });
    }
    
    setIsLoading(false);
  };

  if (showForgotPassword) {
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
              Reset Password
            </h1>
            <p className="text-[#666666]">
              Enter your email to receive a password reset link
            </p>
          </div>

          {resetSuccess ? (
            <div className="p-4 bg-[#d4fae8] border border-[#0fa76e] rounded-xl text-center">
              <p className="text-sm text-[#0fa76e] font-medium">
                Password reset email sent! Check your inbox.
              </p>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetSuccess(false);
                }}
                className="mt-4 text-sm text-[#0d0d0d] underline"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
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
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full py-3 border border-[rgba(0,0,0,0.08)] text-[#0d0d0d] rounded-full text-sm font-medium hover:bg-[#f5f5f5] transition-colors"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

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

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-[#666666] hover:text-[#0d0d0d] transition-colors"
            >
              Forgot password?
            </button>
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

        {/* First Time Setup */}
        <div className="mt-8 p-4 bg-[#fafafa] rounded-xl border border-[rgba(0,0,0,0.05)]">
          <p className="text-xs font-medium text-[#666666] mb-2">First Time Setup</p>
          <p className="text-xs text-[#888888] mb-3">
            No users yet? Create test accounts to get started.
          </p>
          <button
            onClick={handleSeed}
            disabled={isLoading}
            className="w-full py-2 border border-[rgba(0,0,0,0.08)] text-[#666666] rounded-full text-xs font-medium hover:bg-[#f5f5f5] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Admin Users"}
          </button>
          
          {seedStatus.type && (
            <div className={`mt-2 p-2 rounded-xl text-xs ${
              seedStatus.type === "success" 
                ? "bg-[#d4fae8] text-[#0fa76e]" 
                : "bg-red-50 text-red-600"
            }`}>
              {seedStatus.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
