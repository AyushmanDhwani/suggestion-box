import mongoose from "mongoose";

const suggestionCategorySchema = mongoose.Schema({
  name: { type: String, default: "uncategorized" },
});

const SuggestionCategory = mongoose.model("SuggestionCategory", suggestionCategorySchema);
export default SuggestionCategory;
