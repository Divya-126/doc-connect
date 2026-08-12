import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DoctorContext } from "../../context/DocterContext.jsx";
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

import PageLoader from "../../components/PageLoader.jsx";
import CallButton from "../../components/CallButton.jsx";

// Stream API Key
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [streamToken, setStreamToken] = useState("");

  const hasConnected = useRef(false); // ✅ prevents duplicate connection

  const { dToken, getStreamToken, profileData, getProfileData } =
    useContext(DoctorContext);

  // 📞 Video Call
  const handleVideoCall = async () => {
    if (!channel) return;

    const callUrl = `/doctor-call/${channel.id}`;

    await channel.sendMessage({
      text: `I've started a video call. Join me via call button`,
    });

    navigate(callUrl);
    toast.success("Video call link sent successfully!");
  };

  // 🔑 Get Stream Token + Profile
  useEffect(() => {
    const tokenInit = async () => {
      try {
        const sToken = await getStreamToken();

        if (sToken) {
          setStreamToken(sToken);
        } else {
          toast.error("Error getting stream token");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Token error");
        console.log(error);
      }

      await getProfileData();
    };

    tokenInit();
  }, []);

  // 💬 Initialize Chat
  useEffect(() => {
    let isMounted = true;

    const initChat = async () => {
      if (
        hasConnected.current || // ✅ prevents double execution (Strict Mode fix)
        !streamToken ||
        !dToken ||
        !profileData?._id ||
        !userId
      ) {
        return;
      }

      try {
        console.log("Initializing Stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        // ✅ Prevent duplicate connectUser
        if (!client.userID) {
          await client.connectUser(
            {
              id: profileData._id.toString(),
              name: profileData.name,
            },
            streamToken,
          );
        }

        const channelId = [profileData._id.toString(), userId].sort().join("-");

        const currentChannel = client.channel("messaging", channelId, {
          members: [profileData._id.toString(), userId],
        });

        await currentChannel.watch();

        if (isMounted) {
          setChatClient(client);
          setChannel(currentChannel);
          hasConnected.current = true; // ✅ mark as connected
        }
      } catch (error) {
        console.log("Initializing chat error", error);
        toast.error("Could not connect to chat. Please try again!");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initChat();

    return () => {
      isMounted = false;

      const client = StreamChat.getInstance(STREAM_API_KEY);

      if (client.userID) {
        client.disconnectUser(); // ✅ cleanup on unmount
      }
    };
  }, [streamToken, dToken, profileData?._id, userId]);

  // ⏳ Loader
  if (isLoading || !chatClient || !channel) {
    return <PageLoader text="Connecting to chat..." />;
  }

  // 🎯 UI
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
