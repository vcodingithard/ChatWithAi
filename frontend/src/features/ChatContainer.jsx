import { Box, Typography, Container, Paper } from "@mui/material";
import { useChatLogic } from "../hooks/useChatLogic";
import ChatMessage from "../components/ChatMessage";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import ChatIcon from "@mui/icons-material/Chat";

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
        <Box sx={{ m: "auto", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", textAlign: "center", py: 4 }} className="animate-fade-in">
          {/* Glowing Center Logo Accent */}
          <Box sx={{ 
            width: 72, 
            height: 72, 
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", 
            borderRadius: "24px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            boxShadow: "0 8px 30px rgba(99, 102, 241, 0.3)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            fontWeight: "black",
            fontSize: "2.4rem",
            mb: 3
          }}>
            D
          </Box>
          
          <Typography variant="h4" fontWeight="800" sx={{ color: "white", tracking: "-0.5px", fontSize: { xs: "1.8rem", md: "2.2rem" } }}>
            AI Workspace Studio
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.45)", mt: 1, mb: 5, maxWidth: "460px", fontSize: "0.95rem" }}>
            Select a mode, enter instructions, or upload assets to begin parsing information and compiling assets.
          </Typography>

          {/* Feature Grid using responsive Flexbox */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, width: "100%", maxWidth: "720px", justifyContent: "center" }}>
            
            <Paper sx={{
              p: 2.5,
              width: { xs: "100%", sm: "calc(50% - 10px)" },
              bgcolor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "16px",
              textAlign: "left",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.04)",
                borderColor: "rgba(99, 102, 241, 0.2)",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
              }
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <ChatIcon sx={{ color: "#34d399", fontSize: "20px" }} />
                <Typography variant="subtitle2" fontWeight="700" sx={{ color: "white" }}>
                  Standard Assistant
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", display: "block", lineHeight: 1.5 }}>
                General conversational guidance, code generation, logic puzzles, and text writing support.
              </Typography>
            </Paper>

            <Paper sx={{
              p: 2.5,
              width: { xs: "100%", sm: "calc(50% - 10px)" },
              bgcolor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "16px",
              textAlign: "left",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.04)",
                borderColor: "rgba(168, 85, 247, 0.2)",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
              }
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <AutoAwesomeIcon sx={{ color: "#a855f7", fontSize: "20px" }} />
                <Typography variant="subtitle2" fontWeight="700" sx={{ color: "white" }}>
                  Smart Text Studio
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", display: "block", lineHeight: 1.5 }}>
                AI routes your text prompts to specialized processors to summarize, explain, generate PDFs, or trigger Flux image generation.
              </Typography>
            </Paper>

            <Paper sx={{
              p: 2.5,
              width: { xs: "100%", sm: "calc(50% - 10px)" },
              bgcolor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "16px",
              textAlign: "left",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.04)",
                borderColor: "rgba(129, 140, 248, 0.2)",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
              }
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <ImageIcon sx={{ color: "#818cf8", fontSize: "20px" }} />
                <Typography variant="subtitle2" fontWeight="700" sx={{ color: "white" }}>
                  Image Analyzer & OCR
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", display: "block", lineHeight: 1.5 }}>
                Upload attachments to run optical character extraction (OCR) and generate descriptive image explanations or captions.
              </Typography>
            </Paper>

            <Paper sx={{
              p: 2.5,
              width: { xs: "100%", sm: "calc(50% - 10px)" },
              bgcolor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "16px",
              textAlign: "left",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.04)",
                borderColor: "rgba(251, 113, 133, 0.2)",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
              }
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <DescriptionIcon sx={{ color: "#fb7185", fontSize: "20px" }} />
                <Typography variant="subtitle2" fontWeight="700" sx={{ color: "white" }}>
                  Document Compiler
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", display: "block", lineHeight: 1.5 }}>
                Export generated structures into high-quality PDFs stored securely in Cloudinary for instant distribution.
              </Typography>
            </Paper>

          </Box>
        </Box>
      ) : (
        <Box sx={{ flex: 1, px: { xs: 0, md: 2 }, pb: 2 }}>
          {/* Historical Messages */}
          {prevChats.slice(0, -1).map((m, i) => (
            <ChatMessage key={i} role={m.role} content={m.content} image={m.image} />
          ))}

          {/* The Animated Last Reply */}
          {lastReply && (
            <ChatMessage role={lastReply.role} content={typedText} image={lastReply.image} isTyping={true} />
          )}
        </Box>
      )}
    </Container>
  );
};

export default ChatContainer;