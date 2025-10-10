import Joi from "joi";

export const suggestionSchema = Joi.object({
  id: Joi.string(),
  title: Joi.string().required().label("Title"),
  suggestionCategory: Joi.string().required().label("Suggestion Category"),
  approval: Joi.boolean().default(false).label("Approval"),
  description: Joi.string().allow("").label("Description"),
  comments: Joi.array().items(Joi.string()).label("Comments"),
  reviewStatus: Joi.string().valid("pending", "in review", "approved", "rejected").default("pending").label("Review Status"),
});
