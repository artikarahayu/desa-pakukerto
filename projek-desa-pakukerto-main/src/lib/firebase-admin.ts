import { AppOptions, cert, getApps, initializeApp } from 'firebase-admin/app';

/**
 * Initialize Firebase Admin SDK
 * This is used for server-side operations like API routes
 */
export function initAdmin() {
  const apps = getApps();
  
  if (apps.length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Firebase Admin credentials are missing in environment variables');
    }
    
    const options: AppOptions = {
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    };
    
    initializeApp(options);
  }
}
