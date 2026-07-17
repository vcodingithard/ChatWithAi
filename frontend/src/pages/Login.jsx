import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { formData, handleInputChange, handleSubmit, loading } = useAuth(true);
  const [showPassword, setShowPassword] = useState(false);

  const labelStyle = "block text-xs font-medium text-slate-400 mb-1.5";
  const inputStyle = "w-full px-3 py-2 bg-[#131929] border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all";

  return (
    <AuthLayout
      title="Sign in to your account"
      onSubmit={handleSubmit}
      loading={loading}
      linkText="Don't have an account?"
      linkLabel="Sign up"
      linkTo="/signup"
    >
      <div className="space-y-4">
        <div>
          <label className={labelStyle}>Email address</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={handleInputChange}
            className={inputStyle}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-medium text-slate-400">Password</label>
          </div>
          <div className="relative flex items-center">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}