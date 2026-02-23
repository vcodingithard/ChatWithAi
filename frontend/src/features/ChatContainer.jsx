import { Box, Typography, Container } from "@mui/material";
import { useChatLogic } from "../hooks/useChatLogic";
import ChatMessage from "../components/ChatMessage";

const ChatContainer = () => {
  const { prevChats, lastReply, typedText } = useChatLogic();

  return (
    <Container maxWidth="md" sx={{ 
      height: "80vh", 
      display: "flex", 
      flexDirection: "column",
      py: 4 
    }}>
      {prevChats.length === 0 ? (
        <Box sx={{ m: "auto", textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold" color="grey.500">
            Start a new Chat
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflowY: "auto", px: 2 }}>
          {/* Historical Messages (minus the very last one) */}
          {prevChats.slice(0, -1).map((m, i) => (
            <ChatMessage key={i} role={m.role} content={m.content} />
          ))}

          {/* The Animated Last Reply */}
          {lastReply && (
            <ChatMessage role="assistant" content={typedText} isTyping={true} />
          )}
        </Box>
      )}
    </Container>
  );
};

export default ChatContainer;