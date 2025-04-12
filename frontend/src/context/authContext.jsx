"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggeIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          // Verify token validity
          const response = await axios.get("http://localhost:8080/api/auth/userProfile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.data.success) {
            setIsLoggeIn(true)
          } else {
            localStorage.removeItem("token")
            setIsLoggeIn(false)
          }
        } catch (error) {
          console.error("Auth verification error:", error)
          localStorage.removeItem("token")
          setIsLoggeIn(false)
        }
      } else {
        setIsLoggeIn(false)
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  return <AuthContext.Provider value={{ isLoggedIn, setIsLoggeIn, loading }}>{children}</AuthContext.Provider>
}
