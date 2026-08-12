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
import PageLoader from "../componenets/PageLoader";
import { AppContext } from "../context/AppContext";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { docId, appId } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setConnecting] = useState(true);
  const [streamToken, setStreamToken] = useState("");
  const [appointment, setAppointment] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null);

  const hasJoined = useRef(false); // ✅ prevents duplicate join

  const { token, getStreamToken, userData, getAppointment } =
    useContext(AppContext);

  // 🔑 Get token + appointment
  useEffect(() => {
    const init = async () => {
      if (!docId || !appId) return;

      try {
        const sToken = await getStreamToken();
        const appointmentData = await getAppointment(appId);

        if (!appointmentData) {
          toast.error("Error getting appointment");
          return;
        }

        setAppointment(appointmentData);

        const [day, month, year] = appointmentData.slotDate.split("_");

        const time = new Date(
          `${year}-${month}-${day} ${appointmentData.slotTime}`,
        );

        setAppointmentTime(time);

        if (sToken) {
          setStreamToken(sToken);
        } else {
          toast.error("Error getting stream token");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Init error");
        console.log(error);
      }
    };

    init();
  }, [docId, appId]);

  // 🚫 Appointment validation (correct way)
  useEffect(() => {
    if (!appointment || !appointmentTime) return;

    if (
      appointment.isCompleted ||
      appointment.cancelled ||
      appointmentTime > new Date()
    ) {
      toast.error("Invalid appointment...");
      navigate("/");
    }
  }, [appointment, appointmentTime]);

  // 🎥 Initialize Call
  useEffect(() => {
    let isMounted = true;

    const initCall = async () => {
      if (
        hasJoined.current ||
        !streamToken ||
        !token ||
        !docId ||
        !userData?._id
      ) {
        return;
      }

      try {
        console.log("Initializing Stream video Call...");

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: userData._id,
            name: userData.name,
          },
          token: streamToken,
        });

        const callInstance = videoClient.call("default", docId);

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

    // ✅ CLEANUP (VERY IMPORTANT)
    return () => {
      isMounted = false;

      if (call) {
        call.leave();
      }

      if (client) {
        client.disconnectUser();
      }
    };
  }, [streamToken, token, docId, userData?._id]);

  if (isConnecting || !call || !client) {
    return <PageLoader text="Connecting to call, please wait..." />;
  }

  return (
    <div className="h-[90vh] flex items-center justify-center">
      <div className="relative w-[70%]">
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      </div>
    </div>
  );
};

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
