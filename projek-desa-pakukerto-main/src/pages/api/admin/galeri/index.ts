import { NextApiRequest, NextApiResponse } from "next";
import { createGaleriSchema } from "@/schemas/galeri.schema";
import { initializeAdminAndGetDb, verifyAdminRequest, handleAdminApiError } from "@/lib/admin-helpers";

// Initialize Firebase Admin and get Firestore
const db = initializeAdminAndGetDb();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await verifyAdminRequest(req);

    if (req.method === "GET") {
      const galeriRef = db.collection("galeri");
      const snapshot = await galeriRef.orderBy("createdAt", "desc").get();

      const galeri = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json(galeri);
    }

    if (req.method === "POST") {
      const validationResult = createGaleriSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.format(),
        });
      }

      const galeriData = validationResult.data;
      const now = Date.now();

      const newGaleri = {
        ...galeriData,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection("galeri").add(newGaleri);

      return res.status(201).json({
        id: docRef.id,
        ...newGaleri,
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
