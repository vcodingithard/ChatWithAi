import { Link } from "react-router-dom";

const AuthLayout = ({ title, onSubmit, children, linkText, linkTo, linkLabel, loading }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090d16] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.18),rgba(255,255,255,0))] px-4 relative overflow-hidden">
      {/* Decorative background grid and shapes */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="w-full max-w-[420px] space-y-6 relative z-10">
        {/* Sleek Tech Logo */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-500/20 border border-white/10 transform hover:scale-105 transition-all duration-300">
            D
          </div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            AI Studio
          </span>
        </div>
        
        {/* Glass Card */}
        <div className="bg-[#111827]/60 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl shadow-black/40">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-slate-400 mt-2 text-sm">Access your intelligence workspace</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {children}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Initializing...
                </span>
              ) : (
                "Continue to Workspace"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-slate-400">
              {linkText}{" "}
              <Link to={linkTo} className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                {linkLabel}
              </Link>
            </p>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 text-xs text-slate-500">
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of use</span>
          <span>|</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy policy</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;