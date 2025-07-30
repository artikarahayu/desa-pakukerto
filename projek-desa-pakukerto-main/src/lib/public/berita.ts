import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from "firebase/firestore";

// Define the Berita type for public data
export interface BeritaPublicData {
  id: string;
  judul: string;
  slug: string;
  thumbnailUrl: string;
  isi: string;
  excerpt: string;
  createdAt: any;
  updatedAt: any;
}

/**
 * Get published berita sorted by createdAt in descending order (newest first)
 * @param limitCount Optional limit of berita to fetch
 * @returns Array of BeritaPublicData
 */
export const getPublishedBerita = async (limitCount?: number): Promise<BeritaPublicData[]> => {
  try {
    let beritaQuery = query(
      collection(db, "berita"),
      orderBy("createdAt", "desc")
    );

    // Apply limit if provided
    if (limitCount) {
      beritaQuery = query(beritaQuery, limit(limitCount));
    }

    const beritaSnapshot = await getDocs(beritaQuery);
    
    const beritaList: BeritaPublicData[] = [];
    
    beritaSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Generate excerpt from content if not available
      const excerpt = data.excerpt || generateExcerpt(data.isi);
      
      beritaList.push({
        id: doc.id,
        judul: data.judul || "",
        slug: data.slug || "",
        thumbnailUrl: data.thumbnail || "",
        isi: data.isi || "",
        excerpt,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });
    
    return beritaList;
  } catch (error) {
    console.error("Error fetching published berita:", error);
    return [];
  }
};

/**
 * Get a single berita by its slug
 * @param slug The berita slug
 * @returns BeritaPublicData or null if not found
 */
export const getBeritaBySlug = async (slug: string): Promise<BeritaPublicData | null> => {
  try {
    // Query for the berita with matching slug
    const beritaQuery = query(
      collection(db, "berita"),
      where("slug", "==", slug),
      limit(1)
    );
    
    const beritaSnapshot = await getDocs(beritaQuery);
    
    if (beritaSnapshot.empty) {
      return null;
    }
    
    const doc = beritaSnapshot.docs[0];
    const data = doc.data();
    
    // Generate excerpt from content if not available
    const excerpt = data.excerpt || generateExcerpt(data.isi);
    
    return {
      id: doc.id,
      judul: data.judul || "",
      slug: data.slug || "",
      thumbnailUrl: data.thumbnail || "",
      isi: data.isi || "",
      excerpt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    console.error(`Error fetching berita with slug ${slug}:`, error);
    return null;
  }
};

/**
 * Generate an excerpt from HTML content
 * @param htmlContent HTML content string
 * @param maxLength Maximum length of excerpt (default: 160 characters)
 * @returns Plain text excerpt
 */
const generateExcerpt = (htmlContent: string, maxLength: number = 160): string => {
  if (!htmlContent) return "";
  
  // Remove HTML tags
  const plainText = htmlContent.replace(/<[^>]+>/g, " ");
  
  // Remove extra spaces and trim
  const cleanText = plainText.replace(/\s+/g, " ").trim();
  
  // Truncate to maxLength
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  // Find the last space before maxLength
  const truncated = cleanText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + "...";
  }
  
  return truncated + "...";
};
