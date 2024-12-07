const admin = require("../config/firebase");
const { uploadPictureProfile } = require("./audio-bucket-controller");

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

exports.changePictureProfile = async (req, res) => {
  const { userId, photoFile } = req.body;
  if (!userId || !photoFile) {
    return res.status(400).send("User ID and photoFile are required");
  }
  const allowedTypes = ["image/png", "image/jpeg, image/jpg"];
  if (!allowedTypes.includes(photoFile.mimetype)) {
    return res.status(400).send("Only PNG and JPEG photoFiles are allowed");
  }
  if (photoFile.size > 5 * 1024 * 1024) {
    return res.status(400).send("photoFile size must be less than 5MB");
  }

  const photoUrl = await uploadPictureProfile(photoFile, photoFile.name);

  // Save photoUrl to Firestore, under the user document, photoUrl: photoUrl
  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.update({ photoUrl });
  } catch (error) {
    return res
      .status(500)
      .send(`Error saving photoUrl to Firestore: ${error.message}`);
  }

  return res.status(200).send("Profile picture updated successfully.");
};
