import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const { token, backendUrl, userData, setUserData, loadUserProfileData } =
    useContext(AppContext);

  const updateUserProfileData = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return userData ? (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        {/* PROFILE HEADER */}
        <div className="flex flex-col items-center border-b pb-6">
          {/* Profile Image */}
          {isEdit ? (
            <label htmlFor="image" className="relative cursor-pointer group">
              <img
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 group-hover:opacity-80 transition"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt=""
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full">
                  Change Photo
                </span>
              </div>
              <input
                type="file"
                id="image"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          ) : (
            <img
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              src={userData.image}
              alt=""
            />
          )}

          {/* Name */}
          {isEdit ? (
            <input
              className="mt-4 text-2xl font-semibold text-center border-b focus:outline-none focus:border-primary"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          ) : (
            <h2 className="mt-4 text-2xl font-semibold text-gray-800">
              {userData.name}
            </h2>
          )}

          <p className="text-gray-500 text-sm">{userData.email}</p>
        </div>

        {/* CONTACT SECTION */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Contact Information
          </h3>

          <div className="space-y-4">
            {/* Phone */}
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              {isEdit ? (
                <input
                  className="w-full mt-1 p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              ) : (
                <p className="text-gray-700 mt-1">{userData.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="text-sm text-gray-500">Address</label>
              {isEdit ? (
                <>
                  <input
                    className="w-full mt-1 p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Address Line 1"
                    value={userData.address?.line1 || ""}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: {
                          ...(prev.address || {}),
                          line1: e.target.value,
                        },
                      }))
                    }
                  />
                  <input
                    className="w-full mt-2 p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Address Line 2"
                    value={userData.address?.line2 || ""}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: {
                          ...(prev.address || {}),
                          line2: e.target.value,
                        },
                      }))
                    }
                  />
                </>
              ) : (
                <p className="text-gray-700 mt-1">
                  {userData.address?.line1} <br />
                  {userData.address?.line2}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BASIC INFO SECTION */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Basic Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Gender */}
            <div>
              <label className="text-sm text-gray-500">Gender</label>
              {isEdit ? (
                <select
                  className="w-full mt-1 p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none"
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                >
                  <option value="Not Selected">Not Selected</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p className="text-gray-700 mt-1">{userData.gender}</p>
              )}
            </div>

            {/* Birthday */}
            <div>
              <label className="text-sm text-gray-500">Birthday</label>
              {isEdit ? (
                <input
                  type="date"
                  className="w-full mt-1 p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none"
                  value={userData.dob}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                />
              ) : (
                <p className="text-gray-700 mt-1">{userData.dob}</p>
              )}
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-10 text-center">
          {isEdit ? (
            <button
              onClick={updateUserProfileData}
              disabled={loading}
              className={`px-8 py-2 rounded-full shadow-md transition-transform flex items-center justify-center gap-2 mx-auto ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:scale-105"
              }`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEdit(true);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="px-8 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default MyProfile;
