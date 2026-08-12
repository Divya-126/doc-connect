import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { StreamChat } from "stream-chat";

import {
  Channel,
  Window,
  Chat,
  ChannelHeader,
  MessageInput,
  MessageList,
} from "stream-chat-react";

import PageLoader from "../componenets/PageLoader";
import CallButton from "../componenets/CallButton";

// Stream API Key
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { docId, appId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [streamToken, setStreamToken] = useState("");
  const [appointment, setAppointment] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null);

  const { token, getStreamToken, userData, getAppointment } =
    useContext(AppContext);

  const navigate = useNavigate();

  // Video Call
  const handleVideoCall = () => {
    if (!channel) return;

    const callUrl = `/call-user/${channel.id}/${appId}`;

    channel.sendMessage({
      text: `I've started a video call. Join me via call button`,
    });

    navigate(callUrl);
    toast.success("Video call link sent successfully!");
  };

  //Get token + appointment
  useEffect(() => {
    const initData = async () => {
      if (!appId || !docId) return;

      try {
        const [sToken, appointmentData] = await Promise.all([
          getStreamToken(),
          getAppointment(appId),
        ]);

        if (!sToken) {
          toast.error("Error getting stream token");
          return;
        }

        setStreamToken(sToken);

        if (!appointmentData) {
          toast.error("Error getting appointment");
          return;
        }

        setAppointment(appointmentData);

        const [day, month, year] = appointmentData.slotDate.split("_");
        const date = new Date(
          `${year}-${month}-${day} ${appointmentData.slotTime}`,
        );

        setAppointmentTime(date);
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";
        toast.error(message);
        console.log(error);
      }
    };

    initData();
  }, [appId, docId]);

  // Prevent invalid access
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

  // Initialize chat
  useEffect(() => {
    const initChat = async () => {
      if (chatClient || !streamToken || !token || !userData?._id || !docId) {
        return;
      }

      try {
        console.log("Initializing Stream chat...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        const myId = userData._id.toString();
        const doctorId = docId.toString();

        // connect user (minimal payload)
        await client.connectUser(
          {
            id: myId,
            name: userData.name || "",
          },
          streamToken,
        );

        // create unique channel
        const channelId = [myId, doctorId].sort().join("-");

        const currentChannel = client.channel("messaging", channelId, {
          members: [myId, doctorId],
        });

        await currentChannel.watch();

        setChatClient(client);
        setChannel(currentChannel);
      } catch (error) {
        console.log("Chat init error:", error);
        toast.error("Could not connect to chat. Try again!");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [streamToken, token, userData?._id, docId]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [chatClient]);

  //  Loader
  if (isLoading || !chatClient || !channel) {
    return <PageLoader text="Connecting to chat..." />;
  }

  //  UI
  return (
    <div className="h-[86vh] w-full bg-indigo-300">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />

            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
