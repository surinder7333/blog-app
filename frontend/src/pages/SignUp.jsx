import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/SignUp.css";

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

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
    
    if (!form.email || !form.password) {
      toast.error("Email and password are required");
      setLoading(false);
      return;
    }
    
    if (!form.profileImage) {
      toast.error("Profile image is required");
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        form
      );
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      console.log("error", error);
      if (error.response && error.response.data?.errors) {
        toast.error(error.response.data.errors[0]);
      } else if (error.response && error.response.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2>Create Account</h2>
          <p>Sign up to get started</p>
        </div>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="profileImage">Profile Image</label>
            <div className="file-input-container">
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="file-input"
                required
              />
              <label htmlFor="profileImage" className="file-label">
                Choose a file
              </label>
            </div>
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage || "/placeholder.svg"} alt="Profile preview" />
              </div>
            )}
          </div>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <div className="signup-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
