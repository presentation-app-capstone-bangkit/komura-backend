const admin = require("../config/firebase");

exports.getRecordings = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    console.error("Logged user is missing in query parameters");
    return res.status(400).send("Logged user is required");
  }

  try {
    console.log("Attempting to fetch user with ID:", userId);
    const userRef = admin.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error("No user found with ID:", userId);
      return res.status(404).send("No User Found.");
    }

    console.log("User ID found:", userId);
    const recordings = [];
    const recordingsRef = await userRef.collection("recordings").get();

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
  const { userId, title, description, audioUrl } = req.body;

  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).send("No User Found.");
    }

    const recording = {
      title: title,
      description: description,
      audioUrl: audioUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await userRef.collection("recordings").add(recording);

    return res.status(201).send("Recording created successfully.");
  } catch (error) {
    console.error("Error saving recording to Firestore: ", error);
    return res
      .status(500)
      .send(`Error saving recording to Firestore: ${error.message}`);
  }
};

exports.deleteRecording = async (req, res) => {
  const { userId, recordingId } = req.body;

  if (!userId || !recordingId) {
    return res.status(400).send("User ID and Recording ID are required");
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).send("No User Found.");
    }

    await userRef.collection("recordings").doc(recordingId).delete();

    return res.status(200).send("Recording deleted successfully.");
  } catch (error) {
    console.error("Error deleting recording from Firestore: ", error);
    return res
      .status(500)
      .send(`Error deleting recording from Firestore: ${error.message}`);
  }
};
