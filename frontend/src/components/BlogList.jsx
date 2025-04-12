"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import "../styles/BlogList.css"
import {BASE_API} from '../utils'

const BlogList = ({ refreshTrigger }) => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [refreshTrigger])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${BASE_API}/api/blogs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setBlogs(response.data.blogs || [])
    } catch (error) {
      console.error("Error fetching blogs:", error)
      toast.error("Failed to fetch blogs")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`${BASE_API}/api/blogs/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        toast.success("Blog deleted successfully")
        fetchBlogs()
      } catch (error) {
        console.error("Error deleting blog:", error)
        toast.error("Failed to delete blog")
      }
    }
  }

  if (loading) {
    return <div className="loading">Loading blogs...</div>
  }

  if (blogs.length === 0) {
    return <div className="no-blogs">No blogs found. Create your first blog!</div>
  }

  return (
    <div className="blog-list-container">
      <table className="blog-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td className="blog-image-cell">
                <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="blog-thumbnail" />
              </td>
              <td className="blog-title-cell">{blog.title}</td>
              <td className="blog-description-cell">
                {blog.description.length > 100 ? `${blog.description.substring(0, 100)}...` : blog.description}
              </td>
              <td className="blog-actions-cell">
                <div className="action-buttons">
                  <Link to={`/blog/view/${blog._id}`} className="action-btn view-btn">
                    View
                  </Link>
                  <Link to={`/blog/edit/${blog._id}`} className="action-btn edit-btn">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(blog._id)} className="action-btn delete-btn">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BlogList
