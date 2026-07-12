import { Box, TextField, IconButton, Typography, Tooltip, Chip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";

const ChatInput = ({ 
  prompt, 
  setPrompt, 
  onSubmit, 
  loading,
  selectedFile,
  setSelectedFile,
  filePreview,
  setFilePreview,
  toolMode,
  setToolMode,
  selectedTool,
  setSelectedTool
}) => {

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview("");
    }
  };

  const toolOptions = [
    { id: "auto", label: "Auto Classify", emoji: "🪄" },
    { id: "summarize", label: "Summarize", emoji: "📝" },
    { id: "explain", label: "Explain", emoji: "💡" },
    { id: "describe", label: "Describe", emoji: "🔍" },
    { id: "generate_pdf", label: "Generate PDF", emoji: "📄" },
    ...(!selectedFile && toolMode === "text_tools" ? [{ id: "generate_image", label: "Generate Image", emoji: "🎨" }] : [])
  ];

  return (
    <Box component="footer" sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "#090d16", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <Box 
        component="form" 
        onSubmit={onSubmit}
        sx={{ 
          display: "flex", 
          flexDirection: "column",
          width: "100%",
          maxWidth: "800px", 
          bgcolor: "rgba(17, 24, 39, 0.6)",
          backdropFilter: "blur(12px)",
          borderRadius: "18px",
          p: "12px 18px",
          position: "relative",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.06)"
        }}
      >
        {/* Workspace Mode Tabs */}
        {!selectedFile && (
          <Box sx={{ display: "flex", gap: 1, mb: 1.5, pb: 1, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <Box 
              onClick={() => setToolMode("chat")}
              sx={{
                fontSize: "0.78rem",
                fontWeight: "600",
                color: toolMode === "chat" ? "white" : "rgba(255,255,255,0.4)",
                px: 2,
                py: 0.75,
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
                bgcolor: toolMode === "chat" ? "rgba(255,255,255,0.05)" : "transparent",
                border: "1px solid",
                borderColor: toolMode === "chat" ? "rgba(255,255,255,0.08)" : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <ChatIcon sx={{ fontSize: 13, color: toolMode === "chat" ? "#34d399" : "inherit" }} />
              Assistant Chat
            </Box>
            <Box 
              onClick={() => setToolMode("text_tools")}
              sx={{
                fontSize: "0.78rem",
                fontWeight: "600",
                color: toolMode === "text_tools" ? "white" : "rgba(255,255,255,0.4)",
                px: 2,
                py: 0.75,
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
                bgcolor: toolMode === "text_tools" ? "rgba(99, 102, 241, 0.15)" : "transparent",
                border: "1px solid",
                borderColor: toolMode === "text_tools" ? "rgba(99, 102, 241, 0.25)" : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 13, color: toolMode === "text_tools" ? "#a855f7" : "inherit" }} />
              Text Intel Studio
            </Box>
          </Box>
        )}

        {/* Selected File Indicator Bar */}
        {selectedFile && (
          <Box sx={{ display: "flex", gap: 1, mb: 1.5, pb: 1, borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "center" }}>
            <Box sx={{
              fontSize: "0.78rem",
              fontWeight: "700",
              color: "white",
              px: 2,
              py: 0.75,
              borderRadius: "8px",
              bgcolor: "rgba(129, 140, 248, 0.15)",
              border: "1px solid rgba(129, 140, 248, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: 1
            }}>
              <AutoAwesomeIcon sx={{ fontSize: 13, color: "#818cf8" }} />
              Image Pipeline Active
            </Box>
          </Box>
        )}

        {/* Tool Selector Chips */}
        {(selectedFile || toolMode === "text_tools") && (
          <Box sx={{ 
            display: "flex", 
            gap: 1, 
            flexWrap: "wrap", 
            mb: 1.5, 
            pb: 1.2,
            borderBottom: "1px solid rgba(255,255,255,0.05)" 
          }}>
            {toolOptions.map((opt) => {
              const isSel = selectedTool === opt.id;
              return (
                <Box 
                  key={opt.id}
                  onClick={() => setSelectedTool(opt.id)}
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: "600",
                    bgcolor: isSel ? "#4f46e5" : "rgba(255,255,255,0.03)",
                    color: isSel ? "white" : "rgba(255,255,255,0.55)",
                    px: 1.6,
                    py: 0.6,
                    borderRadius: "20px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: "1px solid",
                    borderColor: isSel ? "#6366f1" : "rgba(255,255,255,0.05)",
                    "&:hover": {
                      bgcolor: isSel ? "#4f46e5" : "rgba(255,255,255,0.08)",
                      color: "white"
                    }
                  }}
                >
                  {opt.emoji} {opt.label}
                </Box>
              );
            })}
          </Box>
        )}

        {/* Image Preview Block */}
        {filePreview && (
          <Box sx={{ 
            position: "relative", 
            display: "flex", 
            alignItems: "center",
            gap: 2,
            mt: 0.5, 
            mb: 2,
            p: 1,
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.05)",
            bgcolor: "rgba(0,0,0,0.25)",
            width: "fit-content",
            alignSelf: "flex-start",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)"
          }}>
            <img src={filePreview} alt="Preview" style={{ height: "46px", display: "block", borderRadius: "8px", objectFit: "cover" }} />
            <Box sx={{ pr: 4 }}>
              <Typography variant="body2" sx={{ color: "white", fontSize: "0.78rem", fontWeight: "600", noWrap: true, maxWidth: "160px" }}>
                {selectedFile?.name || "Uploaded Attachment"}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.68rem" }}>
                {(selectedFile?.size / 1024).toFixed(1)} KB
              </Typography>
            </Box>
            <IconButton
              onClick={handleClearFile}
              size="small"
              sx={{
                position: "absolute",
                top: "50%",
                right: 8,
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.6)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.12)", color: "white" },
                p: "4px"
              }}
            >
              <CloseIcon sx={{ fontSize: "12px" }} />
            </IconButton>
          </Box>
        )}

        {/* Input Control Row */}
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1.5, width: "100%" }}>
          
          <input
            type="file"
            accept="image/*"
            id="chat-file-input"
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={loading}
          />
          
          {/* Attach Button */}
          <label htmlFor="chat-file-input" style={{ display: "flex" }}>
            <Tooltip title="Attach Asset (OCR + Capture)" placement="top">
              <IconButton 
                component="span" 
                disabled={loading}
                sx={{ 
                  color: selectedFile ? "#818cf8" : "rgba(255,255,255,0.45)",
                  "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.05)" },
                  p: "10px",
                  mb: "2px"
                }}
              >
                <AttachFileIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </label>

          {/* Text Area */}
          <TextField
            fullWidth
            multiline
            maxRows={8}
            placeholder={
              selectedFile 
                ? "Instruct the image compiler (describe, explain, summarize, pdf)..." 
                : toolMode === "text_tools" 
                  ? "Enter instructions for Smart Text Studio..." 
                  : "Message AI Assistant..."
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            variant="standard"
            sx={{
              py: 0.75,
              px: 0.5,
              color: "white",
              "& .MuiInputBase-root": {
                color: "white",
                fontSize: "0.92rem",
                lineHeight: 1.5
              },
            }}
            InputProps={{ disableUnderline: true }}
          />

          {/* Send Button */}
          <IconButton 
            type="submit" 
            disabled={loading || (!prompt.trim() && !selectedFile)} 
            sx={{ 
              color: "white",
              bgcolor: (prompt.trim() || selectedFile) ? "#4f46e5" : "rgba(255,255,255,0.02)",
              "& svg": { 
                color: (prompt.trim() || selectedFile) ? "white" : "rgba(255,255,255,0.2)",
                fontSize: "16px"
              },
              "&:hover": { 
                bgcolor: (prompt.trim() || selectedFile) ? "#4338ca" : "rgba(255,255,255,0.02)" 
              },
              p: "10px",
              mb: "2px",
              borderRadius: "12px",
              transition: "all 0.2s ease"
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* Dynamic Instruction/Status Line */}
      <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 1.5, color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", letterSpacing: "0.2px" }}>
        {selectedFile 
          ? "✨ Pipeline Activated: Image uploaded to Cloudinary ➜ runs Tesseract OCR ➜ executes classification model" 
          : toolMode === "text_tools" 
            ? "⚡ Text Studio Mode Active: Select a compile processor to classify and run instructions" 
            : "💬 Chat Mode Active: Conversational workspace with fallback model streams"}
      </Typography>
    </Box>
  );
};

export default ChatInput;