"use client"

import { useContext, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/authContext"
import axios from "axios"
import "../styles/Navbar.css"

const Navbar = () => {
  const { isLoggedIn, setIsLoggeIn } = useContext(AuthContext)
  const [userProfile, setUserProfile] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const response = await axios.get("http://localhost:8080/api/auth/userProfile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          setUserProfile(response.data.user)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }

    if (isLoggedIn) {
      fetchUserProfile()
    }
  }, [isLoggedIn])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggeIn(false)
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">BlogApp</Link>
        </div>
        <div className="navbar-menu">
          {isLoggedIn ? (
            <>
              <Link to="/" className="nav-link">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
              {userProfile && userProfile.profileImage && (
                <div className="profile-image">
                  <img src={userProfile.profileImage || "/placeholder.svg"} alt="Profile" />
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
