const express = require("express");
const axios = require("axios");
const app = express();

const admin = require("firebase-admin");
const credentials = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const db = admin.firestore();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//signup endpoint
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const userResponse = await admin.auth().createUser({
      email: user.email,
      password: user.password,
      emailVerified: false,
      disabled: false,
    });
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Firebase Authentication REST API URL
const FIREBASE_AUTH_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY";

//login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Pengecekan apakah email dan password dikirim
  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password diperlukan" });
  }

  try {
    // Kirim request ke Firebase Authentication API untuk memverifikasi login
    const response = await axios.post(FIREBASE_AUTH_URL, {
      email: email,
      password: password,
      returnSecureToken: true,
    });

    // Ambil ID token dari respons Firebase
    const idToken = response.data.idToken;

    // Kirim token ke frontend
    return res
      .status(200)
      .json({ message: "Login berhasil", token: customToken });
  } catch (error) {
    // Jika terjadi kesalahan (misal: pengguna tidak ditemukan)
    return res.status(400).json({ error: "Login gagal: " + error.message });
  }
});

//set post and listen for our requests

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}.`);
});
