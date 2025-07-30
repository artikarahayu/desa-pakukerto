import { NextApiRequest, NextApiResponse } from "next";
import { updateDusunSchema, generateSlug } from "@/schemas/dusun.schema";
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
      return res.status(400).json({ message: "Invalid dusun ID" });
    }

    const dusunRef = db.collection("dusunProfiles").doc(id);

    switch (req.method) {
      case "GET": {
        const dusunSnap = await dusunRef.get();

        if (!dusunSnap.exists) {
          return res.status(404).json({ message: "Dusun profile not found" });
        }

        return res.status(200).json({
          id: dusunSnap.id,
          ...dusunSnap.data(),
        });
      }

      case "PUT": {
        const dusunSnap = await dusunRef.get();
        if (!dusunSnap.exists) {
          return res.status(404).json({ message: "Dusun profile not found" });
        }

        const validationResult = updateDusunSchema.safeParse(req.body);
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

        // If nama is updated, update the slug as well
        if (updateData.nama) {
          updates.slug = generateSlug(updateData.nama);
        }

        await dusunRef.update(updates);

        const updatedDusunSnap = await dusunRef.get();

        return res.status(200).json({
          id: updatedDusunSnap.id,
          ...updatedDusunSnap.data(),
        });
      }

      case "DELETE": {
        const dusunSnap = await dusunRef.get();

        if (!dusunSnap.exists) {
          return res.status(404).json({ message: "Dusun profile not found" });
        }

        await dusunRef.delete();

        return res.status(200).json({ message: "Dusun profile deleted successfully" });
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
