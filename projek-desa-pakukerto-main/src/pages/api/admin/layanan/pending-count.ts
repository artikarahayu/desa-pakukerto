import { NextApiRequest, NextApiResponse } from "next";
import {
  initializeAdminAndGetDb,
  verifyAdminRequest,
  handleAdminApiError,
} from "@/lib/admin-helpers";

// Initialize Firebase Admin and get Firestore
const db = initializeAdminAndGetDb();

// Define the surat types
const suratTypes = [
  "surat-keterangan-kelahiran",
  "surat-izin-keramaian",
  "surat-pengantar-skck",
  "surat-keterangan-umum",
  "surat-keterangan-kematian",
  "surat-keterangan"
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await verifyAdminRequest(req);

    if (req.method === "GET") {
      try {
        // Get total count of all pending requests
        const totalSnapshot = await db
          .collection("permohonansurat")
          .where("status", "==", "pending")
          .get();

        const totalPendingCount = totalSnapshot.size;

        // Get counts for each surat type
        const typeCounts: Record<string, number> = {};
        
        // Use Promise.all to run all queries in parallel
        await Promise.all(
          suratTypes.map(async (type) => {
            const typeSnapshot = await db
              .collection("permohonansurat")
              .where("jenisSurat", "==", type)
              .where("status", "==", "pending")
              .get();
            
            typeCounts[type] = typeSnapshot.size;
          })
        );

        // Return both total count and per-type counts
        return res.status(200).json({
          total: totalPendingCount,
          types: {
            "surat-keterangan-kelahiran": typeCounts["surat-keterangan-kelahiran"] || 0,
            "surat-izin-keramaian": typeCounts["surat-izin-keramaian"] || 0,
            "surat-pengantar-skck": typeCounts["surat-pengantar-skck"] || 0,
            "surat-keterangan-umum": typeCounts["surat-keterangan-umum"] || 0,
            "surat-keterangan-kematian": typeCounts["surat-keterangan-kematian"] || 0,
            "surat-keterangan": typeCounts["surat-keterangan"] || 0
          }
        });
      } catch (error) {
        console.error("Error fetching pending counts:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat mengambil data permohonan" });
      }
    }

    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  } catch (error: any) {
    const errorResponse = handleAdminApiError(error);
    return res
      .status(errorResponse.status)
      .json({ message: errorResponse.message });
  }
}
