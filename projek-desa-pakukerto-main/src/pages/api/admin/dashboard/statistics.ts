import { NextApiRequest, NextApiResponse } from "next";
import {
  initializeAdminAndGetDb,
  verifyAdminRequest,
  handleAdminApiError,
} from "@/lib/admin-helpers";

// Initialize Firebase Admin and get Firestore
const db = initializeAdminAndGetDb();

// Define the surat types mapping for readable names
const suratTypeNames: Record<string, string> = {
  "surat-keterajakan-kelahiran": "Surat Keterangan Kelahiran",
  "surat-izin-keramaian": "Surat Izin Keramaian",
  "surat-pengantar-skck": "Surat Pengantar SKCK",
  "surat-keterangan-kematian": "Surat Keterangan Kematian",
  "surat-keterangan": "Surat Keterangan",
  "surat-keterangan-umum": "Surat Keterangan Umum",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await verifyAdminRequest(req);

    if (req.method === "GET") {
      // Get counts from each collection
      const [beritaSnapshot, umkmSnapshot, galeriSnapshot] = await Promise.all([
        db.collection("berita").get(),
        db.collection("umkm").get(),
        db.collection("galeri").get(),
      ]);

      // Calculate counts
      const beritaCount = beritaSnapshot.size;
      const umkmCount = umkmSnapshot.size;
      const galeriCount = galeriSnapshot.size;

      // Get pending layanan count
      const pendingLayananSnapshot = await db
        .collection("permohonansurat")
        .where("status", "==", "pending")
        .get();

      const layananPublikCount = pendingLayananSnapshot.size;

      // Get latest 10 pending surat requests
      const latestPendingSnapshot = await db
        .collection("permohonansurat")
        .where("status", "==", "pending")
        .orderBy("timestamp", "desc")
        .limit(10)
        .get();

      const latestPendingSurat = latestPendingSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          jenisSurat: data.jenisSurat,
          jenisSuratLabel: suratTypeNames[data.jenisSurat] || data.jenisSurat,
          namaLengkap:
            data.jenisSurat === "surat-keterangan-kematian"
              ? data.data?.namaPelapor || data.data?.nama || "Tidak ada nama"
              : data.jenisSurat === "surat-keterangan-kelahiran"
              ? data.data?.namaAyah
              : data.data?.namaLengkap || data.data?.nama || "Tidak ada nama",
          timestamp: data.timestamp?._seconds
            ? data.timestamp._seconds * 1000
            : Date.now(),
          status: data.status,
        };
      });

      // Return statistics
      return res.status(200).json({
        berita: {
          total: beritaCount,
        },
        umkm: {
          total: umkmCount,
        },
        galeri: {
          total: galeriCount,
        },
        layananPublik: {
          pending: layananPublikCount,
          latestPending: latestPendingSurat,
        },
      });
    }

    res.setHeader("Allow", ["GET"]);
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
