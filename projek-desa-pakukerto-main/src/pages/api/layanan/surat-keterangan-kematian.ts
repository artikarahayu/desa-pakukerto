import { NextApiRequest, NextApiResponse } from "next";
import { createSuratKeteranganKematianSchema } from "@/schemas/surat-keterangan-kematian.schema";
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
    const validationResult = createSuratKeteranganKematianSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationResult.error.format(),
      });
    }

    const formData = validationResult.data;

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(formData.recaptchaToken);
    if (!isRecaptchaValid) {
      return res.status(400).json({
        message: "reCAPTCHA verification failed",
      });
    }

    // Prepare data for Firestore
    const {
      recaptchaToken,
      nomorWhatsApp,
      ...dataFields
    } = formData;

    const suratData = {
      jenisSurat: "surat-keterangan-kematian",
      status: "pending",
      timestamp: serverTimestamp(),
      nomorSurat: "",
      data: dataFields,
      wa: nomorWhatsApp,
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, "permohonansurat"), suratData);

    return res.status(201).json({
      message: "Permohonan surat berhasil dikirim",
      id: docRef.id,
    });
  } catch (error: any) {
    console.error("Error creating surat keterangan kematian:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
}
