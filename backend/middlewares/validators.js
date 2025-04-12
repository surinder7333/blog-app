import Joi from "joi";

export const validateSchema = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (err) {
      return res.status(400).json({
        errors: err.details.map((detail) => detail.message),
      });
    }
  };
};

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordMessage =
  "Password must be at least 8 characters long and include uppercase, lowercase letters, a number, and a special character";

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid format",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().pattern(passwordPattern).required().messages({
    "string.pattern.base": passwordMessage,
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  profileImage: Joi.string().uri().required().messages({
    "string.uri": "Profile image must be a valid URL",
    "string.empty": "Profile image is required",
    "any.required": "Profile image is required",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid format",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().pattern(passwordPattern).required().messages({
    "string.pattern.base": passwordMessage,
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

export const blogSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters long",
    "any.required": "Title is required",
  }),
  image: Joi.string().uri().required().messages({
    "string.uri": "Image must be a valid URL",
    "string.empty": "Image is required",
    "any.required": "Image is required",
  }),
  description: Joi.string().min(10).required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "string.min": "Description must be at least 3 characters long",
    "any.required": "Description is required",
  }),
});
