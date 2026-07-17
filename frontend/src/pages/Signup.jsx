import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const { formData, handleInputChange, handleSubmit, loading } = useAuth(false);

  const labelStyle = "block text-xs font-medium text-slate-400 mb-1.5";
  const inputStyle = "w-full px-3 py-2 bg-[#131929] border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all";

  return (
    <AuthLayout
      title="Create your account"
      onSubmit={handleSubmit}
      loading={loading}
      linkText="Already have an account?"
      linkLabel="Log in"
      linkTo="/login"
    >
      <div className="space-y-4">
        <div>
          <label className={labelStyle}>Username</label>
          <input
            name="username"
            placeholder="johndoe"
            required
            value={formData.username}
            onChange={handleInputChange}
            className={inputStyle}
          />
        </div>
        <div>
          <label className={labelStyle}>Email Address</label>
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
          <label className={labelStyle}>Phone Number</label>
          <input
            name="phno"
            placeholder="+1 (555) 000-0000"
            required
            value={formData.phno}
            onChange={handleInputChange}
            className={inputStyle}
          />
        </div>
        <div>
          <label className={labelStyle}>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Create a secure password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className={inputStyle}
          />
        </div>
      </div>
    </AuthLayout>
  );
}