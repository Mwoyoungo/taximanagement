import { db, collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, Timestamp, getDoc } from "@/app/lib/firebase";
import { TripLog, TripLogInput, TripStatus } from "@/app/types/trip-log";

const TRIP_LOGS_COLLECTION = "tripLogs";

export async function createTripLog(data: TripLogInput): Promise<string> {
  const now = Timestamp.now();
  const tripLogData: Record<string, unknown> = {
    taxiId: data.taxiId,
    taxiRegistration: data.taxiRegistration,
    driverId: data.driverId || "",
    driverName: data.driverName,
    departureLocation: data.departureLocation,
    destination: data.destination,
    departureTime: data.departureTime ? Timestamp.fromDate(data.departureTime) : null,
    arrivalTime: data.arrivalTime ? Timestamp.fromDate(data.arrivalTime) : null,
    status: data.status,
    notes: data.notes || "",
    createdAt: now,
    updatedAt: now,
  };

  // Only add optional fields if they have values
  if (data.distanceKm !== undefined && data.distanceKm !== null) {
    tripLogData.distanceKm = data.distanceKm;
  }
  if (data.fare !== undefined && data.fare !== null) {
    tripLogData.fare = data.fare;
  }
  if (data.routeId && data.routeId.trim() !== "") {
    tripLogData.routeId = data.routeId;
  }
  if (data.routeName && data.routeName.trim() !== "") {
    tripLogData.routeName = data.routeName;
  }

  const docRef = await addDoc(collection(db, TRIP_LOGS_COLLECTION), tripLogData);
  return docRef.id;
}

export async function getTripLogsByTaxi(taxiId: string): Promise<TripLog[]> {
  const q = query(
    collection(db, TRIP_LOGS_COLLECTION),
    where("taxiId", "==", taxiId)
  );

  const snapshot = await getDocs(q);
  const logs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as TripLog[];
  
  // Sort client-side by createdAt desc
  return logs.sort((a, b) => {
    const aTime = a.createdAt?.toMillis() || 0;
    const bTime = b.createdAt?.toMillis() || 0;
    return bTime - aTime;
  });
}

export async function getAllTripLogs(): Promise<TripLog[]> {
  const q = query(collection(db, TRIP_LOGS_COLLECTION));

  const snapshot = await getDocs(q);
  const logs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as TripLog[];
  
  // Sort client-side by createdAt desc
  return logs.sort((a, b) => {
    const aTime = a.createdAt?.toMillis() || 0;
    const bTime = b.createdAt?.toMillis() || 0;
    return bTime - aTime;
  });
}

export async function getTripLogById(id: string): Promise<TripLog | null> {
  const docRef = doc(db, TRIP_LOGS_COLLECTION, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as TripLog;
}

export async function updateTripLog(id: string, data: Partial<TripLogInput>): Promise<void> {
  const docRef = doc(db, TRIP_LOGS_COLLECTION, id);
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: Timestamp.now(),
  };

  if (data.departureTime) {
    updateData.departureTime = Timestamp.fromDate(data.departureTime);
  }
  if (data.arrivalTime) {
    updateData.arrivalTime = Timestamp.fromDate(data.arrivalTime);
  }

  await updateDoc(docRef, updateData);
}

export async function deleteTripLog(id: string): Promise<void> {
  const docRef = doc(db, TRIP_LOGS_COLLECTION, id);
  await deleteDoc(docRef);
}

export async function completeTrip(id: string, arrivalTime: Date, distanceKm?: number, fare?: number): Promise<void> {
  const docRef = doc(db, TRIP_LOGS_COLLECTION, id);
  await updateDoc(docRef, {
    status: "completed" as TripStatus,
    arrivalTime: Timestamp.fromDate(arrivalTime),
    distanceKm: distanceKm || null,
    fare: fare || null,
    updatedAt: Timestamp.now(),
  });
}

export function formatTimestamp(timestamp: Timestamp | null): string {
  if (!timestamp) return "--";
  const date = timestamp.toDate();
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateDuration(departure: Timestamp | null, arrival: Timestamp | null): string {
  if (!departure || !arrival) return "--";
  const diff = arrival.toDate().getTime() - departure.toDate().getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
