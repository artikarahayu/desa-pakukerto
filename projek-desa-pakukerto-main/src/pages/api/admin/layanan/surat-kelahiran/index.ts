import { NextApiRequest, NextApiResponse } from "next";
import { updateSuratKelahiranSchema } from "@/schemas/surat-kelahiran.schema";
import {
  initializeAdminAndGetDb,
  verifyAdminRequest,
  handleAdminApiError,
} from "@/lib/admin-helpers";

// Initialize Firebase Admin and get Firestore
const db = initializeAdminAndGetDb();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await verifyAdminRequest(req);

    if (req.method === "GET") {
      try {
        const { status } = req.query;

        // Base query - always filter by jenisSurat
        let query = db
          .collection("permohonansurat")
          .where("jenisSurat", "==", "surat-keterangan-kelahiran");

        // Filter by status if provided and not 'all'
        if (status && typeof status === "string" && status !== "all") {
          // Validate status value
          if (status !== "pending" && status !== "finish") {
            return res
              .status(400)
              .json({
                message:
                  "Status tidak valid. Gunakan 'pending', 'finish', atau 'all'",
              });
          }

          // Apply status filter
          query = query.where("status", "==", status);
        }

        // Order by timestamp - this needs to be after where clauses
        query = query.orderBy("timestamp", "desc");

        // Execute query
        const snapshot = await query.get();

        // Process results
        const suratList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert Firestore timestamp to milliseconds
            timestamp: data.timestamp?.toMillis() || Date.now(),
          };
        });

        return res.status(200).json(suratList);
      } catch (error) {
        console.error("Error fetching surat kelahiran:", error);
        return res
          .status(500)
          .json({ message: "Terjadi kesalahan saat mengambil data surat" });
      }
    }

    if (req.method === "PUT") {
      const { id } = req.query;

      if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "ID surat tidak valid" });
      }

      const validationResult = updateSuratKelahiranSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.format(),
        });
      }

      const updateData = validationResult.data;

      // Update document in Firestore
      await db
        .collection("permohonansurat")
        .doc(id)
        .update({
          ...updateData,
          updatedAt: Date.now(),
        });

      // Get updated document
      const updatedDoc = await db.collection("permohonansurat").doc(id).get();

      if (!updatedDoc.exists) {
        return res.status(404).json({ message: "Surat tidak ditemukan" });
      }

      return res.status(200).json({
        id: updatedDoc.id,
        ...updatedDoc.data(),
        timestamp: updatedDoc.data()?.timestamp?.toMillis() || Date.now(),
      });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "ID surat tidak valid" });
      }

      // Check if document exists
      const docRef = db.collection("permohonansurat").doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ message: "Surat tidak ditemukan" });
      }

      // Delete document from Firestore
      await docRef.delete();

      return res.status(200).json({ message: "Surat berhasil dihapus" });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  } catch (error: any) {
    const errorResponse = handleAdminApiError(error);
    return res
      .status(errorResponse.status)
      .json({ message: errorResponse.message });
  }
}
