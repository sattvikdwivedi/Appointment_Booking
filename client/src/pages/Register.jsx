import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import axios from "axios";
import toast from "react-hot-toast";
import GoogleloginAuth from "../components/GoogleloginAuth";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Register() {
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confpassword: "",
  });
  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const onUpload = async (element) => {
    setLoading(true);
    if (element.type === "image/jpeg" || element.type === "image/png") {
      const data = new FormData();
      data.append("file", element);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
  
      try {
        const response = await fetch(process.env.REACT_APP_CLOUDINARY_BASE_URL, {
          method: "POST",
          body: data,
        });
  
        const result = await response.json();
  
        if (result.secure_url) {
          setFile(result.secure_url);
        } else {
          toast.error("Upload failed. Check preset or file format.");
          console.error("Cloudinary response:", result);
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Something went wrong during upload.");
      }
  
      setLoading(false);
    } else {
      setLoading(false);
      toast.error("Please select an image in jpeg or png format");
    }
  };
  

  const formSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (loading) return;
  
      const { firstname, lastname, email, password, confpassword } = formDetails;
  
      // Trimmed inputs
      const trimmedFirstName = firstname.trim();
      const trimmedLastName = lastname.trim();
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      const trimmedConfPassword = confpassword.trim();
  
      // Validation
      if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedPassword || !trimmedConfPassword) {
        return toast.error("All fields are required and should not be blank spaces.");
      }
  
      if (trimmedFirstName.length < 3) {
        return toast.error("First name must be at least 3 characters long.");
      }
  
      if (trimmedLastName.length < 3) {
        return toast.error("Last name must be at least 3 characters long.");
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return toast.error("Please enter a valid email address.");
      }
  
      if (trimmedPassword.length < 5) {
        return toast.error("Password must be at least 5 characters long.");
      }
  
      if (trimmedPassword !== trimmedConfPassword) {
        return toast.error("Passwords do not match.");
      }
  
      if (!file) {
        return toast.error("Please upload a profile picture.");
      }
  
      await toast.promise(
        axios.post(
          "http://localhost:5000/api/user/register",
          {
            firstname: trimmedFirstName,
            lastname: trimmedLastName,
            email: trimmedEmail,
            password: trimmedPassword,
            pic: file,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        ),
        {
          pending: "Registering user...",
          success: "User registered successfully",
          error: "Unable to register user",
        }
      );
  
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  

  return (
    <section className="register-section flex-center">
      <div className="register-container flex-center">
        <h2 className="form-heading">Sign Up</h2>
  
        <form onSubmit={formSubmit} className="register-form">
          <input
            type="text"
            name="firstname"
            className="form-input"
            placeholder="Enter your first name"
            value={formDetails.firstname}
            onChange={inputChange}
          />
          <input
            type="text"
            name="lastname"
            className="form-input"
            placeholder="Enter your last name"
            value={formDetails.lastname}
            onChange={inputChange}
          />
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formDetails.email}
            onChange={inputChange}
          />
          <input
            type="file"
            onChange={(e) => onUpload(e.target.files[0])}
            name="profile-pic"
            id="profile-pic"
            className="form-input"
          />
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Enter your password"
            value={formDetails.password}
            onChange={inputChange}
          />
          <input
            type="password"
            name="confpassword"
            className="form-input"
            placeholder="Confirm your password"
            value={formDetails.confpassword}
            onChange={inputChange}
          />
          <button
            type="submit"
            className="btn form-btn"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Sign Up"}
          </button>
        </form>
  
        <p className="login-text">
          Already a user?{" "}
          <NavLink className="login-link" to="/login">
            Log in
          </NavLink>
        </p>

  
        <div className="google-login-wrapper">
          <GoogleloginAuth />
        </div>
      </div>
    </section>
  );
  
}

export default Register;
