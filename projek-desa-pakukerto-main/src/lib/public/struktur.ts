import { Struktur } from "@/schemas/struktur.schema";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Type for public struktur data
export type StrukturPublicData = Struktur;

/**
 * Get all struktur organisasi data for public display
 */
export async function getAllStruktur(): Promise<StrukturPublicData[]> {
  try {
    const strukturRef = collection(db, "struktur_organisasi");
    const snapshot = await getDocs(strukturRef);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<StrukturPublicData, "id">),
    }));
  } catch (error) {
    console.error("Error fetching struktur data:", error);
    return [];
  }
}
