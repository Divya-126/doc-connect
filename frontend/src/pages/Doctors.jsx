import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  useEffect(() => {
    // hide draft doctors first
    const activeDoctors = doctors.filter((doc) => !doc.isDraft);

    if (speciality) {
      setFilterDoc(
        activeDoctors.filter(
          (doc) => doc.speciality.trim() === speciality.trim(),
        ),
      );
    } else {
      setFilterDoc(activeDoctors);
    }
  }, [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="sm:hidden px-4 py-2 border rounded bg-primary text-white text-sm"
        >
          {showFilter ? "Close Filters" : "Filters"}
        </button>

        {/* Filter Sidebar */}
        <div
          className={`flex flex-col gap-4 text-sm text-gray-600 
          ${showFilter ? "flex" : "hidden"} sm:flex`}
        >
          <p
            onClick={() => {
              navigate("/doctors");
              setShowFilter(false);
            }}
            className={`pl-3 py-1.5 pr-16 border border-gray-300 rounded cursor-pointer transition-all
              ${!speciality ? "bg-primary text-white" : ""}`}
          >
            All
          </p>

          {specialities.map((item, index) => (
            <p
              key={index}
              onClick={() => {
                navigate(`/doctors/${item}`);
                setShowFilter(false);
              }}
              className={`pl-3 py-1.5 pr-16 border border-gray-300 rounded cursor-pointer transition-all
                ${speciality === item ? "bg-primary text-white" : ""}`}
            >
              {item}
            </p>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="w-full grid grid-cols-2  sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 pt-5 gap-y-7">
          {filterDoc.map((item) => (
            <div
              key={item._id}
              onClick={() => {
                if (item.available) {
                  navigate(`/appointments/${item._id}`);
                }
              }}
              className={`bg-white border rounded-xl overflow-hidden cursor-pointer
              hover:-translate-y-2 hover:shadow-lg transition-all duration-300
              ${item.available ? "border-blue-200" : "border-gray-200 opacity-70 cursor-not-allowed"}`}
            >
              <div className="overflow-hidden">
                <img
                  className="bg-blue-50 aspect-square w-full object-cover group-hover:scale-105 transition duration-500"
                  src={item.image}
                  alt={item.name}
                />
              </div>

              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-xs font-medium ${
                    item.available ? "text-green-600" : "text-red-500"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.available ? "bg-green-600" : "bg-red-500"
                    }`}
                  ></span>

                  <span>{item.available ? "Available" : "Unavailable"}</span>
                </div>

                <p className="text-base font-semibold text-gray-800 mt-1">
                  {item.name}
                </p>

                <p className="text-gray-500 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
