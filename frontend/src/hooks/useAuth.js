import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { myContext } from "../MyContext";

export const useAuth = (isLogin = true) => {
  const navigate = useNavigate();
  const { setUser } = useContext(myContext);
  const [formData, setFormData] = useState({
    username: "", email: "", password: "", phno: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_SERVER_URL}/api/user/${isLogin ? "login" : "signup"}`;
    
    // Map internal state to what your API expects
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { name: formData.username, email: formData.email, phoneNumber: formData.phno, password: formData.password };

    try {
      const { data } = await axios.post(url, payload, { withCredentials: true });
      setUser(data.user);
      navigate("/chat");
    } catch (err) {
      console.error("Auth Error:", err.response?.data || err.message);
    }
  };

  return { formData, handleInputChange, handleSubmit };
};