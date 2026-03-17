import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { formData, handleInputChange, handleSubmit, loading } = useAuth(true);
  const [showPassword, setShowPassword] = useState(false);

  const inputContainer = "relative flex items-center";
  const iconStyle = "absolute left-4 text-gray-400";
  const inputStyle = "w-full pl-12 pr-12 py-3 bg-[#f9fafb] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10a37f]/20 focus:border-[#10a37f] outline-none transition-all text-gray-900 placeholder:text-gray-400";

  return (
    <AuthLayout
      title="Log back in"
      onSubmit={handleSubmit}
      loading={loading}
      linkText="Don't have an account?"
      linkLabel="Sign up"
      linkTo="/signup"
    >
      <div className="space-y-4">
        <div className={inputContainer}>
          <Mail className={iconStyle} size={18} />
          <input
            name="email"
            type="email"
            placeholder="Email address"
            required
            value={formData.email}
            onChange={handleInputChange}
            className={inputStyle}
          />
        </div>

        <div className={inputContainer}>
          <Lock className={iconStyle} size={18} />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className={inputStyle}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}