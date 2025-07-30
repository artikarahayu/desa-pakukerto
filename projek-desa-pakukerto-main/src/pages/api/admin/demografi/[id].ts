import { NextApiRequest, NextApiResponse } from "next";
import { updateDemografiSchema } from "@/schemas/demografi.schema";
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

    const demografiRef = db.collection("demografi_penduduk").doc(id);
    const demografiDoc = await demografiRef.get();

    if (!demografiDoc.exists) {
      return res.status(404).json({ message: "Data demografi tidak ditemukan" });
    }

    if (req.method === "GET") {
      return res.status(200).json({
        id: demografiDoc.id,
        ...demografiDoc.data(),
      });
    }

    if (req.method === "PUT") {
      const validationResult = updateDemografiSchema.safeParse(req.body);

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

      await demografiRef.update(updateData);

      return res.status(200).json({
        id: demografiDoc.id,
        ...demografiDoc.data(),
        ...updateData,
      });
    }

    if (req.method === "DELETE") {
      await demografiRef.delete();
      return res.status(200).json({ message: "Data demografi berhasil dihapus" });
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
