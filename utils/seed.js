import mongoose from "mongoose";
import dotenv from "dotenv";
import Suggestion from "../models/movie.js";
import SuggestionCategory from "../models/genre.js";
import User from "../models/user.js";

dotenv.config();

const suggestionCategories = [
  { name: "Office Infrastructure" },
  { name: "Health and Hygiene" },
  { name: "Culture" },
  { name: "Productivity" },
  { name: "Work-Life Balance" },
  { name: "Technology" },
  { name: "Communication" },
  { name: "Training & Development" },
  { name: "Safety" },
  { name: "Other" },
];

const suggestions = [
  {
    title: "Improve office lighting",
    description: "Install brighter and energy-efficient LED lights in all workspaces.",
    suggestionCategory: "Office Infrastructure",
    status: "pending",
    comments: [],
  },
  {
    title: "Provide hand sanitizers",
    description: "Place hand sanitizer dispensers at all entry points and common areas.",
    suggestionCategory: "Health and Hygiene",
    status: "pending",
    comments: [],
  },
  {
    title: "Monthly team-building activities",
    description: "Organize monthly events to foster team spirit and improve company culture.",
    suggestionCategory: "Culture",
    status: "pending",
    comments: [],
  },
  {
    title: "Flexible work hours",
    description: "Allow employees to choose flexible start and end times to boost productivity.",
    suggestionCategory: "Productivity",
    status: "pending",
    comments: [],
  },
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await User.deleteMany({});
  // Add default admin user
  await User.create({
    email: "admin@yopmail.com",
    password: "admin123", // will be hashed by pre-save hook
    role: "admin"
  });

  await SuggestionCategory.deleteMany({});
  const createdSuggestionCategories = await SuggestionCategory.insertMany(suggestionCategories);

  await Suggestion.deleteMany({});
  const suggestionsWithCategoryIds = suggestions.map(suggestion => {
    const category = createdSuggestionCategories.find(c => c.name === suggestion.suggestionCategory);
    return { ...suggestion, suggestionCategory: category ? category._id : null };
  });

  await Suggestion.insertMany(suggestionsWithCategoryIds);

  console.log("Database seeded!");
  mongoose.connection.close();
};

seedDB();
