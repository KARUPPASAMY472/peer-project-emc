import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  githubLink: { type: String },
  demoLink: { type: String },
  ownerUid: { type: String }, // Firebase uid of owner (string)
  ownerName: { type: String }, // optional display name
  likes: [{ type: String }], // array of user uids who liked
  rating: {
  total: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
  details: [
    {
      userUid: String,
      value: Number
    }
  ]
}

}, { timestamps: true });

projectSchema.methods.avgRating = function() {
  return this.rating.count ? (this.rating.total / this.rating.count) : 0;
};

export default mongoose.model("Project", projectSchema);
