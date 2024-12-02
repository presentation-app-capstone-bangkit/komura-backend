const admin = require("../config/firebase");

exports.getRecordings = async (req, res) => {
  const { loggedUser } = req.query;

  if (!loggedUser) {
    console.error("Logged user is missing in query parameters");
    return res.status(400).send("Logged user is required");
  }

  try {
    console.log("Attempting to fetch user with email:", loggedUser);
    const userRef = admin.firestore().collection("users");
    const snapshot = await userRef.where("email", "==", loggedUser).get();

    if (snapshot.empty) {
      console.error("No user found with email:", loggedUser);
      return res.status(404).send("No User Found.");
    }

    let userId;
    snapshot.forEach((doc) => {
      userId = doc.id;
    });

    console.log("User ID found:", userId);
    const recordings = [];
    const recordingsRef = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("recordings")
      .get();

    recordingsRef.forEach((doc) => {
      recordings.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).send(recordings);
  } catch (error) {
    console.error("Error getting documents:", error);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

exports.createRecording = async (req, res) => {
  const { loggedUser, title, description, audioUrl } = req.body;
  try {
    const userRef = admin.firestore().collection("users");
    const snapshot = await userRef.where("email", "==", loggedUser).get();

    if (snapshot.empty) {
      return res.status(404).send("No User Found.");
    }

    let userId;
    snapshot.forEach((doc) => {
      userId = doc.id;
    });

    try {
      const recording = {
        title: title,
        description: description,
        audioUrl: audioUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("recordings")
        .add(recording);

      // Mengirim respons dan menghentikan eksekusi fungsi
      return res.status(201).send("Recording created successfully.");
    } catch (firestoreError) {
      return res
        .status(500)
        .send(`Error saving recording to Firestore: ${firestoreError.message}`);
    }
  } catch (error) {
    console.error("Error getting documents: ", error);
    return res.status(500).send("Error getting documents");
  }
};

exports.deleteRecording = async (req, res) => {
  const { loggedUser, recordingId } = req.body;
  try {
    const userRef = admin.firestore().collection("users");
    const snapshot = await userRef.where("email", "==", loggedUser).get();

    if (snapshot.empty) {
      return res.status(404).send("No User Found.");
    }

    let userId;
    snapshot.forEach((doc) => {
      userId = doc.id;
    });

    try {
      await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("recordings")
        .doc(recordingId)
        .delete();

      res.status(200).send("Recording deleted successfully.");
    } catch (firestoreError) {
      return res
        .status(500)
        .send(
          `Error deleting recording from Firestore: ${firestoreError.message}`
        );
    }
  } catch (error) {
    console.error("Error getting documents: ", error);
    res.status(500).send("Error getting documents");
  }
};
