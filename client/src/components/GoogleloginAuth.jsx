// components/GoogleLoginAuth.js
import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import jwt_decode from "jwt-decode"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUserInfo } from "../redux/reducers/rootSlice"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import fetchData from "../helper/apiCall"

function GoogleloginAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      const { email, name, picture, sub } = decoded;

      // Optionally send to backend to verify or create user
      const { data } = await axios.post("http://localhost:5000/api/user/google-login", {
        email,
        name,
        picture,
        googleId: sub,
      });

      localStorage.setItem("token", data.token);
      dispatch(setUserInfo(jwt_decode(data.token).userId));
      const user = await fetchData(`/user/getuser/${jwt_decode(data.token).userId}`);
      dispatch(setUserInfo(user));
      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        toast.error("Google login failed");
      }}
    />
  );
}

export default GoogleloginAuth;
