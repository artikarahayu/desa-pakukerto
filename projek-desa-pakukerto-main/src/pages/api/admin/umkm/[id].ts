import { NextApiRequest, NextApiResponse } from "next";
import { updateUmkmSchema } from "@/schemas/umkm.schema";
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
      return res.status(400).json({ message: "Invalid UMKM product ID" });
    }

    const umkmRef = db.collection("umkm").doc(id);

    switch (req.method) {
      case "GET": {
        const umkmSnap = await umkmRef.get();

        if (!umkmSnap.exists) {
          return res.status(404).json({ message: "UMKM product not found" });
        }

        return res.status(200).json({
          id: umkmSnap.id,
          ...umkmSnap.data(),
        });
      }

      case "PUT": {
        const umkmSnap = await umkmRef.get();
        if (!umkmSnap.exists) {
          return res.status(404).json({ message: "UMKM product not found" });
        }

        const validationResult = updateUmkmSchema.safeParse(req.body);
        if (!validationResult.success) {
          return res.status(400).json({
            message: "Validation failed",
            errors: validationResult.error.format(),
          });
        }

        const updateData = validationResult.data;
        const updates: Record<string, any> = {
          ...updateData,
          updatedAt: Date.now(),
        };

        await umkmRef.update(updates);

        const updatedUmkmSnap = await umkmRef.get();

        return res.status(200).json({
          id: updatedUmkmSnap.id,
          ...updatedUmkmSnap.data(),
        });
      }

      case "DELETE": {
        const umkmSnap = await umkmRef.get();

        if (!umkmSnap.exists) {
          return res.status(404).json({ message: "UMKM product not found" });
        }

        await umkmRef.delete();

        return res.status(200).json({ message: "UMKM product deleted successfully" });
      }

      default: {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res
          .status(405)
          .json({ message: `Method ${req.method} Not Allowed` });
      }
    }
  } catch (error: any) {
    const errorResponse = handleAdminApiError(error);
    return res.status(errorResponse.status).json({ message: errorResponse.message });
  }
}
