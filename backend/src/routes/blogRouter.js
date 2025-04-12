import express from "express";
import { blogSchema, validateSchema } from "../middlewares/validators.js";
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
} from "../controllers/blogController.js";
import { authGuard } from "../middlewares/authGuard.js";

const router = express.Router();
// protected routes
router.get("/", authGuard, getAllBlogs);
router.post("/", validateSchema(blogSchema), authGuard, createBlog);
router.get("/view/:id", authGuard, getBlogById);
router.put("/update/:id", authGuard, updateBlog);
router.delete("/delete/:id", authGuard, deleteBlog);
export default router;
