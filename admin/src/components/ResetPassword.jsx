import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader, Lock, X } from "lucide-react";
import { DoctorContext } from "../context/DocterContext";

const ResetPasswordModal = ({ open, setOpen }) => {
  const { backendUrl, dToken } = useContext(DoctorContext);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (newPassword !== confirmPassword) {
      setLoading(false);
      return toast.error("Passwords do not match");
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/reset-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        },
      );

      if (data.success) {
        setOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-96 p-6 relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl text-transparent bg-gradient-to-l from-blue-300 via-blue-400 to-blue-500 bg-clip-text font-bold mb-4 text-center">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Current Password */}
          <div className="flex items-center border group focus-within:shadow-[0_0_4px_#5f5e5e] transition-all duration-200 rounded-full px-4 h-11 hover:shadow-[0_0_4px_#5f5e5e]">
            <Lock className="size-4 text-gray-500 group-focus-within:text-indigo-400  " />
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full outline-none cursor-pointer text-sm py-2 ml-2 "
              required
            />
          </div>

          {/* New Password */}
          <div className="flex items-center border group focus-within:shadow-[0_0_4px_#5f5e5e] transition-all duration-200 rounded-full px-4 h-11 hover:shadow-[0_0_4px_#5f5e5e]">
            <Lock className="size-4 text-gray-500  group-focus-within:text-indigo-400 " />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full outline-none cursor-pointer text-sm py-2 ml-2"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="flex items-center border group focus-within:shadow-[0_0_4px_#5f5e5e] transition-all duration-200 rounded-full px-4 h-11 hover:shadow-[0_0_4px_#5f5e5e]">
            <Lock className="size-4 text-gray-500  group-focus-within:text-indigo-400 " />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full outline-none cursor-pointer text-sm py-2 ml-2"
              required
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="mt-3 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full gap-2 h-11 transition"
          >
            {isLoading && <Loader className="size-4 animate-spin" />}
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
