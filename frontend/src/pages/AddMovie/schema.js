import Joi from "joi";

export const suggestionSchema = Joi.object({
  title: Joi.string().required().label("Title"),
  suggestionCategory: Joi.string().required().label("Suggestion Category"),
  description: Joi.string().allow("").label("Description"),
});
