import { toast } from "react-toastify";
import axios from "axios";
import { DoctorContext } from "../../context/DocterContext";
import { AppContext } from "../../context/AppContext";
import { useContext, useState, useEffect } from "react";
import { Camera, Loader, Plus, X } from "lucide-react";
import ResetPasswordModal from "../../components/ResetPassword.jsx";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoding, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const updateProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("fees", profileData.fees);
      formData.append("about", profileData.about);
      formData.append("available", profileData.available);

      formData.append("address", JSON.stringify(profileData.address));
      formData.append("workingDays", JSON.stringify(profileData.workingDays));

      // important: field name must be "image"
      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div className="min-h-screen bg-gray-50 flex justify-center items-start p-4 md:p-10">
        <div className=" overflow-y-auto w-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-xl p-6 md:p-10">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Image */}
            <div className="relative w-40 h-40 rounded-xl shadow-md border overflow-hidden group">
              {isEdit ? (
                <div className="w-full h-full ">
                  <label
                    htmlFor="doc-img"
                    className="w-full cursor-pointer  h-full"
                  >
                    <div className=" opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute inset-0 flex items-center justify-center bg-slate-600/40">
                      <span className="p-5 rounded-full bg-slate-400/80">
                        <Camera className="size-8 text-slate-300/90" />
                      </span>
                    </div>
                    <img
                      className="w-full h-full object-cover"
                      src={
                        image ? URL.createObjectURL(image) : profileData.image
                      }
                      alt="Doctor"
                    />
                  </label>

                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    type="file"
                    id="doc-img"
                    hidden
                  />
                </div>
              ) : (
                <img
                  className="w-full h-full object-cover rounded-xl"
                  src={profileData?.image}
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              {isEdit ? (
                <input
                  type="text"
                  placeholder="Doctor Name"
                  className="w-full border rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              ) : (
                <h2 className="text-3xl font-semibold text-gray-800">
                  {profileData.name}
                </h2>
              )}

              {isEdit ? (
                <div className="flex gap-2 my-2">
                  <input
                    type="text"
                    placeholder="Doctors degree"
                    className="w-full border rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none"
                    value={profileData.degree}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        degree: e.target.value,
                      }))
                    }
                  />
                  <select
                    value={profileData.speciality}
                    placeholder="Select your speciality"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        speciality: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="General physician">General physician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatricians">Pediatricians</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Gastroenterologist">
                      Gastroenterologist
                    </option>
                  </select>
                </div>
              ) : (
                <p className="text-gray-600 mt-1">
                  {profileData.degree} • {profileData.speciality}
                </p>
              )}

              {isEdit ? (
                <select
                  value={profileData.experience}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                  className="w-25 rounded-full border text-gray-700 py-1.5 px-2 focus:ring-1 focus:ring-primary outline-none  "
                >
                  <option value="1 Year">1 Year</option>
                  <option value="2 Year">2 Years</option>
                  <option value="3 Year">3 Years</option>
                  <option value="4 Year">4 Years</option>
                  <option value="5 Year">5 Years</option>
                  <option value="6 Year">6 Years</option>
                  <option value="8 Year">8 Years</option>
                  <option value="9 Year">9 Years</option>
                  <option value="10 Year">10+ Years</option>
                </select>
              ) : (
                <span className="inline-block mt-2 px-3 py-1 text-sm border rounded-full text-gray-700">
                  {profileData.experience}
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t my-6"></div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              About Doctor
            </h3>

            {isEdit ? (
              <textarea
                rows={6}
                className="w-full border rounded-lg p-3 focus:ring-1 focus:ring-primary outline-none"
                value={profileData.about}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    about: e.target.value,
                  }))
                }
              />
            ) : (
              <p className="text-gray-600 leading-relaxed">
                {profileData.about}
              </p>
            )}
          </div>

          {/* Fee Section */}
          <div className="mt-6">
            <p className="text-gray-700 font-medium">Appointment Fee</p>

            {isEdit ? (
              <input
                type="number"
                className="mt-2 border rounded-lg p-2 w-40 focus:ring-1 focus:ring-primary outline-none"
                value={profileData.fees}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    fees: e.target.value,
                  }))
                }
              />
            ) : (
              <p className="text-lg text-gray-800 mt-1">
                {currency} {profileData.fees}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="mt-6">
            <p className="font-medium text-gray-700">Address</p>

            <div className="mt-2 space-y-2">
              {isEdit ? (
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none"
                  value={profileData.address.line1}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line1: e.target.value,
                      },
                    }))
                  }
                />
              ) : (
                <p className="text-gray-600">{profileData.address.line1}</p>
              )}

              {isEdit ? (
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none"
                  value={profileData.address.line2}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line2: e.target.value,
                      },
                    }))
                  }
                />
              ) : (
                <p className="text-gray-600">{profileData.address.line2}</p>
              )}
            </div>
          </div>
          {/* Working Schedule */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Doctor Working Schedule
            </h3>

            <p className="text-sm text-gray-500 mb-6">
              Set your clinic working hours and optional break times for each
              day.
            </p>

            <div className="space-y-5">
              {profileData.workingDays?.map((dayItem, dayIndex) => {
                const isWorking = Boolean(dayItem.startTime && dayItem.endTime);
                return (
                  <div
                    key={dayIndex}
                    className="border rounded-xl p-4 bg-gray-50"
                  >
                    {/* Day Header */}
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-700">
                        {dayItem.day}
                      </h4>

                      {isEdit && (
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={isWorking}
                            onChange={() => {
                              const updated = [...profileData.workingDays];

                              if (isWorking) {
                                updated[dayIndex].startTime = "";
                                updated[dayIndex].endTime = "";
                                updated[dayIndex].breaks = [];
                              } else {
                                updated[dayIndex].startTime = "09:00";
                                updated[dayIndex].endTime = "17:00";
                                updated[dayIndex].breaks = [];
                              }

                              setProfileData((prev) => ({
                                ...prev,
                                workingDays: updated,
                              }));
                            }}
                          />
                          Working Day
                        </label>
                      )}
                    </div>

                    {isWorking && (
                      <div className="space-y-4">
                        {/* Working Time */}
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            Working Hours
                          </p>

                          <div className="flex flex-wrap gap-3 items-center">
                            {isEdit ? (
                              <>
                                <input
                                  type="time"
                                  value={dayItem.startTime}
                                  className="outline-none border focus:shadow-[0_0_4px_#7a7979] rounded-lg px-3 py-1"
                                  onChange={(e) => {
                                    const updated = [
                                      ...profileData.workingDays,
                                    ];
                                    updated[dayIndex].startTime =
                                      e.target.value;

                                    setProfileData((prev) => ({
                                      ...prev,
                                      workingDays: updated,
                                    }));
                                  }}
                                />

                                <span className="text-gray-500">to</span>

                                <input
                                  type="time"
                                  value={dayItem.endTime}
                                  className="outline-none border focus:shadow-[0_0_4px_#7a7979] rounded-lg px-3 py-1"
                                  onChange={(e) => {
                                    const updated = [
                                      ...profileData.workingDays,
                                    ];
                                    updated[dayIndex].endTime = e.target.value;
                                    console.log(e.target.value);
                                    setProfileData((prev) => ({
                                      ...prev,
                                      workingDays: updated,
                                    }));
                                    console.log(updated);
                                  }}
                                />
                              </>
                            ) : (
                              <p className="text-gray-600">
                                {dayItem.startTime} - {dayItem.endTime}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Break Section */}
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            Break Time (Optional)
                          </p>

                          {dayItem.breaks?.map((br, breakIndex) => (
                            <div
                              key={breakIndex}
                              className="flex flex-wrap gap-3 items-center mb-2"
                            >
                              {isEdit ? (
                                <>
                                  <input
                                    type="time"
                                    value={br.start}
                                    className="outline-none border focus:shadow-[0_0_4px_#7a7979] rounded-lg px-3 py-1"
                                    onChange={(e) => {
                                      const updated = [
                                        ...profileData.workingDays,
                                      ];
                                      updated[dayIndex].breaks[
                                        breakIndex
                                      ].start = e.target.value;

                                      setProfileData((prev) => ({
                                        ...prev,
                                        workingDays: updated,
                                      }));
                                    }}
                                  />

                                  <span className="text-gray-500">to</span>

                                  <input
                                    type="time"
                                    value={br.end}
                                    className="outline-none border focus:shadow-[0_0_4px_#7a7979] rounded-lg px-3 py-1"
                                    onChange={(e) => {
                                      const updated = [
                                        ...profileData.workingDays,
                                      ];
                                      updated[dayIndex].breaks[breakIndex].end =
                                        e.target.value;

                                      setProfileData((prev) => ({
                                        ...prev,
                                        workingDays: updated,
                                      }));
                                    }}
                                  />

                                  <button
                                    className="text-red-500 p-2 shado rounded-full hover:bg-slate-300 transition-colors duration-200 "
                                    onClick={() => {
                                      const updated = [
                                        ...profileData.workingDays,
                                      ];
                                      updated[dayIndex].breaks.splice(
                                        breakIndex,
                                        1,
                                      );

                                      setProfileData((prev) => ({
                                        ...prev,
                                        workingDays: updated,
                                      }));
                                    }}
                                  >
                                    <X className="size-4" />
                                  </button>
                                </>
                              ) : (
                                <p className="text-gray-500">
                                  {br.start} - {br.end}
                                </p>
                              )}
                            </div>
                          ))}

                          {isEdit && (
                            <button
                              className="text-sky-50 items-center text-xs md:text-sm flex gap-1 px-2 md:px-4 py-1 md:py-2 rounded-full bg-gradient-to-l from-blue-300 via-blue-400 to-blue-500"
                              onClick={() => {
                                const updated = [...profileData.workingDays];

                                updated[dayIndex].breaks.push({
                                  start: "13:00",
                                  end: "14:00",
                                });

                                setProfileData((prev) => ({
                                  ...prev,
                                  workingDays: updated,
                                }));
                              }}
                            >
                              <Plus className="size-4" />
                              Add Break
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Availability */}
          <div className="mt-6 flex items-center gap-3">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={profileData?.available}
              onChange={() =>
                isEdit &&
                setProfileData((prev) => ({
                  ...prev,
                  available: !prev?.available,
                }))
              }
            />

            <label className="text-gray-700 font-medium">
              Available for Appointment
            </label>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end">
            {isEdit ? (
              <div className="flex flex-col gap-2 md:flex-row md:justify-between w-full">
                <button
                  disabled={isLoding}
                  onClick={() => setOpen(true)}
                  className="px-6 py-2 flex items-center justify-center gap-2 bg-sky-500 text-white  rounded-lg shadow-lg hover:opacity-80 transition"
                >
                  {isLoding && <Loader className="size-4 animate-spin" />}
                  {isLoding ? "Saving..." : "Reset Password"}
                </button>
                <button
                  disabled={isLoding}
                  onClick={updateProfile}
                  className="px-6 py-2 flex items-center justify-center gap-2 bg-primary text-white rounded-lg shadow hover:opacity-90 transition"
                >
                  {isLoding && <Loader className="size-4 animate-spin" />}
                  {isLoding ? "Saving..." : "Save Changes"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
        <ResetPasswordModal open={isOpen} setOpen={setOpen} />
      </div>
    )
  );
};

export default DoctorProfile;
