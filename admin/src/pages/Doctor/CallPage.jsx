import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  StreamVideoClient,
  StreamCall,
  CallingState,
  useCallStateHooks,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  StreamVideo,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import { toast } from "react-toastify";
import PageLoader from "../../components/PageLoader";
import { DoctorContext } from "../../context/DocterContext";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { userId } = useParams();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setConnecting] = useState(true);
  const [streamToken, setStreamToken] = useState("");

  const hasJoined = useRef(false); // ✅ prevents duplicate join

  const { dToken, getStreamToken, profileData, getProfileData } =
    useContext(DoctorContext);

  // Get token + profile
  useEffect(() => {
    const init = async () => {
      try {
        const sToken = await getStreamToken();

        if (sToken) {
          setStreamToken(sToken);
        } else {
          toast.error("Error getting stream token");
        }

        await getProfileData();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Init error");
        console.log(error);
      }
    };

    init();
  }, [dToken]); // clean dependency

  // 🎥 Initialize Call
  useEffect(() => {
    let isMounted = true;

    const initCall = async () => {
      if (
        hasJoined.current || //  prevent duplicate
        !streamToken ||
        !dToken ||
        !userId ||
        !profileData?._id
      ) {
        return;
      }

      try {
        console.log("Initializing Stream video Call...");

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: profileData._id,
            name: profileData.name,
          },
          token: streamToken,
        });

        const callInstance = videoClient.call("default", userId);

        await callInstance.join({ create: true });

        if (isMounted) {
          setClient(videoClient);
          setCall(callInstance);
          hasJoined.current = true;
        }

        console.log("Joined call successfully");
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not connect to call, please try again");
      } finally {
        if (isMounted) setConnecting(false);
      }
    };

    initCall();

    return () => {
      isMounted = false;

      if (call) {
        call.leave();
      }

      if (client) {
        client.disconnectUser();
      }
    };
  }, [streamToken, dToken, userId, profileData?._id]);

  if (isConnecting || !call || !client) {
    return <PageLoader text="Connecting to call, please wait..." />;
  }

  return (
    <div className="h-[90vh] flex items-center justify-center">
      <div className="relative w-[55%]">
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      </div>
    </div>
  );
};

//  Call UI
const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
