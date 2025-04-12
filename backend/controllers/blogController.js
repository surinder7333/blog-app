import Blog from "../models/blog.js";
import catchAsync from "../utils/catchAsync.js";

export const createBlog = catchAsync(async (req, res) => {
  const { title, image, description } = req.body;
  const blog = new Blog({
    title: title,
    image: image,
    description: description,
    createdBy: req?.user?.id,
  });

  await blog.save();
  res
    .status(201)
    .json({ success: true, message: "Blog created successfully" }, blog);
});

export const getAllBlogs = catchAsync(async (req, res) => {
  const blogs = await Blog.find({ createdBy: req.user.id });
  if (!blogs) {
    return res
      .status(404)
      .json({ success: false, message: "Blogs not found as per user" });
  }

  res.status(200).json({ success: true, blogs });
});

export const getBlogById = catchAsync(async (req, res) => {
  const blog = await Blog.findOne(({_id:req.params.id}));
  if (!blog) {
    return res.status(404).json({ success: false, message: "Blog not found" });
  }
  res.status(200).json({ success: true, blog });
});

export const updateBlog = catchAsync(async (req, res) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updatedBlog) {
    return res
      .status(400)
      .json({ success: false, message: "Blog can not be update" });
  }
  res
    .status(200)
    .json(
      { success: true, message: "Blog updated successfully " },
      updatedBlog
    );
});

export const deleteBlog = catchAsync(async (req, res) => {
  const deletedBlog = await Blog.findByIdAndDelete({_id:req.params.id});
  if (!deletedBlog) {
    return res
      .status(400)
      .json({ success: false, message: "Blog can not be deleted" });
  }

  res.status(200).json({ success: true, message: "Blog deleted successfuly" });
});
