import { TextField } from "@mui/material";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { formData, handleInputChange, handleSubmit } = useAuth(true);

  const inputStyle = { input: { color: "white" }, bgcolor: "#343541", borderRadius: 1 };

  return (
    <AuthLayout 
      title="Login" 
      onSubmit={handleSubmit}
      linkText="Don't have an account?"
      linkLabel="Register here"
      linkTo="/signup"
    >
      <TextField 
        name="email" label="Email" type="email" fullWidth required
        value={formData.email} onChange={handleInputChange} sx={inputStyle}
      />
      <TextField 
        name="password" label="Password" type="password" fullWidth required
        value={formData.password} onChange={handleInputChange} sx={inputStyle}
      />
    </AuthLayout>
  );
}