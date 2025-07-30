import { NextApiRequest, NextApiResponse } from "next";
import { updateBeritaSchema } from "@/schemas/berita.schema";
import { initializeAdminAndGetDb, verifyAdminRequest, handleAdminApiError } from "@/lib/admin-helpers";

// Initialize Firebase Admin and get Firestore
const db = initializeAdminAndGetDb();

// Helper: Slugify
function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await verifyAdminRequest(req);

    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Invalid berita ID" });
    }

    const beritaRef = db.collection("berita").doc(id);

    switch (req.method) {
      case "GET": {
        const beritaSnap = await beritaRef.get();

        if (!beritaSnap.exists) {
          return res.status(404).json({ message: "Berita not found" });
        }

        return res.status(200).json({
          id: beritaSnap.id,
          ...beritaSnap.data(),
        });
      }

      case "PUT": {
        const beritaSnap = await beritaRef.get();
        if (!beritaSnap.exists) {
          return res.status(404).json({ message: "Berita not found" });
        }

        const validationResult = updateBeritaSchema.safeParse(req.body);
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

        if (updateData.judul) {
          updates.slug = toKebabCase(updateData.judul);
        }

        await beritaRef.update(updates);

        const updatedBeritaSnap = await beritaRef.get();

        return res.status(200).json({
          id: updatedBeritaSnap.id,
          ...updatedBeritaSnap.data(),
        });
      }

      case "DELETE": {
        const beritaSnap = await beritaRef.get();

        if (!beritaSnap.exists) {
          return res.status(404).json({ message: "Berita not found" });
        }

        await beritaRef.delete();

        return res.status(200).json({ message: "Berita deleted successfully" });
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
