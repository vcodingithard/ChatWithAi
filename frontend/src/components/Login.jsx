import React, { use, useState,useContext } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import "../Styling/auth.css"
import axios from "axios";
import { myContext } from "../MyContext";
import { useNavigate } from "react-router-dom";
export default function Login() {
  
const navigate = useNavigate();

  let {user,setUser}=useContext(myContext)

  let [formData,setFormData]=useState({
    email:"",
    password:"",
  });

  const handleInputChange=(e)=>{
    let {name,value}=e.target;
    setFormData((prev)=>(
      {
        ...prev,
        [name]:value,
      }
    ))
  }
  const handleFormSubmit=async(e)=>{
    e.preventDefault();
    let input={
      email:formData.email,
      password:formData.password,
    }
    let response=await axios.post("http://localhost:3000/api/user/login",input, {
    withCredentials: true, 
  }); 
    setUser(response.data.user);
    navigate(`/chat`);
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleFormSubmit}>
        <h2 className="auth-title">Login</h2>
        <input name="email"  value={formData.email} onChange={handleInputChange} type="email" placeholder="Enter your email" className="auth-input" />
        <input name="password" onChange={handleInputChange} value={formData.password} type="password" placeholder="Enter your password" className="auth-input" />
        <Button variant="contained" className="auth-btn" type="submit">
          Submit
        </Button>
        <p><Link to={"/signup"} >or register as a new user </Link></p>
      </form>
    </div>
  );
}
