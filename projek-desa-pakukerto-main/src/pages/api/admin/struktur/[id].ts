import { NextApiRequest, NextApiResponse } from "next";
import { updateStrukturSchema } from "@/schemas/struktur.schema";
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
      return res.status(400).json({ message: "Invalid struktur ID" });
    }

    const strukturRef = db.collection("struktur_organisasi").doc(id);

    switch (req.method) {
      case "GET": {
        const strukturSnap = await strukturRef.get();

        if (!strukturSnap.exists) {
          return res.status(404).json({ message: "Struktur not found" });
        }

        return res.status(200).json({
          id: strukturSnap.id,
          ...strukturSnap.data(),
        });
      }

      case "PUT": {
        const strukturSnap = await strukturRef.get();
        if (!strukturSnap.exists) {
          return res.status(404).json({ message: "Struktur not found" });
        }

        const validationResult = updateStrukturSchema.safeParse(req.body);
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

        await strukturRef.update(updates);

        const updatedStrukturSnap = await strukturRef.get();

        return res.status(200).json({
          id: updatedStrukturSnap.id,
          ...updatedStrukturSnap.data(),
        });
      }

      case "DELETE": {
        const strukturSnap = await strukturRef.get();

        if (!strukturSnap.exists) {
          return res.status(404).json({ message: "Struktur not found" });
        }

        await strukturRef.delete();

        return res.status(200).json({ message: "Struktur deleted successfully" });
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
