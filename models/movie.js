import mongoose from "mongoose";

const suggestionSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["pending", "in-progress", "resolved"], default: "pending" },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  suggestionCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SuggestionCategory" },
});

const Suggestion = mongoose.model("Suggestion", suggestionSchema);
export default Suggestion;
