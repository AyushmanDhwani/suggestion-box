import express from "express";
const router = express.Router();
import path from "path";
import multer from "multer";
import fs from "fs";

import Suggestion from "../models/movie.js";
import checkAuth from "../middleware/checkAuth.js";
import SuggestionCategory from "../models/genre.js";
import checkAdmin from "../middleware/checkAdmin.js";

/**
 * Get all suggestions.
 * @route GET /api/suggestions
 * @returns {object[]} An array of suggestion objects.
 */
router.get("/",checkAuth, async (req, res) => {
  try {

    let whereCondition = {};
    if (req.user?.role != "admin") {
      whereCondition.status = "active";
    }
    const suggestions = await Suggestion.find(whereCondition).populate({
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
 * Get a suggestion by ID.
 * @route GET /api/suggestions/:suggestionId
 */
router.get("/:suggestionId", async (req, res) => {
  try {
    const suggestion = await Suggestion.findById({ _id: req.params.suggestionId })
      .populate("suggestionCategory", "name")
      .exec();
    if (suggestion) return res.status(202).json(suggestion);
    return res.status(404).json({ error: "The suggestion you are looking for doesn't exist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Add a new suggestion.
 * @route POST /api/suggestions
 */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/", checkAuth, upload.single("file"), async (req, res) => {
  try {
    console.log("Received file:", req.file); // Debug log
    const { title, description, suggestionCategory } = req.body;
    const filePath = req.file ? req.file.path : null;
    const newSuggestion = new Suggestion({
      title,
      description,
      suggestionCategory,
      status: "pending",
      comments: [],
      file: filePath,
      createdBy: req.user.id
    });
    await newSuggestion.save();
    res.status(201).json({ message: "Suggestion added successfully", suggestion: newSuggestion });
  } catch (error) {
    res.status(500).json({ error: "Failed to add suggestion", message: error.message });
  }
});

/**
 * Update a suggestion by ID.
 * @route PATCH /api/suggestions/:suggestionId
 */
router.patch("/:suggestionId", checkAuth, async (req, res) => {
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
