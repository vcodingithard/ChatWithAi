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
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", ml: 1, mb: 0.5, fontWeight: "bold" }}>SigmaGPT</Typography>
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
          <ReactMarkdown 
            rehypePlugins={[[rehypeHighlight, { detect: true }]]}
            components={{
              img: ({ node, ...props }) => (
                <img 
                  style={{ 
                    maxWidth: "100%", 
                    maxHeight: "350px", 
                    borderRadius: "12px", 
                    marginTop: "8px", 
                    marginBottom: "8px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.1)"
                  }} 
                  {...props} 
                />
              ),
              a: ({ node, children, ...props }) => (
                <a 
                  style={{ 
                    color: "#10a37f", 
                    textDecoration: "none", 
                    fontWeight: "bold",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(16, 163, 127, 0.1)",
                    border: "1px solid rgba(16, 163, 127, 0.25)",
                    marginTop: "6px",
                    marginBottom: "6px",
                    boxShadow: "0 2px 8px rgba(16, 163, 127, 0.15)",
                    transition: "all 0.2s"
                  }} 
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props} 
                >
                  📄 {children}
                </a>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatMessage;