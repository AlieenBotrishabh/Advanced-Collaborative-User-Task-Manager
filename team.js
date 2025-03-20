const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Initialize Firebase
const serviceAccount = require("./config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.json());
app.use(cors());

// Get Team Members for a Project
app.get("/projects/:projectId/members", async (req, res) => {
  const { projectId } = req.params;
  const snapshot = await db.collection("projects").doc(projectId).get();
  res.json(snapshot.data());
});

// Update Project Data in Real-time
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("updateProject", async (data) => {
    const { projectId, updates } = data;
    await db.collection("projects").doc(projectId).update(updates);
    io.emit("projectUpdated", { projectId, updates });
  });

  socket.on("disconnect", () => console.log("User disconnected"));
});

// Track User Actions in Activity Log
app.post("/projects/:projectId/activity", async (req, res) => {
  const { projectId } = req.params;
  const { action, user } = req.body;

  await db.collection("projects").doc(projectId).collection("activityLog").add({
    action,
    user,
    timestamp: new Date(),
  });

  res.status(200).json({ success: true });
});

server.listen(5000, () => console.log("Server running on port 5000"));
