"use client"

import "./App.css"
import { Routes, Route, Navigate } from "react-router-dom"
import { lazy, Suspense, useContext } from "react"
import { AuthContext } from "./context/authContext"

const Dashboard = lazy(() => import("./pages/Dashboard"))
const SignUp = lazy(() => import("./pages/SignUp"))
const Login = lazy(() => import("./pages/Login"))
const BlogEdit = lazy(() => import("./pages/BlogEdit"))
const BlogView = lazy(() => import("./pages/BlogView"))

function App() {
  const { isLoggedIn } = useContext(AuthContext)

  return (
    <Suspense fallback={<div className="loading-app">Loading...</div>}>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/blog/edit/:id" element={isLoggedIn ? <BlogEdit /> : <Navigate to="/login" />} />
        <Route path="/blog/view/:id" element={isLoggedIn ? <BlogView /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!isLoggedIn ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
      </Routes>
    </Suspense>
  )
}

export default App
