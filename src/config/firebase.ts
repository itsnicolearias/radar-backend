import * as admin from "firebase-admin";
import { config } from "./config";

const serviceAccount: admin.ServiceAccount = {
  projectId: config.firebaseProjectId,
  clientEmail: config.firebaseClientEmail,
  privateKey: config.firebasePrivateKey.replace(/\\n/g, '\n'),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
