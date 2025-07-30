import { NextApiRequest, NextApiResponse } from "next";
import { createApbdesSchema } from "@/schemas/apbdes.schema";
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
      const apbdesRef = db.collection("apbdes");
      const snapshot = await apbdesRef.get();

      const apbdesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json(apbdesData);
    }

    if (req.method === "POST") {
      const validationResult = createApbdesSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.format(),
        });
      }

      const apbdesData = validationResult.data;
      const now = Date.now();

      const newApbdes = {
        ...apbdesData,
        lastUpdated: now,
      };

      // Check if document with this year already exists
      const yearQuery = await db.collection("apbdes")
        .where("tahun", "==", apbdesData.tahun)
        .get();
      
      if (!yearQuery.empty) {
        return res.status(400).json({
          message: `Data APBDes untuk tahun ${apbdesData.tahun} sudah ada`
        });
      }

      const docRef = await db.collection("apbdes").add(newApbdes);

      return res.status(201).json({
        id: docRef.id,
        ...newApbdes,
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
