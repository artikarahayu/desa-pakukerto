import { dusunSchema, Dusun } from "@/schemas/dusun.schema";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  orderBy,
} from "firebase/firestore";

// Get all dusun profiles
export async function getAllDusunProfiles(): Promise<Dusun[]> {
  try {
    const dusunRef = collection(db, "dusunProfiles");
    const snapshot = await getDocs(query(dusunRef, orderBy("nama", "asc")));

    if (snapshot.empty) {
      return [];
    }

    const validDusunList: Dusun[] = [];

    for (const doc of snapshot.docs) {
      try {
        const data = {
          id: doc.id,
          ...doc.data(),
        };

        // Validate with zod schema
        const validatedDusun = dusunSchema.parse(data);
        validDusunList.push(validatedDusun);
      } catch (validationError) {
        console.error(`Validation error for dusun ${doc.id}:`, validationError);
        // Skip invalid entries
      }
    }

    return validDusunList;
  } catch (error) {
    console.error("Error fetching dusun profiles:", error);
    throw new Error("Failed to fetch dusun profiles");
  }
}

// Get dusun profile by slug
export async function getDusunProfileBySlug(slug: string) {
  try {
    const dusunRef = collection(db, "dusunProfiles");
    const snapshot = await getDocs(
      query(dusunRef, where("slug", "==", slug), limit(1))
    );

    if (snapshot.empty) {
      return null;
    }

    const dusunData = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    };

    // Validate with zod schema
    const validatedDusun = dusunSchema.parse(dusunData);
    return validatedDusun;
  } catch (error) {
    console.error(`Error fetching dusun profile with slug ${slug}:`, error);
    throw new Error("Failed to fetch dusun profile");
  }
}

// Get all dusun slugs for static paths
export async function getAllDusunSlugs() {
  try {
    const dusunRef = collection(db, "dusunProfiles");
    const snapshot = await getDocs(query(dusunRef, orderBy("slug", "asc")));

    if (snapshot.empty) {
      return [];
    }

    const slugs = snapshot.docs.map((doc) => doc.data().slug as string);
    return slugs;
  } catch (error) {
    console.error("Error fetching dusun slugs:", error);
    throw new Error("Failed to fetch dusun slugs");
  }
}
