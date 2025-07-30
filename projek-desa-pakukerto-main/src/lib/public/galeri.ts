import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

// Define the Galeri type for public data
export interface GaleriPublicData {
  id: string;
  type: "image" | "video";
  title: string;
  imageUrl?: string;
  youtubeUrl?: string;
  createdAt: any;
}

/**
 * Get all gallery items sorted by createdAt in descending order (newest first)
 * @returns Array of GaleriPublicData
 */
export const getAllGaleri = async (): Promise<GaleriPublicData[]> => {
  try {
    const galeriQuery = query(
      collection(db, "galeri"),
      orderBy("createdAt", "desc")
    );
    
    const galeriSnapshot = await getDocs(galeriQuery);
    
    const galeriList: GaleriPublicData[] = [];
    
    galeriSnapshot.forEach((doc) => {
      const data = doc.data();
      
      galeriList.push({
        id: doc.id,
        type: data.type,
        title: data.title || "",
        imageUrl: data.type === "image" ? data.imageUrl : undefined,
        youtubeUrl: data.type === "video" ? data.youtubeUrl : undefined,
        createdAt: data.createdAt,
      });
    });
    
    return galeriList;
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return [];
  }
};

/**
 * Get gallery items by type (image or video)
 * @param type The type of gallery items to fetch ("image" or "video")
 * @returns Array of GaleriPublicData filtered by type
 */
export const getGaleriByType = async (type: "image" | "video"): Promise<GaleriPublicData[]> => {
  try {
    const galeriQuery = query(
      collection(db, "galeri"),
      where("type", "==", type),
      orderBy("createdAt", "desc")
    );
    
    const galeriSnapshot = await getDocs(galeriQuery);
    
    const galeriList: GaleriPublicData[] = [];
    
    galeriSnapshot.forEach((doc) => {
      const data = doc.data();
      
      galeriList.push({
        id: doc.id,
        type: data.type,
        title: data.title || "",
        imageUrl: data.type === "image" ? data.imageUrl : undefined,
        youtubeUrl: data.type === "video" ? data.youtubeUrl : undefined,
        createdAt: data.createdAt,
      });
    });
    
    return galeriList;
  } catch (error) {
    console.error(`Error fetching gallery items of type ${type}:`, error);
    return [];
  }
};

/**
 * Extract YouTube video ID from URL
 * @param url YouTube URL
 * @returns YouTube video ID or null if invalid
 */
export const extractYoutubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
