"use client"

import { useState } from "react"
import Navbar from "../components/Navbar"
import BlogForm from "../components/BlogForm"
import BlogList from "../components/BlogList"
import "../styles/Dashboard.css"

const Dashboard = () => {
  const [refreshBlogs, setRefreshBlogs] = useState(0)
  const [showForm, setShowForm] = useState(false)

  const handleBlogAdded = () => {
    setRefreshBlogs((prev) => prev + 1)
    setShowForm(false)
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Your Blogs</h1>
          <button className="add-blog-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add New Blog"}
          </button>
        </div>

        {showForm && (
          <div className="blog-form-section">
            <BlogForm onBlogAdded={handleBlogAdded} />
          </div>
        )}

        <div className="blog-list-section">
          <BlogList refreshTrigger={refreshBlogs} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
