"use client";

import { useState } from "react";
import { BASE_API } from "../utils";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/BlogForm.css";

const BlogForm = ({ onBlogAdded }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = async (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        const base64 = await convertToBase64(file);
        setForm((prev) => ({
          ...prev,
          [name]: base64,
        }));
        setPreviewImage(URL.createObjectURL(file));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.title || !form.description) {
      toast.error("Title and description are required");
      setLoading(false);
      return;
    }

    if (!form.image) {
      toast.error("Blog image is required");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_API}/api/blogs`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Blog created successfully");
      setForm({ title: "", description: "", image: "" });
      setPreviewImage(null);

      if (onBlogAdded) {
        onBlogAdded();
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Failed to create blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-form-container">
      <h2>Create New Blog</h2>
      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">Blog Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter blog title"
            value={form.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Blog Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter blog description"
            value={form.description}
            onChange={handleInputChange}
            required
            rows="5"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Blog Image</label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            required
            style={{
              display: "block",
              marginTop: "8px",
              padding: "4px",
              cursor: "pointer",
            }}
          />
          {previewImage && (
            <div className="image-preview" style={{ marginTop: "10px" }}>
              <img
                src={previewImage}
                alt="Blog preview"
                style={{ maxWidth: "200px", borderRadius: "8px" }}
              />
            </div>
          )}
        </div>

        <div className="form-actions" style={{ marginTop: "15px" }}>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
