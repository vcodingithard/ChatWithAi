import { Box, Paper, Avatar, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

const ChatMessage = ({ content, role }) => {
  const isUser = role === "user";

  return (
    <Box sx={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      mb: 3,
      width: "100%",
      px: { xs: 1, md: 0 }
    }}>
      {!isUser && (
        <Avatar src="/media/logo.png" sx={{ width: 32, height: 32, mr: 2, mt: 0.5, p: 0.5, border: "1px solid rgba(255,255,255,0.1)", bgcolor: "black" }} />
      )}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: { xs: "90%", md: isUser ? "70%" : "100%" },
        alignItems: isUser ? "flex-end" : "flex-start"
      }}>
        {isUser && (
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", ml: 2, mb: 0.5 }}>You</Typography>
        )}
        {!isUser && (
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", ml: 1, mb: 0.5, fontWeight: "bold" }}>ChatGPT</Typography>
        )}
        <Paper sx={{
          p: isUser ? "10px 20px" : "10px 0px",
          borderRadius: isUser ? "24px" : "0px",
          bgcolor: isUser ? "#2f2f2f" : "transparent",
          color: "#ececec",
          boxShadow: 0,
          "& p": { margin: isUser ? 0 : "0 0 16px 0", lineHeight: 1.6, fontSize: "1rem" },
          "& pre": { bgcolor: "#0d0d0d", p: 2, borderRadius: 2, overflowX: "auto" },
          "& code": { fontFamily: "monospace", fontSize: "0.9rem" }
        }}>
          <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
            {content}
          </ReactMarkdown>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatMessage;