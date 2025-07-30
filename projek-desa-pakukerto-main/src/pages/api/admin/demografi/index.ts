import { NextApiRequest, NextApiResponse } from "next";
import { createDemografiSchema } from "@/schemas/demografi.schema";
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
      const demografiRef = db.collection("demografi_penduduk");
      const snapshot = await demografiRef.get();

      const demografiData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json(demografiData);
    }

    if (req.method === "POST") {
      const validationResult = createDemografiSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.format(),
        });
      }

      const demografiData = validationResult.data;
      const now = Date.now();

      const newDemografi = {
        ...demografiData,
        lastUpdated: now,
      };

      const docRef = await db.collection("demografi_penduduk").add(newDemografi);

      return res.status(201).json({
        id: docRef.id,
        ...newDemografi,
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
