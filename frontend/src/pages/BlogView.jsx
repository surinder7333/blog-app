"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"
import "../styles/BlogView.css"
import { BASE_API } from "../utils"

const BlogView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${BASE_API}/api/blogs/view/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setBlog(response.data.blog)
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

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">Loading blog...</div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div>
        <Navbar />
        <div className="error-container">Blog not found</div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="blog-view-container">
        <div className="blog-view-header">
          <h2>{blog.title}</h2>
          <button onClick={() => navigate("/")} className="back-btn">
            Back to Dashboard
          </button>
        </div>
        <div className="blog-view-content">
          <div className="blog-view-image">
            <img src={blog.image || "/placeholder.svg"} alt={blog.title} width={10} height={10} />
          </div>
          <div className="blog-view-description">
            <p>{blog.description}</p>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default BlogView
