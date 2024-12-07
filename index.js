const express = require("express");
const bodyParser = require("body-parser");

const authController = require("./controllers/firebase-auth-controller");
const recordingController = require("./controllers/recording-controller");

const app = express();

app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World! Komura Here!");
});

// Auth routes
app.post("/register", authController.registerUser);
app.post("/profile-picture", authController.changePictureProfile);

// Recording routes
app.get("/get-recordings", recordingController.getRecordings);
app.get("/get-recording", recordingController.getRecording);
app.post("/save-recording", recordingController.createRecording);
app.post("/rename-recording", recordingController.renameRecording);
app.post("/delete-recording", recordingController.deleteRecording);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
