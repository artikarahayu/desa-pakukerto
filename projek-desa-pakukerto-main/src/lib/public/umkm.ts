import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { Umkm } from "@/schemas/umkm.schema";

/**
 * Get all UMKM products
 */
export async function getAllUmkm(): Promise<Umkm[]> {
  try {
    const umkmRef = collection(db, "umkm");
    const umkmQuery = query(umkmRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(umkmQuery);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Umkm)
    );
  } catch (error) {
    console.error("Error fetching UMKM products:", error);
    return [];
  }
}

/**
 * Get UMKM product by ID
 */
export async function getUmkmById(id: string): Promise<Umkm | null> {
  try {
    const umkmRef = doc(db, "umkm", id);
    const snapshot = await getDoc(umkmRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Umkm;
  } catch (error) {
    console.error("Error fetching UMKM product by ID:", error);
    return null;
  }
}

/**
 * Get featured UMKM products (limited number)
 */
export async function getFeaturedUmkm(limitCount: number = 6): Promise<Umkm[]> {
  try {
    const umkmRef = collection(db, "umkm");
    const umkmQuery = query(
      umkmRef,
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(umkmQuery);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Umkm)
    );
  } catch (error) {
    console.error("Error fetching featured UMKM products:", error);
    return [];
  }
}
