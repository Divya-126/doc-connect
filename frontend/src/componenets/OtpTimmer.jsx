import { useEffect, useState } from "react";

const OtpTimer = ({ seconds = 60, onResend }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResend = () => {
    onResend();
    setTimeLeft(seconds);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mt-4 text-sm text-gray-500 text-center">
      {timeLeft > 0 ? (
        <p>
          Resend OTP in{" "}
          <span className="font-medium">{formatTime(timeLeft)}</span>
        </p>
      ) : (
        <button
          disabled={timeLeft != 0}
          onClick={handleResend}
          className="text-blue-500 font-medium hover:underline"
        >
          Resend OTP
        </button>
      )}
    </div>
  );
};

export default OtpTimer;
