import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const {
    doctors = [],
    aToken,
    getAllDoctors,
    changeAvailability,
    deleteDoctor,
    saveDoctorDraft,
    restoreDoctor,
  } = useContext(AdminContext);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Fetch doctors
  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken, getAllDoctors]);

  const handleDeleteClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const deletePermanently = async () => {
    if (!selectedDoctor?._id) return;

    await deleteDoctor(selectedDoctor._id);
    setShowDeleteModal(false);
    setSelectedDoctor(null);
    getAllDoctors();
  };

  const saveAsDraft = async () => {
    if (!selectedDoctor?._id) return;

    await saveDoctorDraft(selectedDoctor._id);
    setShowDeleteModal(false);
    setSelectedDoctor(null);
    getAllDoctors();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Doctors Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage doctors availability and information
          </p>
        </div>

        <div className="bg-blue-50 text-blue-700 px-5 py-2 rounded-xl font-semibold text-sm shadow-sm">
          Total Doctors: {Array.isArray(doctors) ? doctors.length : 0}
        </div>
      </div>

      {/* Doctors Grid */}
      {Array.isArray(doctors) && doctors.length > 0 ? (
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {doctors.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden group"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    src={item.image || "/default-doctor.png"}
                    alt={item.name}
                  />
                </div>

                {/* Info */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.speciality}
                  </p>

                  <div className="h-px bg-gray-200 my-4"></div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Status
                      </p>

                      <span
                        className={`text-sm font-semibold ${
                          item.isDraft
                            ? "text-yellow-600"
                            : item.available
                              ? "text-green-600"
                              : "text-red-500"
                        }`}
                      >
                        {item.isDraft
                          ? "Drafted"
                          : item.available
                            ? "Available"
                            : "Unavailable"}
                      </span>
                    </div>

                    {/* Availability Toggle */}
                    {!item.isDraft && (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={Boolean(item.available)}
                          onChange={() => changeAvailability(item._id)}
                        />

                        <div className="w-12 h-7 bg-gray-300 rounded-full peer-checked:bg-blue-500"></div>

                        <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition"></div>
                      </label>
                    )}
                  </div>

                  {/* Buttons */}

                  {!item.isDraft ? (
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold"
                    >
                      Delete Doctor
                    </button>
                  ) : (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => restoreDoctor(item._id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 rounded text-xs"
                      >
                        Restore
                      </button>

                      <button
                        onClick={() => deleteDoctor(item._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-60 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-lg font-medium">No doctors found</p>
        </div>
      )}

      {/* Delete Modal */}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Delete Doctor
            </h2>

            <p className="text-gray-500 mb-6">
              What do you want to do with this doctor?
            </p>

            <div className="flex gap-3">
              <button
                onClick={deletePermanently}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
              >
                Delete Permanently
              </button>

              <button
                onClick={saveAsDraft}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg"
              >
                Save in Draft
              </button>
            </div>

            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedDoctor(null);
              }}
              className="mt-4 text-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;
