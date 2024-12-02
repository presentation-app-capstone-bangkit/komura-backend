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

// Recording routes
app.post("/save-recording", recordingController.createRecording);
app.post("/delete-recording", recordingController.deleteRecording);
app.get("/get-recordings", recordingController.getRecordings);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
