import { db, collection, addDoc, getDocs, query, doc, updateDoc, deleteDoc, Timestamp } from "@/app/lib/firebase";

export interface Route {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  distance: string;
  estimatedTime: string;
  assignedAdmin: string;
  vehiclesCount: number;
  status: "Active" | "Inactive";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RouteInput {
  name: string;
  startPoint: string;
  endPoint: string;
  distance: string;
  estimatedTime: string;
  assignedAdmin: string;
  status: "Active" | "Inactive";
}

const ROUTES_COLLECTION = "routes";

export async function createRoute(data: RouteInput): Promise<string> {
  const now = Timestamp.now();
  const routeData = {
    ...data,
    vehiclesCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, ROUTES_COLLECTION), routeData);
  return docRef.id;
}

export async function getAllRoutes(): Promise<Route[]> {
  const snapshot = await getDocs(collection(db, ROUTES_COLLECTION));
  const routes = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Route[];
  
  // Sort by createdAt desc
  return routes.sort((a, b) => {
    const aTime = a.createdAt?.toMillis() || 0;
    const bTime = b.createdAt?.toMillis() || 0;
    return bTime - aTime;
  });
}

export async function updateRoute(id: string, data: Partial<RouteInput>): Promise<void> {
  const docRef = doc(db, ROUTES_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteRoute(id: string): Promise<void> {
  const docRef = doc(db, ROUTES_COLLECTION, id);
  await deleteDoc(docRef);
}
