import  { useState, useContext } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import "../Styling/auth.css";
import { myContext } from "../MyContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";




export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username:"",
    phno: "",
    email: "",
    password: "",
  });

  const { user, setUser } = useContext(myContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    let input = {
      name: formData.username,
      email: formData.email,
      phoneNumber: formData.phno, 
      password: formData.password,
    };

    try {
      let res = await axios.post("http://localhost:3000/api/user/signup", input);
      setUser(res.data.user); 
      console.log("Signup success:", res.data.user);
      navigate(`/chat`);
    } catch (err) {

      console.error("Signup failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Signup</h2>
        <input
          name="username"
          type="text"
          placeholder="Enter your username"
          onChange={handleInputChange}
          value={formData.username}
          className="auth-input"
        />
        <input
          name="phno"
          type="text"
          placeholder="Enter your number"
          onChange={handleInputChange}
          value={formData.phno}
          className="auth-input"
        />
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          onChange={handleInputChange}
          value={formData.email}
          className="auth-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          onChange={handleInputChange}
          value={formData.password}
          className="auth-input"
        />
        <Button variant="contained" className="auth-btn" type="submit">
          Submit
        </Button>
        <p>
          <Link to={"/login"}>Login if you already have an account</Link>
        </p>
      </form>
    </div>
  );
}
