import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ token, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  if (token) return children;

  const handleLogin = () => {
    navigate("/login", {
      state: { from: location.pathname },
    });
  };

  const handleSkip = () => {
    navigate("/", { replace: true });
  };

  if (!showModal) {
    handleSkip();
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <span className="text-3xl">🔒</span>
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl font-bold text-gray-800">
          Login Required
        </h2>

        <p className="mt-2 text-center text-gray-500">
          Please login to continue using this feature.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="flex-1 rounded-lg border border-gray-300 py-2 font-medium transition hover:bg-gray-100"
          >
            Skip
          </button>

          <button
            onClick={handleLogin}
            className="flex-1 rounded-lg bg-indigo-600 py-2 font-medium text-white transition hover:bg-indigo-700"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
