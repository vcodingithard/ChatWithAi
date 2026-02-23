import { Box, Paper } from "@mui/material";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

const ChatMessage = ({ content, role, isTyping = false }) => {
  const isUser = role === "user";

  return (
    <Box sx={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      mb: 2,
      width: "100%"
    }}>
      <Paper sx={{
        p: 2,
        borderRadius: 3,
        maxWidth: { xs: "90%", md: "70%" }, // Responsive width!
        bgcolor: isUser ? "grey.800" : "transparent",
        color: "white",
        boxShadow: isUser ? 1 : 0,
      }}>
        <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
          {content}
        </ReactMarkdown>
      </Paper>
    </Box>
  );
};

export default ChatMessage;