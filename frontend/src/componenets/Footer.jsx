import React from "react";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gradient-to-b from-white via-blue-50/40 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start items-center gap-10">
          {/* Left Section */}

          <div className="max-w-md text-center md:text-left">
            <img
              src="/logo.png"
              alt="Doc Connect"
              className="w-40 mx-auto md:mx-0 mb-4"
            />

            <p className="text-sm text-gray-600 leading-6">
              Doc-Connect is your trusted healthcare companion, helping you find
              experienced doctors, schedule appointments, and manage your
              healthcare journey through one secure and user-friendly platform.
            </p>

            {/* Social Icons */}

            <div className="flex justify-center md:justify-start gap-3 mt-6">
              {/* X */}

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-sm hover:scale-110 hover:shadow-lg transition-all duration-300"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </a>

              {/* Github */}

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center shadow-sm hover:scale-110 hover:shadow-lg transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>

              {/* LinkedIn */}

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shadow-sm hover:scale-110 hover:shadow-lg transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Section */}

          <div className="w-full md:w-auto text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Get In Touch
            </h3>

            <div className="space-y-4">
              <div className="flex items-start justify-center md:justify-start gap-3">
                <div className="mt-1 text-primary text-lg">📍</div>

                <p className="text-gray-500 text-sm leading-6">
                  3rd Floor, Orbit Mall <br />
                  AB Road, Vijay Nagar, Indore – 452010 <br />
                  Madhya Pradesh, India
                </p>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-primary text-lg">📞</span>

                <p className="text-gray-500 text-sm">+91 98765 43210</p>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-primary text-lg">✉️</span>

                <p className="text-gray-500 text-sm break-all">
                  docconnect126@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Footer */}

        <div className="mt-10 pt-5 border-t border-gray-200">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-primary">Doc-Connect</span>.
              All Rights Reserved.
            </p>

            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="group w-11 h-11 rounded-full bg-primary text-white shadow-md hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5  transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
