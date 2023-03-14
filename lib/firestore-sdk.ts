import * as firebaseAdmin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
/*
 * Credential
 */
let cred = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key
    ?.replace(/\\n/g, "\n")
    .replace(/\\\\/g, "\\"),
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url,
};

const serviceAccount = Object.assign({}, cred) as ServiceAccount;
const app = firebaseAdmin.apps.length
  ? firebaseAdmin.app()
  : firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
    });

export const db = app.firestore();
export const auth = app.auth();
