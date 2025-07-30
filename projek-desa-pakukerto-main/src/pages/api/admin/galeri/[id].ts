import { NextApiRequest, NextApiResponse } from "next";
import { updateGaleriSchema } from "@/schemas/galeri.schema";
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
      return res.status(400).json({ message: "Invalid gallery item ID" });
    }

    const galeriRef = db.collection("galeri").doc(id);

    switch (req.method) {
      case "GET": {
        const galeriSnap = await galeriRef.get();

        if (!galeriSnap.exists) {
          return res.status(404).json({ message: "Gallery item not found" });
        }

        return res.status(200).json({
          id: galeriSnap.id,
          ...galeriSnap.data(),
        });
      }

      case "PUT": {
        const galeriSnap = await galeriRef.get();
        if (!galeriSnap.exists) {
          return res.status(404).json({ message: "Gallery item not found" });
        }

        const validationResult = updateGaleriSchema.safeParse(req.body);
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

        await galeriRef.update(updates);

        const updatedGaleriSnap = await galeriRef.get();

        return res.status(200).json({
          id: updatedGaleriSnap.id,
          ...updatedGaleriSnap.data(),
        });
      }

      case "DELETE": {
        const galeriSnap = await galeriRef.get();

        if (!galeriSnap.exists) {
          return res.status(404).json({ message: "Gallery item not found" });
        }

        await galeriRef.delete();

        return res.status(200).json({ message: "Gallery item deleted successfully" });
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
