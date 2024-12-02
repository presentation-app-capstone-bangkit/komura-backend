const admin = require("../config/firebase");

// Register User
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    try {
      const user = {
        username: username,
        email: email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await admin.firestore().collection("users").doc(userRecord.uid).set(user);
    } catch (firestoreError) {
      return res
        .status(500)
        .send(`Error saving user to Firestore: ${firestoreError.message}`);
    }
    res.status(201).send(`User created: ${userRecord.uid}`);
  } catch (error) {
    res.status(400).send(`Error creating user: ${error.message}`);
  }
};
