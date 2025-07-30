import { NextApiRequest, NextApiResponse } from "next";
import { updateSuratPengantarSKCKSchema } from "@/schemas/surat-pengantar-skck.schema";
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
          .where("jenisSurat", "==", "surat-pengantar-skck");

        // Filter by status if provided and not 'all'
        if (status && typeof status === "string" && status !== "all") {
          // Validate status value
          if (status !== "pending" && status !== "finish") {
            return res.status(400).json({
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
        const suratList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return res.status(200).json(suratList);
      } catch (error) {
        console.error("Error fetching surat pengantar SKCK:", error);
        return res.status(500).json({
          message: "Gagal mengambil data surat pengantar SKCK",
        });
      }
    }

    if (req.method === "PUT") {
      try {
        const { id } = req.query;

        if (!id || typeof id !== "string") {
          return res.status(400).json({
            message: "ID surat tidak valid",
          });
        }

        // Validate request body
        const validationResult = updateSuratPengantarSKCKSchema.safeParse(
          req.body
        );

        if (!validationResult.success) {
          return res.status(400).json({
            message: "Data tidak valid",
            errors: validationResult.error.issues,
          });
        }

        const updateData = validationResult.data;

        // Update document
        const docRef = db.collection("permohonansurat").doc(id);
        await docRef.update(updateData);

        return res.status(200).json({
          message: "Surat pengantar SKCK berhasil diperbarui",
        });
      } catch (error) {
        console.error("Error updating surat pengantar SKCK:", error);
        return res.status(500).json({
          message: "Gagal memperbarui surat pengantar SKCK",
        });
      }
    }

    if (req.method === "DELETE") {
      try {
        const { id } = req.query;

        if (!id || typeof id !== "string") {
          return res.status(400).json({
            message: "ID surat tidak valid",
          });
        }

        // Delete document
        const docRef = db.collection("permohonansurat").doc(id);
        await docRef.delete();

        return res.status(200).json({
          message: "Surat pengantar SKCK berhasil dihapus",
        });
      } catch (error) {
        console.error("Error deleting surat pengantar SKCK:", error);
        return res.status(500).json({
          message: "Gagal menghapus surat pengantar SKCK",
        });
      }
    }

    // Method not allowed
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({
      message: `Method ${req.method} Not Allowed`,
    });
  } catch (error) {
    return handleAdminApiError(error);
  }
}
