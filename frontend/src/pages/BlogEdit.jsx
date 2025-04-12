"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"
import "../styles/BlogEdit.css"
import { BASE_API } from "../utils"

const BlogEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [originalImage, setOriginalImage] = useState(null)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${BASE_API}/api/blogs/view/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const blog = response.data.blog
        setForm({
          title: blog.title,
          description: blog.description,
          image: blog.image,
        })
        setOriginalImage(blog.image)
      } catch (error) {
        console.error("Error fetching blog:", error)
        toast.error("Failed to fetch blog details")
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id, navigate])

  const handleInputChange = async (e) => {
    const { name, type, value, files } = e.target

    if (type === "file") {
      const file = files[0]
      if (file) {
        const base64 = await convertToBase64(file)
        setForm((prev) => ({
          ...prev,
          [name]: base64,
        }))
        setPreviewImage(URL.createObjectURL(file))
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    if (!form.title || !form.description) {
      toast.error("Title and description are required")
      setSubmitting(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      await axios.put(`http://localhost:8080/api/blogs/update/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success("Blog updated successfully")
      navigate("/")
    } catch (error) {
      console.error("Error updating blog:", error)
      toast.error("Failed to update blog")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">Loading blog details...</div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="blog-edit-container">
        <div className="blog-edit-header">
          <h2>Edit Blog</h2>
          <button onClick={() => navigate("/")} className="back-btn">
            Back to Dashboard
          </button>
        </div>
        <form onSubmit={handleSubmit} className="blog-edit-form">
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
              rows="8"
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Blog Image</label>
            <div className="current-image">
              <p>Current Image:</p>
              <img src={originalImage || "/placeholder.svg"} alt="Current blog" />
            </div>
            <div className="file-input-container">
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="file-input"
              />
              <label htmlFor="image" className="file-label">
                Choose a new image
              </label>
            </div>
            {previewImage && (
              <div className="image-preview">
                <p>New Image Preview:</p>
                <img src={previewImage || "/placeholder.svg"} alt="New blog preview" />
              </div>
            )}
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => navigate("/")} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Updating..." : "Update Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BlogEdit
