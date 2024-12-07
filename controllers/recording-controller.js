const admin = require("../config/firebase");
const { calculateFeedback } = require("../utils/recordingFeedback");
const { deleteAudio } = require("./audio-bucket-controller");

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

exports.getRecording = async (req, res) => {
  const { userId, recordingId } = req.query;

  if (!userId || !recordingId) {
    console.error("User ID and Recording ID are required");
    return res.status(400).send("User ID and Recording ID are required");
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error("No user found with ID:", userId);
      return res.status(404).send("No User Found.");
    }

    const recordingRef = await userRef
      .collection("recordings")
      .doc(recordingId);
    const recordingDoc = await recordingRef.get();

    if (!recordingDoc.exists) {
      console.error("No recording found with ID:", recordingId);
      return res.status(404).send("No Recording Found.");
    }

    calculateFeedback(recordingDoc.data());

    res.status(200).send({
      id: recordingDoc.id,
      ...recordingDoc.data(),
      feedback: calculateFeedback(recordingDoc.data()),
    });
  } catch (error) {
    console.error("Error getting document:", error);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

exports.createRecording = async (req, res) => {
  const {
    userId,
    recordingTitle,
    audioUrl,
    transcribe,
    fillers_count,
    duration,
    word_count,
    wpm,
    pace,
    confidence,
    confidentLabel,
  } = req.body;

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
      recordingTitle: recordingTitle,
      audioUrl: audioUrl,
      transcribe: transcribe,
      fillers_count: fillers_count,
      duration: duration,
      word_count: word_count,
      pace: pace,
      wpm: wpm,
      confidence: confidence,
      confidentLabel: confidentLabel,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const recordingsRef = await userRef.collection("recordings").add(recording);

    return res.status(201).send({
      message: "Recording created successfully.",
      id: recordingsRef.id,
      data: recording,
    });
  } catch (error) {
    console.error("Error saving recording to Firestore: ", error);
    return res
      .status(500)
      .send(`Error saving recording to Firestore: ${error.message}`);
  }
};

exports.renameRecording = async (req, res) => {
  const { userId, recordingId, recordingTitle } = req.body;

  if (!userId || !recordingId || !recordingTitle) {
    return res
      .status(400)
      .send("User ID, Recording ID, and Recording Title are required");
  }

  try {
    const userRef = admin.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).send("No User Found.");
    }

    await userRef.collection("recordings").doc(recordingId).update({
      recordingTitle: recordingTitle,
    });

    return res.status(200).send("Recording renamed successfully.");
  } catch (error) {
    console.error("Error renaming recording in Firestore: ", error);
    return res
      .status(500)
      .send(`Error renaming recording in Firestore: ${error.message}`);
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

    audioUrl = (
      await userRef.collection("recordings").doc(recordingId).get()
    ).data().audioUrl;

    audioUrl = audioUrl.replace(
      "https://storage.googleapis.com/komura-audio-bucket/",
      ""
    );

    await deleteAudio(audioUrl);

    await userRef.collection("recordings").doc(recordingId).delete();

    return res.status(200).send("Recording deleted successfully.");
  } catch (error) {
    console.error("Error deleting recording from Firestore: ", error);
    return res
      .status(500)
      .send(`Error deleting recording from Firestore: ${error.message}`);
  }
};
