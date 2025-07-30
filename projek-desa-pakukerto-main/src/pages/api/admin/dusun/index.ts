import { NextApiRequest, NextApiResponse } from "next";
import { createDusunSchema, generateSlug } from "@/schemas/dusun.schema";
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
      const dusunRef = db.collection("dusunProfiles");
      const snapshot = await dusunRef.get();

      const dusunList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json(dusunList);
    }

    if (req.method === "POST") {
      const validationResult = createDusunSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.format(),
        });
      }

      const { nama, isi, gambar } = validationResult.data;
      const slug = generateSlug(nama);

      const now = Date.now();

      const newDusun = {
        nama,
        slug,
        isi,
        ...(gambar && { gambar }),
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection("dusunProfiles").add(newDusun);

      return res.status(201).json({
        id: docRef.id,
        ...newDusun,
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
