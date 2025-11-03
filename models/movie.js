import mongoose from "mongoose";

const suggestionSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["pending", "in-progress", "resolved", "rejected"], default: "pending" },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  suggestionCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SuggestionCategory" },
  file: { type: String }, // Path to uploaded file
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  adminAction: {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, enum: ["approved", "rejected"] },
    date: { type: Date }
  }
});

const Suggestion = mongoose.model("Suggestion", suggestionSchema);
export default Suggestion;
