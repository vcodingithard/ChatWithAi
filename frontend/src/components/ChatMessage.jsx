import { Box, Paper, Avatar, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import DescriptionIcon from "@mui/icons-material/Description";

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        position: "absolute",
        top: "8px",
        right: "8px",
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "6px",
        color: "rgba(255, 255, 255, 0.6)",
        padding: "4px 8px",
        fontSize: "0.75rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        transition: "all 0.2s"
      }}
      className="copy-button"
    >
      {copied ? <CheckIcon sx={{ fontSize: 12, color: "#10b981" }} /> : <ContentCopyIcon sx={{ fontSize: 12 }} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

const ChatMessage = ({ content, role, image }) => {
  const isUser = role === "user";
  const hasImage = Boolean(image);

  return (
    <Box sx={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      mb: 4,
      width: "100%",
      px: { xs: 1, md: 0 },
      animation: "fadeIn 0.25s ease-out forwards"
    }}>
      {!isUser && (
        <Avatar 
          src="/media/logo.png" 
          sx={{ 
            width: 32, 
            height: 32, 
            mr: 2, 
            mt: 0.5, 
            p: "2px", 
            border: "1px solid rgba(255,255,255,0.1)", 
            bgcolor: "#000",
            boxShadow: "0 0 10px rgba(99,102,241,0.2)" 
          }} 
        />
      )}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: { xs: "90%", md: isUser ? "75%" : "88%" },
        alignItems: isUser ? "flex-end" : "flex-start"
      }}>
        {/* Role label */}
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.35)", ml: isUser ? 0 : 1, mr: isUser ? 1.5 : 0, mb: 0.75, fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.68rem" }}>
          {isUser ? "Workspace Client" : "Studio AI Operator"}
        </Typography>

        {/* Bubble */}
        <Paper sx={{
          p: isUser ? "12px 20px" : "12px 0px",
          borderRadius: isUser ? "16px 16px 2px 16px" : "0px",
          bgcolor: isUser ? "#1e293b" : "transparent",
          border: isUser ? "1px solid rgba(255,255,255,0.06)" : "none",
          color: "#ececec",
          boxShadow: 0,
          backgroundImage: "none",
          "& p": { margin: "0 0 16px 0", lineHeight: 1.7, fontSize: "0.95rem", color: isUser ? "#ececec" : "rgba(255,255,255,0.85)" },
          "& p:last-child": { margin: 0 },
          "& pre": { 
            bgcolor: "#070a13", 
            p: 2.5, 
            pt: 4.5,
            borderRadius: "12px", 
            overflowX: "auto", 
            border: "1px solid rgba(255,255,255,0.05)",
            position: "relative",
            "&:hover .copy-button": { opacity: 1 }
          },
          "& code": { fontFamily: "monospace", fontSize: "0.85rem", color: "#f472b6" },
          "& pre code": { color: "#ececec", p: 0, bgcolor: "transparent" },
          "& ul, & ol": { pl: 3, mb: 2 },
          "& li": { mb: 0.75, color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", lineHeight: 1.6 },
          "& table": { width: "100%", borderCollapse: "collapse", mb: 2, border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", overflow: "hidden" },
          "& th": { bgcolor: "rgba(255,255,255,0.02)", p: 1.5, fontSize: "0.85rem", fontWeight: "600", borderBottom: "2px solid rgba(255,255,255,0.08)", textAlign: "left" },
          "& td": { p: 1.5, fontSize: "0.88rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }
        }}>
          {hasImage && (
            <Box sx={{ mb: 2, position: "relative", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
              <img
                src={image}
                alt="Workspace attachment"
                style={{
                  maxWidth: "100%",
                  maxHeight: "350px",
                  display: "block"
                }}
              />
            </Box>
          )}

          {content && (
            <ReactMarkdown 
              rehypePlugins={[[rehypeHighlight, { detect: true }]]}
              components={{
                img: ({ node, ...props }) => (
                  <Box sx={{ my: 2, position: "relative", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", width: "fit-content" }}>
                    <img 
                      style={{ 
                        maxWidth: "100%", 
                        maxHeight: "350px", 
                        display: "block"
                      }} 
                      {...props} 
                    />
                  </Box>
                ),
                pre: ({ node, children, ...props }) => {
                  // Get child code text content to copy
                  const codeElement = children?.[0];
                  const codeText = codeElement?.props?.children || "";
                  return (
                    <pre {...props}>
                      <CopyButton text={codeText} />
                      {children}
                    </pre>
                  );
                },
                a: ({ node, children, ...props }) => {
                  const linkHref = props.href || "";
                  const isPdf = linkHref.includes(".pdf");
                  
                  if (isPdf) {
                    return (
                      <a 
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          color: "#818cf8", 
                          textDecoration: "none", 
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "14px 18px",
                          borderRadius: "14px",
                          backgroundColor: "rgba(99, 102, 241, 0.08)",
                          border: "1px solid rgba(99, 102, 241, 0.25)",
                          marginTop: "8px",
                          marginBottom: "8px",
                          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)",
                          transition: "all 0.2s"
                        }}
                        {...props} 
                      >
                        <DescriptionIcon sx={{ color: "#818cf8" }} />
                        <Box sx={{ textAlign: "left" }}>
                          <Typography variant="body2" fontWeight="700" sx={{ color: "white", fontSize: "0.85rem" }}>
                            {children}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", display: "block", fontSize: "0.68rem" }}>
                            Secure PDF Download (Cloudinary)
                          </Typography>
                        </Box>
                      </a>
                    );
                  }

                  return (
                    <a 
                      style={{ color: "#818cf8", textDecoration: "underline", fontWeight: "600" }} 
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props} 
                    >
                      {children}
                    </a>
                  );
                }
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatMessage;