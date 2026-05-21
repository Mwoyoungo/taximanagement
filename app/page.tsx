"use client";

import { useState, useEffect } from "react";
import { useAuth, UserRole } from "./context/AuthContext";
import { getAllTripLogs, formatTimestamp, calculateDuration } from "./services/tripLogService";
import { getDashboardStats, DashboardStats } from "./services/dashboardService";
import { TripLog } from "./types/trip-log";
import Link from "next/link";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
}

function StatCard({ label, value, change, changeType, icon }: StatCardProps) {
  const changeColor =
    changeType === "positive"
      ? "text-[#0fa76e]"
      : changeType === "negative"
      ? "text-[#d45656]"
      : "text-[#666666]";

  return (
    <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-6 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 bg-[#d4fae8] rounded-xl flex items-center justify-center">
          <div className="text-[#0fa76e]">{icon}</div>
        </div>
        <span className={`text-sm font-medium ${changeColor}`}>{change}</span>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-semibold text-[#0d0d0d] tracking-tight">{value}</p>
        <p className="text-sm text-[#666666] mt-1">{label}</p>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  status: "completed" | "pending" | "in-progress";
}

function ActivityItem({ title, description, time, status }: ActivityItemProps) {
  const statusColors = {
    completed: "bg-[#d4fae8] text-[#0fa76e]",
    pending: "bg-[#fafafa] text-[#666666]",
    "in-progress": "bg-[#ffc93e] text-[#0d0d0d]",
  };

  const statusLabels = {
    completed: "Completed",
    pending: "Pending",
    "in-progress": "In Progress",
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-[rgba(0,0,0,0.05)] last:border-0 gap-2 sm:gap-0">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-2 h-2 rounded-full bg-[#ffc93e] shrink-0"></div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#0d0d0d] truncate">{title}</p>
          <p className="text-xs text-[#888888] truncate">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 ml-5 sm:ml-0">
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
        <span className="text-xs text-[#888888] whitespace-nowrap">{time}</span>
      </div>
    </div>
  );
}

const DASHBOARD_TITLES: Record<UserRole, string> = {
  Director: "Director Dashboard",
  "Super Admin": "Admin Dashboard",
  "Junior Admin": "Operations Dashboard",
  "Route Admin": "Route Manager Dashboard",
  Owner: "My Fleet Dashboard",
};

const DASHBOARD_SUBTITLES: Record<UserRole, string> = {
  Director: "Complete fleet overview and financial analytics",
  "Super Admin": "System administration and user management",
  "Junior Admin": "Monitor and manage daily trip operations",
  "Route Admin": "Manage your assigned routes and schedules",
  Owner: "View your taxis, drivers, and earnings",
};

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || "Super Admin";
  const title = DASHBOARD_TITLES[role];
  const subtitle = DASHBOARD_SUBTITLES[role];
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [liveTrips, setLiveTrips] = useState<TripLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLiveTrips();
    loadStats();
  }, []);

  async function loadLiveTrips() {
    setIsLoading(true);
    try {
      const allLogs = await getAllTripLogs();
      // Get in-progress and recent completed trips
      const recent = allLogs
        .filter(log => log.status === "in-progress" || log.status === "completed")
        .slice(0, 5);
      setLiveTrips(recent);
    } catch (error) {
      console.error("Error loading trips:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadStats() {
    setStatsLoading(true);
    try {
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setStatsLoading(false);
    }
  }

  function getTripStatus(log: TripLog): "completed" | "pending" | "in-progress" {
    if (log.status === "completed") return "completed";
    if (log.status === "in-progress") return "in-progress";
    return "pending";
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl sm:text-[40px] font-semibold text-[#0d0d0d] tracking-tight leading-tight">
            {title}
          </h1>
          <span className="px-3 py-1 bg-[#ffc93e] text-[#0d0d0d] rounded-full text-sm font-medium">
            {user?.name || "User"}
          </span>
        </div>
        <p className="text-base sm:text-lg text-[#666666] leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-10">
        {statsLoading ? (
          <div className="col-span-full flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-[#ffc93e] border-t-transparent rounded-full"></div>
          </div>
        ) : stats ? (
          <>
            <StatCard
              label="Active Taxis"
              value={stats.activeTaxis.toString()}
              change="in fleet"
              changeType="neutral"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              }
            />
            <StatCard
              label="Live Trips"
              value={stats.liveTrips.toString()}
              change={`${stats.completedTripsToday} completed today`}
              changeType="positive"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              label="Drivers on Duty"
              value={stats.driversOnDuty.toString()}
              change="today"
              changeType="neutral"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            <StatCard
              label="Revenue Today"
              value={`$${stats.revenueToday.toFixed(2)}`}
              change="from completed trips"
              changeType="positive"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </>
        ) : null}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Live Trips */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 sm:p-6 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-[#0d0d0d] tracking-tight">Live Trips</h2>
                <p className="text-sm text-[#666666] mt-1">Currently active trips in your fleet</p>
              </div>
              <button className="px-5 py-2 bg-[#0d0d0d] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-[rgba(0,0,0,0.06)_0px_1px_2px] whitespace-nowrap">
                View All
              </button>
            </div>
            <div className="space-y-1">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-[#ffc93e] border-t-transparent rounded-full mx-auto"></div>
                </div>
              ) : liveTrips.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#888888] text-sm">No active trips</p>
                  <p className="text-xs text-[#666666] mt-1">
                    Add trips from the <Link href="/taxis" className="text-[#ffc93e] hover:underline">Taxis</Link> page
                  </p>
                </div>
              ) : (
                liveTrips.map((trip) => (
                  <ActivityItem
                    key={trip.id}
                    title={`${trip.departureLocation} → ${trip.destination}`}
                    description={`Driver: ${trip.driverName} • Taxi: ${trip.taxiRegistration}`}
                    time={trip.arrivalTime 
                      ? calculateDuration(trip.departureTime, trip.arrivalTime)
                      : "In progress"
                    }
                    status={getTripStatus(trip)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-4 sm:p-6 shadow-[rgba(0,0,0,0.03)_0px_2px_4px]">
            <h2 className="text-lg sm:text-xl font-semibold text-[#0d0d0d] tracking-tight mb-4 sm:mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-3 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm font-medium text-[#0d0d0d] hover:bg-[#f5f5f5] transition-colors">
                <svg className="w-5 h-5 text-[#ffc93e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Taxi
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm font-medium text-[#0d0d0d] hover:bg-[#f5f5f5] transition-colors">
                <svg className="w-5 h-5 text-[#ffc93e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register Driver
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm font-medium text-[#0d0d0d] hover:bg-[#f5f5f5] transition-colors">
                <svg className="w-5 h-5 text-[#ffc93e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 7m0 13V7" />
                </svg>
                Create Route
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 border border-[rgba(0,0,0,0.08)] rounded-xl text-sm font-medium text-[#0d0d0d] hover:bg-[#f5f5f5] transition-colors">
                <svg className="w-5 h-5 text-[#ffc93e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Report
              </button>
            </div>
          </div>

          {/* Fleet Status */}
          <div className="bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl p-6 shadow-[rgba(0,0,0,0.03)_0px_2px_4px] mt-6">
            <h2 className="text-xl font-semibold text-[#0d0d0d] tracking-tight mb-4">Fleet Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#ffc93e]"></div>
                  <span className="text-sm text-[#333333]">Active</span>
                </div>
                <span className="text-sm font-medium text-[#0d0d0d]">24</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#c37d0d]"></div>
                  <span className="text-sm text-[#333333]">Maintenance</span>
                </div>
                <span className="text-sm font-medium text-[#0d0d0d]">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#888888]"></div>
                  <span className="text-sm text-[#333333]">Inactive</span>
                </div>
                <span className="text-sm font-medium text-[#0d0d0d]">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

