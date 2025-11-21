import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  userUid: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }
}, { timestamps: true });

bookmarkSchema.index({ userUid: 1, projectId: 1 }, { unique: true });

export default mongoose.model("Bookmark", bookmarkSchema);
