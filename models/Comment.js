import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  userUid: { type: String, required: true }, // Firebase uid
  userName: { type: String },
  text: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
