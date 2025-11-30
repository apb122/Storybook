const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const itemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  itemSchema,
};
