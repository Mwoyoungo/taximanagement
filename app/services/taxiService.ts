import { db, collection, addDoc, getDocs, query, doc, updateDoc, deleteDoc, Timestamp } from "@/app/lib/firebase";

export interface Taxi {
  id: string;
  registrationNumber: string;
  model: string;
  capacity: number;
  owner: string;
  assignedRoute: string;
  status: "Active" | "Maintenance" | "Inactive";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TaxiInput {
  registrationNumber: string;
  model: string;
  capacity: number;
  owner: string;
  assignedRoute: string;
  status: "Active" | "Maintenance" | "Inactive";
}

const TAXIS_COLLECTION = "taxis";

export async function createTaxi(data: TaxiInput): Promise<string> {
  const now = Timestamp.now();
  const taxiData = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, TAXIS_COLLECTION), taxiData);
  return docRef.id;
}

export async function getAllTaxis(): Promise<Taxi[]> {
  const snapshot = await getDocs(collection(db, TAXIS_COLLECTION));
  const taxis = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Taxi[];
  
  // Sort by createdAt desc
  return taxis.sort((a, b) => {
    const aTime = a.createdAt?.toMillis() || 0;
    const bTime = b.createdAt?.toMillis() || 0;
    return bTime - aTime;
  });
}

export async function updateTaxi(id: string, data: Partial<TaxiInput>): Promise<void> {
  const docRef = doc(db, TAXIS_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteTaxi(id: string): Promise<void> {
  const docRef = doc(db, TAXIS_COLLECTION, id);
  await deleteDoc(docRef);
}
