import { NextApiRequest } from "next";
import { initAdmin } from "@/lib/firebase-admin";
import { auth as adminAuth } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Initialize Firebase Admin and return Firestore instance
 * This ensures Firebase Admin is initialized only once
 */
export function initializeAdminAndGetDb() {
  initAdmin();
  return getFirestore();
}

/**
 * Verify the admin token from the request and check if the user is an admin
 * @param req - Next.js API request
 * @returns The decoded token if verification is successful
 * @throws Error if token is missing or user is not an admin
 */
export async function verifyAdminRequest(req: NextApiRequest) {
  const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];
  
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) throw new Error("MISSING_TOKEN");

  const decoded = await adminAuth().verifyIdToken(token);

  if (!ADMIN_EMAILS.includes(decoded.email!)) {
    throw new Error("FORBIDDEN");
  }

  return decoded;
}

/**
 * Handle common API errors from admin verification
 * @param error - The caught error
 * @param res - Next.js API response
 * @returns Whether the error was handled (true) or not (false)
 */
export function handleAdminApiError(error: any) {
  if (error.message === "MISSING_TOKEN") {
    return {
      status: 401,
      message: "Unauthorized: Missing token"
    };
  }

  if (error.message === "FORBIDDEN") {
    return {
      status: 403,
      message: "Forbidden: Admin only"
    };
  }

  console.error("API Error:", error);
  return {
    status: 500,
    message: "Internal Server Error"
  };
}
