import { NextApiRequest, NextApiResponse } from "next";
import { createSuratPengantarSKCKSchema } from "@/schemas/surat-pengantar-skck.schema";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import axios from "axios";

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      throw new Error("reCAPTCHA secret key not configured");
    }

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    return response.data.success;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // Validate request body
    const validationResult = createSuratPengantarSKCKSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationResult.error.issues,
      });
    }

    const { recaptchaToken, ...formData } = validationResult.data;

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return res.status(400).json({
        message: "reCAPTCHA verification failed",
      });
    }

    // Save to Firestore
    const docRef = await addDoc(collection(db, "permohonansurat"), {
      jenisSurat: "surat-pengantar-skck",
      status: "pending",
      timestamp: serverTimestamp(),
      wa: formData.nomorWhatsApp,
      data: {
        namaLengkap: formData.namaLengkap,
        nik: formData.nik,
        tempatLahir: formData.tempatLahir,
        tanggalLahir: formData.tanggalLahir,
        jenisKelamin: formData.jenisKelamin,
        agama: formData.agama,
        statusPerkawinan: formData.statusPerkawinan,
        pekerjaan: formData.pekerjaan,
        alamat: formData.alamat,
        keperluan: formData.keperluan,
        nomorWhatsApp: formData.nomorWhatsApp,
      },
    });

    return res.status(201).json({
      message: "Permohonan surat pengantar SKCK berhasil dikirim",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error creating surat pengantar SKCK:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
