import * as admin from "firebase-admin"
import { config } from "./config"

const serviceAccount: admin.ServiceAccount = {
  projectId: config.firebaseProjectId,
  clientEmail: config.firebaseClientEmail,
  privateKey: config.firebasePrivateKey ? config.firebasePrivateKey.replace(/\\n/g, "\n") : undefined,
}

if (admin && admin.initializeApp) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  } catch {
    // initialization may fail in test environments — ignore
  }
}

export default admin

/**
 * Lightweight wrapper to send a multicast message to device tokens.
 * We keep a minimal, loosely-typed surface here so services don't need
 * to depend on firebase-admin runtime typings directly.
 */
export const sendToDevices = async (tokens: string[], payload: unknown): Promise<unknown> => {
  // delegate to firebase-admin at runtime; keep the weak typing inside this module
  const p = payload as Record<string, unknown>
  const firebaseLike = admin as unknown as { messaging: () => { sendMulticast: (_msg: Record<string, unknown>) => unknown } }
  return firebaseLike.messaging().sendMulticast({
    tokens,
    notification: p.notification as Record<string, unknown> | undefined,
    data: p.data as Record<string, string> | undefined,
  })
}
