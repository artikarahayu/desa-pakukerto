import { NextApiRequest, NextApiResponse } from "next";
import { createUmkmSchema } from "@/schemas/umkm.schema";
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
      const umkmRef = db.collection("umkm");
      const snapshot = await umkmRef.get();

      const umkmProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json(umkmProducts);
    }

    if (req.method === "POST") {
      const validationResult = createUmkmSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.format(),
        });
      }

      const { nama, deskripsi, gambar, whatsapp, harga } = validationResult.data;
      const now = Date.now();

      const newUmkm = {
        nama,
        deskripsi,
        gambar,
        whatsapp,
        harga,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection("umkm").add(newUmkm);

      return res.status(201).json({
        id: docRef.id,
        ...newUmkm,
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
