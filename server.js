import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import bodyParser from "body-parser";


const app = express();
app.use(cors(
  {
    origin: [
      "http://localhost:5173",
      "https://peer-project-front-end.vercel.app" // change after deploy
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
));
app.use(bodyParser.json());
app.use(express.json());

// Mount routers
app.use("/projects", projectRoutes);
app.use("/projects", commentRoutes); // routes like POST /projects/:id/comments
app.use("/bookmarks", bookmarkRoutes);
app.use("/feedback", feedbackRoutes);

// Health
app.get("/", (req, res) => res.json({ ok: true }));

// Connect to MongoDB - set MONGO_URI in env or replace below
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://mksamy:12345@cluster0.hh7j086.mongodb.net/peer";
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
