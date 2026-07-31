import { auth, createUserWithEmailAndPassword, updateProfile } from "@/app/lib/firebase";
import { createUserProfile } from "./userService";
import { UserRole } from "@/app/context/AuthContext";

interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
}

const SEED_USERS: SeedUser[] = [
  {
    email: "director@taxi.com",
    password: "password123",
    name: "James Wilson",
    role: "Director",
    phone: "+1234567890",
  },
  {
    email: "admin@taxi.com",
    password: "password123",
    name: "Super Admin",
    role: "Super Admin",
    phone: "+1234567891",
  },
  {
    email: "junior@taxi.com",
    password: "password123",
    name: "Maria Garcia",
    role: "Junior Admin",
    phone: "+1234567892",
  },
  {
    email: "route@taxi.com",
    password: "password123",
    name: "Robert Chen",
    role: "Route Admin",
    phone: "+1234567893",
  },
  {
    email: "owner@taxi.com",
    password: "password123",
    name: "Fleet Owner",
    role: "Owner",
    phone: "+1234567894",
  },
  {
    email: "owner2@taxi.com",
    password: "password123",
    name: "Sarah Johnson",
    role: "Owner",
    phone: "+1234567895",
  },
  {
    email: "driver@taxi.com",
    password: "password123",
    name: "Sample Driver",
    role: "Driver",
    phone: "+1234567896",
  },
];

export async function seedUsers(): Promise<{ success: boolean; message: string; created: string[]; errors: string[] }> {
  const created: string[] = [];
  const errors: string[] = [];

  for (const user of SEED_USERS) {
    try {
      // Check if user already exists by trying to create
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      
      // Update profile with name
      await updateProfile(userCredential.user, { displayName: user.name });
      
      // Create user profile in Firestore
      await createUserProfile(userCredential.user.uid, {
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        isActive: true,
      });

      created.push(`${user.name} (${user.email}) - ${user.role}`);
    } catch (error: unknown) {
      // User might already exist
      if (error instanceof Error && error.message.includes("auth/email-already-in-use")) {
        errors.push(`${user.email} - Already exists`);
      } else {
        errors.push(`${user.email} - ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
  }

  const success = created.length > 0;
  const message = success 
    ? `Successfully created ${created.length} users. ${errors.length > 0 ? `${errors.length} skipped (already exist).` : ""}`
    : `No new users created. ${errors.length} users already exist.`;

  return { success, message, created, errors };
}

export async function seedUsersWithoutAuth(): Promise<{ success: boolean; message: string; created: string[]; errors: string[] }> {
  // This version creates Firestore profiles only (for when you want to create users manually in Firebase Console)
  const created: string[] = [];
  const errors: string[] = [];

  for (const user of SEED_USERS) {
    try {
      // Create a deterministic UID based on email (for manual Firebase Auth creation)
      const uid = `seed_${user.email.replace(/[@.]/g, "_")}`;
      
      // Check if profile already exists
      const { getUserProfile } = await import("./userService");
      const existing = await getUserProfile(uid);
      
      if (existing) {
        errors.push(`${user.email} - Profile already exists`);
        continue;
      }

      // Create user profile in Firestore
      await createUserProfile(uid, {
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        isActive: true,
      });

      created.push(`${user.name} (${user.email}) - ${user.role}`);
    } catch (error: unknown) {
      errors.push(`${user.email} - ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  const success = created.length > 0;
  const message = success 
    ? `Successfully created ${created.length} user profiles. ${errors.length > 0 ? `${errors.length} skipped.` : ""}`
    : `No new users created. ${errors.length} already exist.`;

  return { success, message, created, errors };
}
