import { db, collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, getDoc, setDoc } from "@/app/lib/firebase";
import { UserRole } from "@/app/context/AuthContext";

const USERS_COLLECTION = "users";

export interface UserProfile {
  id?: string;
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function createUserProfile(uid: string, data: Omit<UserProfile, "id" | "uid" | "createdAt" | "updatedAt">): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const now = new Date();

  await setDoc(userRef, {
    ...data,
    uid,
    createdAt: now,
    updatedAt: now,
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as UserProfile;
}

export async function updateUserProfile(uid: string, data: Partial<Omit<UserProfile, "id" | "uid" | "createdAt">>): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date(),
  });
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const snapshot = await getDocs(collection(db, USERS_COLLECTION));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as UserProfile;
  });
}

export async function getUsersByRole(role: UserRole): Promise<UserProfile[]> {
  const q = query(collection(db, USERS_COLLECTION), where("role", "==", role));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as UserProfile;
  });
}

export async function deleteUserProfile(uid: string): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await deleteDoc(userRef);
}

export async function deactivateUser(uid: string): Promise<void> {
  await updateUserProfile(uid, { isActive: false });
}

export async function activateUser(uid: string): Promise<void> {
  await updateUserProfile(uid, { isActive: true });
}
