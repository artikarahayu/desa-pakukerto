import { format } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format a timestamp to a localized date string
 * Handles various timestamp formats:
 * - Unix timestamp (number)
 * - Firestore timestamp (with toDate method)
 * - Serialized Firestore timestamp (with seconds property)
 * - Date strings
 * 
 * @param timestamp The timestamp to format
 * @param formatStr Optional format string (default: "d MMMM yyyy")
 * @returns Formatted date string or empty string if invalid
 */
export const formatDate = (timestamp: unknown, formatStr: string = "d MMMM yyyy"): string => {
  if (!timestamp) return "";
  
  try {
    // Handle various timestamp formats
    let date: Date;

    if (typeof timestamp === "number") {
      // It's a Unix timestamp in milliseconds
      date = new Date(timestamp);
    } else if (typeof timestamp === "object" && timestamp !== null) {
      const tsObj = timestamp as Record<string, unknown>;
      if (typeof tsObj.toDate === "function") {
        // It's a Firestore timestamp
        date = tsObj.toDate();
      } else if (typeof tsObj.seconds === "number") {
        // It's a serialized timestamp
        date = new Date(tsObj.seconds * 1000);
      } else {
        // Fallback
        date = new Date(String(timestamp));
      }
    } else {
      // Try to parse as date string
      date = new Date(String(timestamp));
    }

    // Validate the date is valid before formatting
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", timestamp);
      return "";
    }

    return format(date, formatStr, { locale: id });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

/**
 * Calculate estimated reading time for content
 * @param content HTML content
 * @param wordsPerMinute Reading speed (default: 200 words per minute)
 * @returns Reading time in minutes (minimum 1)
 */
export const calculateReadingTime = (content: string, wordsPerMinute: number = 200): number => {
  if (!content) return 1;
  
  const textContent = content.replace(/<[^>]+>/g, "");
  const words = textContent.split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  
  return readingTime > 0 ? readingTime : 1;
};
