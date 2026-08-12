import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="px-6 md:px-12 lg:px-20 xl:px-32 py-12 bg-gradient-to-b from-blue-50 via-blue-50 to-white">
      {/* Heading */}
      <div className="text-center mb-20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
          <span className="text-gray-700">ABOUT </span>
          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            US
          </span>
        </h1>
      </div>

      {/* About Section */}
      <div className="flex flex-col lg:flex-row  gap-12 mb-14 items-center lg:items-start">
        {/* Image */}
        <img
          className="w-full md:max-w-[420px] lg:max-w-[480px] rounded-2xl shadow-lg object-cover"
          src={assets.about_image}
          alt="About Doc-Connect"
        />

        {/* Text Section */}
        <div className="flex flex-col justify-center md:ml-5 md:mt-10 gap-6 lg:w-2/4 text-sm text-gray-600 leading-relaxed text-justify">
          <p>
            Welcome to{" "}
            <span className="font-semibold text-gray-700">Doc-Connect</span>,
            your trusted partner in managing your healthcare needs conveniently
            and efficiently. At Doc-Connect, we understand the challenges
            individuals face when it comes to scheduling doctor appointments and
            managing their health records.
          </p>

          <p>
            Doc-Connect is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, Doc-Connect is here to support you every step of the
            way.
          </p>

          <b className="text-gray-700">Our Vision</b>

          <p>
            Our vision at Doc-Connect is to create a seamless healthcare
            experience for every user. We aim to bridge the gap between patients
            and healthcare providers, making it easier for you to access the
            care you need, when you need it.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className=" text-xl md:text-3xl mb-6 md:mb-10 md:ml-[40%] ">
        <p>
          WHY{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            CHOOSE US
          </span>
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border px-8 py-8 rounded-xl flex flex-col gap-4 text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
          <b>EFFICIENCY</b>
          <p>
            Streamlined appointment scheduling that fits into your busy
            lifestyle.
          </p>
        </div>

        <div className="border px-8 py-8 rounded-xl flex flex-col gap-4 text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
          <b>CONVENIENCE</b>
          <p>
            Access to a network of trusted healthcare professionals in your
            area.
          </p>
        </div>

        <div className="border px-8 py-8 rounded-xl flex flex-col gap-4 text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
          <b>PERSONALIZATION</b>
          <p>
            Tailored recommendations and reminders to help you stay on top of
            your health.
          </p>
        </div>

        <div className="border px-8 py-8 rounded-xl flex flex-col gap-4 text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
          <b>VIRTUAL CONSULTATION</b>
          <p>
            Connect with doctors through secure video consultations from the
            comfort of your home.
          </p>
        </div>

        <div className="border px-8 py-8 rounded-xl flex flex-col gap-4 text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
          <b>SECURE PLATFORM</b>
          <p>
            Your medical information and appointments are protected with strong
            privacy and security standards.
          </p>
        </div>

        <div className="border px-8 py-8 rounded-xl flex flex-col gap-4 text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
          <b>HEALTH REMINDERS</b>
          <p>
            Get timely reminders for appointments, medications, and follow-ups
            to maintain better health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
