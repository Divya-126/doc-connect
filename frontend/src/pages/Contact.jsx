import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="px-6 md:px-12 lg:px-20 xl:px-32 py-12 bg-gradient-to-b from-blue-50 to-white">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
          <span className="text-gray-700">CONTACT </span>
          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            US
          </span>
        </h1>

        <p className="text-gray-500 mt-3 text-sm md:text-base max-w-xl mx-auto">
          We'd love to hear from you. Reach out anytime and our team will get
          back to you.
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 lg:p-12">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          {/* Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src={assets.contact_image}
              alt="Contact"
              className="w-full max-w-md rounded-2xl object-cover shadow-lg"
            />
          </div>

          {/* Contact Info */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-gray-700">OUR OFFICE</h2>

            <p className="text-gray-500 leading-relaxed">
              3rd Floor, Orbit Mall <br />
              AB Road, Vijay Nagar, Indore – 452010 <br />
              Madhya Pradesh, India
            </p>

            <div className="text-gray-500 space-y-1">
              <p>Tel: +91 98765 43210</p>
              <p>Email:docconnect126@gmail.com</p>
            </div>

            <h2 className="text-xl font-semibold text-gray-700 pt-2">
              CAREERS AT{" "}
              <span className="whitespace-nowrap text-primary">
                Doc-Connect
              </span>
            </h2>

            <p className="text-gray-500">
              Learn more about our teams and job openings.
            </p>

            <button className="w-fit px-7 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
