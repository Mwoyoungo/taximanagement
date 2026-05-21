import { db, collection, getDocs, query, where, Timestamp } from "@/app/lib/firebase";
import { TripLog } from "@/app/types/trip-log";

const TRIP_LOGS_COLLECTION = "tripLogs";

export interface DashboardStats {
  activeTaxis: number;
  liveTrips: number;
  driversOnDuty: number;
  revenueToday: number;
  completedTripsToday: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDayTimestamp = Timestamp.fromDate(startOfDay);
  
  // Get all trip logs
  const snapshot = await getDocs(collection(db, TRIP_LOGS_COLLECTION));
  const logs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as TripLog[];

  // Calculate stats
  const uniqueTaxiIds = new Set(logs.map(log => log.taxiId));
  const activeTaxis = uniqueTaxiIds.size;

  // Live trips = in-progress status
  const liveTrips = logs.filter(log => log.status === "in-progress").length;

  // Unique drivers with active trips (in-progress or completed today)
  const todayLogs = logs.filter(log => {
    if (!log.createdAt) return false;
    const logDate = log.createdAt.toDate();
    return logDate >= startOfDay;
  });
  const uniqueDrivers = new Set(todayLogs.map(log => log.driverId || log.driverName));
  const driversOnDuty = uniqueDrivers.size;

  // Revenue today from completed trips
  const completedTripsToday = todayLogs.filter(log => log.status === "completed");
  const revenueToday = completedTripsToday.reduce((sum, log) => sum + (log.fare || 0), 0);

  return {
    activeTaxis,
    liveTrips,
    driversOnDuty,
    revenueToday,
    completedTripsToday: completedTripsToday.length,
  };
}
