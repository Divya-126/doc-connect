import { LoaderIcon } from "lucide-react";

const PageLoader = ({ text }) => {
  return (
    <div className="h-screen  flex flex-col items-center gap-4 justify-center p-4">
      <LoaderIcon className="size-10 text-blue-400 animate-spin" />
      <p className="text-center text-lg font-mono">{text}</p>
    </div>
  );
};

export default PageLoader;
