// src/app/api/firebaseAdmin.ts
import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

type ServiceAccountJSON = {
  project_id: string;
  client_email: string;
  private_key: string;
};

type ServiceAccount = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

let _app: App | null = null;

function isServiceAccountJSON(v: unknown): v is ServiceAccountJSON {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.project_id === "string" &&
    typeof o.client_email === "string" &&
    typeof o.private_key === "string"
  );
}

function getServiceAccount(): ServiceAccount {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON");
  }

  if (!isServiceAccountJSON(parsed)) {
    throw new Error(
      'Service account must include "project_id", "client_email", "private_key" (strings)'
    );
  }

  return {
    projectId: parsed.project_id,
    clientEmail: parsed.client_email,
    privateKey: parsed.private_key.replace(/\\n/g, "\n"),
  };
}

export function getAdminApp(): App {
  if (_app) return _app;
  const apps = getApps();
  if (apps.length > 0) {
    _app = apps[0];
    return _app;
  }
  const sa = getServiceAccount();
  _app = initializeApp({
    credential: cert({
      projectId: sa.projectId,
      clientEmail: sa.clientEmail,
      privateKey: sa.privateKey,
    }),
    projectId: sa.projectId,
  });
  return _app;
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}
