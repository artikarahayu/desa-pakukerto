import { NextApiRequest, NextApiResponse } from "next";
import { createBeritaSchema } from "@/schemas/berita.schema";
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

    if (req.method === "GET") {
      const beritaRef = db.collection("berita");
      const snapshot = await beritaRef.get();

      const berita = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json(berita);
    }

    if (req.method === "POST") {
      const validationResult = createBeritaSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.format(),
        });
      }

      const { judul, thumbnail, isi } = validationResult.data;
      const slug = toKebabCase(judul);

      const now = Date.now();

      const newBerita = {
        judul,
        slug,
        thumbnail,
        isi,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection("berita").add(newBerita);

      return res.status(201).json({
        id: docRef.id,
        ...newBerita,
      });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  } catch (error: any) {
    const errorResponse = handleAdminApiError(error);
    return res.status(errorResponse.status).json({ message: errorResponse.message });
  }
}
