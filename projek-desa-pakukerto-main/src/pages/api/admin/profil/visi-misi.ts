import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { initializeAdminAndGetDb, verifyAdminRequest, handleAdminApiError } from "@/lib/admin-helpers";

// Initialize Firebase Admin and get Firestore
const db = initializeAdminAndGetDb();

// Define schema for validation
const visiMisiSchema = z.object({
  content: z.string().min(1, "Visi & Misi tidak boleh kosong"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await verifyAdminRequest(req);

    const docRef = db.collection("profilDesa").doc("visiMisi");

    switch (req.method) {
      case "GET": {
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
          return res.status(200).json({ content: "" });
        }

        return res.status(200).json(docSnap.data());
      }

      case "POST": {
        const validationResult = visiMisiSchema.safeParse(req.body);

        if (!validationResult.success) {
          return res.status(400).json({
            message: "Validation failed",
            errors: validationResult.error.format(),
          });
        }

        const { content } = validationResult.data;

        await docRef.set(
          {
            content,
            updatedAt: Date.now(),
          },
          { merge: true }
        );

        return res.status(200).json({ content });
      }

      default: {
        res.setHeader("Allow", ["GET", "POST"]);
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
