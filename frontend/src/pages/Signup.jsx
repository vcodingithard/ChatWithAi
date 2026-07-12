import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const { formData, handleInputChange, handleSubmit, loading } = useAuth(false);

  const inputStyle = "w-full px-4 py-2.5 bg-[#1e293b]/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-500";

  return (
    <AuthLayout
      title="Create Account"
      onSubmit={handleSubmit}
      loading={loading}
      linkText="Already have an account?"
      linkLabel="Log in"
      linkTo="/login"
    >
      <div className="grid grid-cols-1 gap-4">
        <input
          name="username"
          placeholder="Username"
          required
          value={formData.username}
          onChange={handleInputChange}
          className={inputStyle}
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={handleInputChange}
          className={inputStyle}
        />
        <input
          name="phno"
          placeholder="Phone Number"
          required
          value={formData.phno}
          onChange={handleInputChange}
          className={inputStyle}
        />
        <input
          name="password"
          type="password"
          placeholder="Create Password"
          required
          value={formData.password}
          onChange={handleInputChange}
          className={inputStyle}
        />
      </div>
    </AuthLayout>
  );
}