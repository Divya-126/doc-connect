import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  // hide draft doctors
  const activeDoctors = doctors.filter((doc) => !doc.isDraft);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>

      <p className="sm:w-1/3 text-center text-sm ">
        Simply explore our wide selection of trusted and experienced doctors.
      </p>

      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {activeDoctors.slice(0, 10).map((item, index) => (
          <div
            key={index}
            onClick={() => {
              if (item.available) {
                navigate(`/appointments/${item._id}`);
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth",
                });
              }
            }}
            className={`group bg-white border rounded-2xl overflow-hidden cursor-pointer 
            transition-all duration-500 hover:-translate-y-2 hover:shadow-xl
            ${item.available ? "border-blue-200" : "border-gray-200 opacity-70 cursor-not-allowed"}`}
          >
            <div className="overflow-hidden ">
              <img
                className="bg-blue-50 aspect-square w-full object-cover group-hover:scale-105 transition duration-500"
                src={item.image}
                alt={item.name}
              />
            </div>

            <div className="p-4">
              <div
                className={`flex items-center gap-2 text-sm font-medium ${
                  item.available ? "text-green-600" : "text-red-500"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.available ? "bg-green-600" : "bg-red-500"
                  }`}
                ></span>

                <span>
                  {item.available ? "Available Now" : "Currently Unavailable"}
                </span>
              </div>

              <p className="text-lg font-semibold text-gray-800 mt-1">
                {item.name}
              </p>

              <p className="text-gray-500 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-primary text-white px-6 h-10 rounded-full font-medium mt-7 hover:shadow-lg transition"
      >
        More
      </button>
    </div>
  );
};

export default TopDoctors;
