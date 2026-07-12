import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { formData, handleInputChange, handleSubmit, loading } = useAuth(true);
  const [showPassword, setShowPassword] = useState(false);

  const inputContainer = "relative flex items-center";
  const iconStyle = "absolute left-4 text-slate-400";
  const inputStyle = "w-full pl-12 pr-12 py-3 bg-[#1e293b]/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-slate-500";

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