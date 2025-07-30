import { NextApiRequest, NextApiResponse } from "next";
import { createApbdesSchema } from "@/schemas/apbdes.schema";
import { initializeAdminAndGetDb, verifyAdminRequest, handleAdminApiError } from "@/lib/admin-helpers";

// Initialize Firebase Admin and get Firestore
const db = initializeAdminAndGetDb();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await verifyAdminRequest(req);

    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const apbdesRef = db.collection("apbdes").doc(id);
    const apbdesDoc = await apbdesRef.get();

    if (!apbdesDoc.exists) {
      return res.status(404).json({ message: "Data APBDes tidak ditemukan" });
    }

    if (req.method === "GET") {
      return res.status(200).json({
        id: apbdesDoc.id,
        ...apbdesDoc.data(),
      });
    }

    if (req.method === "PUT") {
      const validationResult = createApbdesSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.format(),
        });
      }

      const updateData = {
        ...validationResult.data,
        lastUpdated: Date.now(),
      };

      // If year is being updated, check if it conflicts with another document
      if (updateData.tahun && updateData.tahun !== apbdesDoc.data()?.tahun) {
        const yearQuery = await db.collection("apbdes")
          .where("tahun", "==", updateData.tahun)
          .get();
        
        if (!yearQuery.empty) {
          return res.status(400).json({
            message: `Data APBDes untuk tahun ${updateData.tahun} sudah ada`
          });
        }
      }

      await apbdesRef.update(updateData);

      return res.status(200).json({
        id: apbdesDoc.id,
        ...apbdesDoc.data(),
        ...updateData,
      });
    }

    if (req.method === "DELETE") {
      await apbdesRef.delete();
      return res.status(200).json({ message: "Data APBDes berhasil dihapus" });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  } catch (error: any) {
    const errorResponse = handleAdminApiError(error);
    return res.status(errorResponse.status).json({ message: errorResponse.message });
  }
}
