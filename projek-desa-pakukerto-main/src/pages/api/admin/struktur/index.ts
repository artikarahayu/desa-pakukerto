import { NextApiRequest, NextApiResponse } from "next";
import { createStrukturSchema } from "@/schemas/struktur.schema";
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
      const strukturRef = db.collection("struktur_organisasi");
      const snapshot = await strukturRef.get();

      const struktur = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json(struktur);
    }

    if (req.method === "POST") {
      const validationResult = createStrukturSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.format(),
        });
      }

      const { nama, jabatan, foto } = validationResult.data;
      const now = Date.now();

      const newStruktur = {
        nama,
        jabatan,
        foto,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection("struktur_organisasi").add(newStruktur);

      return res.status(201).json({
        id: docRef.id,
        ...newStruktur,
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
