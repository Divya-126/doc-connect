import { VideoIcon } from "lucide-react";

const CallButton = ({ handleVideoCall }) => {
  return (
    <div className="p-3 border-b flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0">
      <button
        onClick={handleVideoCall}
        className="py-2 px-4 bg-gradient-to-l from-indigo-300 via-indigo-400 to-indigo-500 rounded-full"
      >
        <VideoIcon className="size-6 text-white" />
      </button>
    </div>
  );
};

export default CallButton;
