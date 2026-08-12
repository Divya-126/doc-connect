import { useState } from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialitySlider = () => {
  const [stopScroll, setStopScroll] = useState(false);

  return (
    <>
      <style>{`
                .marquee-inner {
                    animation: marqueeScroll linear infinite;
                }

                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }

                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>

      <div className="pt-10">
        <h2 className="text-md md:text-lg font-semibold text-center mb-10 bg-slate-100/80 rounded-full px-2 py-1 w-fit mx-auto md:px-4">
          Find Doctor by Speciality
        </h2>
        <div
          className="overflow-hidden w-full relative max-w-4xl   mx-auto"
          onMouseEnter={() => setStopScroll(true)}
          onMouseLeave={() => setStopScroll(false)}
        >
          <div className="absolute left-0  top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
          <div
            className="marquee-inner flex w-fit"
            style={{
              animationPlayState: stopScroll ? "paused" : "running",
              animationDuration: specialityData.length * 2500 + "ms",
            }}
          >
            <div className="flex">
              {[...specialityData, ...specialityData].map((item, index) => (
                <div
                  key={index}
                  className="w-40 mx-4 relative group hover:scale-90 transition-all duration-300 "
                >
                  <Link
                    to={`/doctors/${item.speciality}`}
                    className="flex flex-col items-center flex-shrink-0"
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-blue-500">
                      <img
                        src={item.image}
                        alt={item.speciality}
                        className="w-13 h-13 object-contain"
                      />
                    </div>

                    <p className="mt-1 text-xs text-center">
                      {item.speciality}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>
    </>
  );
};

export default SpecialitySlider;
