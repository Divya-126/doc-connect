import { Loader } from "lucide-react";

const LoaderText = ({ text }) => {
  return (
    <div className="flex gap-2 items-center justify-center">
      <Loader className="size-4 animate-spin" />
      {text}
    </div>
  );
};

export default LoaderText;
