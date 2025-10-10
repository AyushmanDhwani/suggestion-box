import mongoose from "mongoose";

const suggestionSchema = mongoose.Schema({
  title: { type: String, required: true }, // Title of suggestion
  suggestionCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "SuggestionCategory" }],
  approval: { type: Boolean, default: false }, // Whether suggestion is approved
  description: { type: String, required: true }, // Description of suggestion
  comments: [{ type: String }], // Comments on suggestion
  reviewStatus: { type: String, enum: ["pending", "in review", "approved", "rejected"], default: "pending" }, // Review status
});

const Suggestion = mongoose.model("Suggestion", suggestionSchema);
export default Suggestion;
