import { Box, Typography, Container, Avatar } from "@mui/material";
import { useChatLogic } from "../hooks/useChatLogic";
import ChatMessage from "../components/ChatMessage";

const ChatContainer = () => {
  const { prevChats, lastReply, typedText } = useChatLogic();

  return (
    <Container maxWidth="md" sx={{ 
      minHeight: "100%", 
      display: "flex", 
      flexDirection: "column",
      py: 4,
      px: { xs: 2, md: 4 }
    }}>
      {prevChats.length === 0 ? (
        <Box sx={{ m: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Avatar src="/media/logo.png" sx={{ width: 64, height: 64, bgcolor: "white", p: 1, border: "1px solid rgba(255,255,255,0.1)" }} />
          <Typography variant="h5" fontWeight="500" color="white" sx={{ mt: 2 }}>
            How can I help you today?
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, px: 2, pb: 2 }}>
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