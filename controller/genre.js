import SuggestionCategory from "../models/genre.js";
import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import checkAdmin from "../middleware/checkAdmin.js";
const router = express.Router();

/**
 * Get all suggestion categories.
 * @route GET /api/suggestionCategories
 * @returns {object[]} An array of suggestion category objects.
 * @throws {Error} If an error occurs while fetching the suggestion categories.
 */
router.get("/", async (req, res) => {
  try {
    const suggestionCategories = await SuggestionCategory.find();
    res.status(200).json(suggestionCategories);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

/**
 * Add a new suggestion category.
 * @route POST /api/suggestionCategories
 * @param {string} name - The name of the suggestion category.
 * @returns {object} A success message if the suggestion category is added successfully.
 * @throws {Error} If the suggestion category already exists or an error occurs while saving it.
 */
router.post("/", checkAuth, checkAdmin, async (req, res) => {
  const { name } = req.body;
  try {
    const isSuggestionCategoryExists = await SuggestionCategory.findOne({ name });

    if (isSuggestionCategoryExists) {
      return res.status(400).json({ message: "Suggestion category already exists" });
    }

    const newSuggestionCategory = new SuggestionCategory({ name });
    await newSuggestionCategory.save();

    res.status(201).json({ message: "Suggestion category added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add suggestion category", message: error.message });
  }
});

export default router;
