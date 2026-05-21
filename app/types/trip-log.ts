import { Timestamp } from "firebase/firestore";

export type TripStatus = "in-progress" | "completed" | "cancelled";

export interface TripLog {
  id?: string;
  taxiId: string;
  taxiRegistration: string;
  driverId: string;
  driverName: string;
  departureLocation: string;
  destination: string;
  departureTime: Timestamp | null;
  arrivalTime: Timestamp | null;
  distanceKm?: number;
  fare?: number;
  notes?: string;
  status: TripStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TripLogInput {
  taxiId: string;
  taxiRegistration: string;
  driverId: string;
  driverName: string;
  departureLocation: string;
  destination: string;
  departureTime: Date;
  arrivalTime?: Date | null;
  distanceKm?: number;
  fare?: number;
  notes?: string;
  status: TripStatus;
}
