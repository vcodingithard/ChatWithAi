import { Link } from "react-router-dom";

const AuthLayout = ({ title, onSubmit, children, linkText, linkTo, linkLabel, loading }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090d16] px-4 relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="w-full max-w-[400px] space-y-6 relative z-10">
        {/* Simple & Professional Logo */}
        <div className="flex flex-col items-center justify-center gap-2.5">
          <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md border border-indigo-500/30">
            C
          </div>
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-slate-400">
            Convex AI
          </span>
        </div>
        
        {/* Elegant Minimalist Card */}
        <div className="bg-[#0e1322]/80 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-white tracking-tight">{title}</h1>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {children}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Please wait...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-xs text-slate-400">
              {linkText}{" "}
              <Link to={linkTo} className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                {linkLabel}
              </Link>
            </p>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 text-[10px] text-slate-600">
          <span className="hover:text-slate-500 cursor-pointer transition-colors">Terms of use</span>
          <span>&middot;</span>
          <span className="hover:text-slate-500 cursor-pointer transition-colors">Privacy policy</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;