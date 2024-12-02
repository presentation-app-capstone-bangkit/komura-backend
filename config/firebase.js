require("dotenv").config();
const admin = require("firebase-admin");

let serviceAccount;

// Gunakan kredensial default jika di Cloud Functions, jika tidak gunakan kredensial yang ada di .env
if (process.env.FUNCTIONS_EMULATOR || process.env.NODE_ENV === "development") {
  // Di lingkungan pengembangan lokal, gunakan kredensial dari .env
  serviceAccount = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"), // Mengonversi \n yang disimpan sebagai string
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  };
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
      "https://komura-app-9ca8e-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
} else {
  // Di Cloud Functions, gunakan kredensial default
  admin.initializeApp({
    databaseURL:
      "https://komura-app-9ca8e-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

module.exports = admin;
