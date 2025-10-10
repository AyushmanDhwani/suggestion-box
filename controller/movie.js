import express from "express";
const router = express.Router();

import Suggestion from "../models/movie.js";
import SuggestionCategory from "../models/genre.js";
import checkAuth from "../middleware/checkAuth.js";
import checkAdmin from "../middleware/checkAdmin.js";

/**
 * Read all suggestions.
 * @route GET /api/suggestions
 * @returns {object} An object containing the count and list of suggestions.
 * @throws {Error} If an error occurs while retrieving the suggestions.
 */
router.get("/", async (req, res) => {
  try {
    const suggestions = await Suggestion.find().populate({
      path: "suggestionCategory",
      select: "name",
    });
    res.status(200).json({
      count: suggestions.length,
      suggestions: suggestions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Read a suggestion by its ID.
 * @route GET /api/suggestions/:suggestionId
 * @param {string} suggestionId - The ID of the suggestion to retrieve.
 * @returns {object} The suggestion object.
 * @throws {Error} If the suggestion is not found or an error occurs while retrieving it.
 */
router.get("/:suggestionId", async (req, res) => {
  try {
    const suggestion = await Suggestion.findById({ _id: req.params.suggestionId })
      .populate("suggestionCategory", "name")
      .exec();
    if (suggestion) return res.status(202).json(suggestion);
    return res
      .status(404)
      .json({ error: "The suggestion you are looking for doesn't exist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Add a new suggestion.
 * @route POST /api/suggestions/addSuggestion
 * @param {string} title - The title of the suggestion.
 * @param {string} suggestionCategory - The category of the suggestion.
 * @param {string} description - The description of the suggestion.
 * @param {boolean} approval - Approval status.
 * @param {string[]} comments - Comments on the suggestion.
 * @param {string} reviewStatus - Review status.
 * @returns {object} A success message if the suggestion is added successfully.
 * @throws {Error} If the suggestion already exists, an error occurs while saving, or validation fails.
 */
router.post(
  "/addSuggestion",
  checkAuth,
  checkAdmin,
  async (req, res) => {
    try {
      const { title, suggestionCategory, description, approval, comments, reviewStatus } = req.body;
      const isSuggestionExists = await Suggestion.findOne({ title });

      if (isSuggestionExists) {
        return res.status(400).json({ message: "Suggestion already exists" });
      }

      const newSuggestion = new Suggestion({
        title,
        suggestionCategory,
        description,
        approval,
        comments,
        reviewStatus,
      });
      await newSuggestion.save();
      const suggestions = await Suggestion.find().populate({
        path: "suggestionCategory",
        select: "name",
      });
      res.status(201).json({ message: "Suggestion added successfully", suggestions });
    } catch (error) {
      res.status(500).json({ error: "Failed to add suggestion", message: error.message });
    }
  }
);

/**
 * Update a suggestion by its ID.
 * @route PATCH /api/suggestions/:suggestionId
 * @param {string} suggestionId - The ID of the suggestion to update.
 * @returns {object} A success message and the updated suggestion object.
 * @throws {Error} If the suggestion is not found, an error occurs while updating it, or validation fails.
 */
router.patch("/:suggestionId", checkAuth, checkAdmin, async (req, res) => {
  try {
    const updateSuggestion = await Suggestion.findByIdAndUpdate(
      { _id: req.params.suggestionId },
      req.body,
      { new: true }
    );
    res.status(200).json({ msg: "Suggestion updated successfully", updateSuggestion });
  } catch (err) {
    res.status(500).json({ err: `Something went wrong: ${err}` });
  }
});

export default router;
