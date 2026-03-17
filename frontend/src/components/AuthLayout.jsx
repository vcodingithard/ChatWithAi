import { Link } from "react-router-dom";

const AuthLayout = ({ title, onSubmit, children, linkText, linkTo, linkLabel, loading }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#212121] px-4">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Logo Placeholder */}
        <div className="flex justify-center">
           <div className="w-12 h-12 bg-[#10a37f] rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">D</div>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <p className="text-gray-500 mt-2 text-sm">Welcome to DogGPT</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {children}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#10a37f] hover:bg-[#0e8c6d] disabled:opacity-50 text-white font-medium rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? "Please wait..." : "Continue"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              {linkText}{" "}
              <Link to={linkTo} className="text-[#10a37f] font-semibold hover:text-[#0e8c6d]">
                {linkLabel}
              </Link>
            </p>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 text-xs text-gray-500">
          <span>Terms of use</span>
          <span>|</span>
          <span>Privacy policy</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;