const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["Admin", "Member", "Viewer"], default: "Member" },
      joinedAt: { type: Date, default: Date.now },
    },
  ],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Team", TeamSchema);
