import { TextField } from "@mui/material";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const { formData, handleInputChange, handleSubmit } = useAuth(false);
  const inputStyle = { input: { color: "white" }, bgcolor: "#343541", borderRadius: 1 };

  return (
    <AuthLayout 
      title="Signup" 
      onSubmit={handleSubmit}
      linkText="Already have an account?"
      linkLabel="Login here"
      linkTo="/login"
    >
      <TextField name="username" label="Username" fullWidth value={formData.username} onChange={handleInputChange} sx={inputStyle} />
      <TextField name="phno" label="Phone Number" fullWidth value={formData.phno} onChange={handleInputChange} sx={inputStyle} />
      <TextField name="email" label="Email" type="email" fullWidth value={formData.email} onChange={handleInputChange} sx={inputStyle} />
      <TextField name="password" label="Password" type="password" fullWidth value={formData.password} onChange={handleInputChange} sx={inputStyle} />
    </AuthLayout>
  );
}