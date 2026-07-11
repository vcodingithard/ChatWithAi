import { Box, TextField, IconButton, Typography, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

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

  return (
    <Box component="footer" sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "#212121" }}>
      <Box 
        component="form" 
        onSubmit={onSubmit}
        sx={{ 
          display: "flex", 
          flexDirection: "column",
          width: "100%",
          maxWidth: "800px", 
          bgcolor: "#2f2f2f",
          borderRadius: "24px",
          p: "8px 16px",
          position: "relative",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          border: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        {/* Tool Selector Chips */}
        {(selectedFile || toolMode === "text_tools") && (
          <Box sx={{ 
            display: "flex", 
            gap: 1.2, 
            flexWrap: "wrap", 
            mb: 1.5, 
            pb: 1,
            borderBottom: "1px solid rgba(255,255,255,0.06)" 
          }}>
            {/* Auto chip */}
            <Box 
              onClick={() => setSelectedTool("auto")}
              sx={{
                fontSize: "0.75rem",
                fontWeight: "500",
                bgcolor: selectedTool === "auto" ? "#10a37f" : "rgba(255,255,255,0.06)",
                color: selectedTool === "auto" ? "white" : "rgba(255,255,255,0.7)",
                px: 1.5,
                py: 0.5,
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.2s",
                border: "1px solid",
                borderColor: selectedTool === "auto" ? "#10a37f" : "transparent",
                "&:hover": {
                  bgcolor: selectedTool === "auto" ? "#10a37f" : "rgba(255,255,255,0.12)",
                  color: "white"
                }
              }}
            >
              🪄 Auto Classify
            </Box>

            {/* Summarize chip */}
            <Box 
              onClick={() => setSelectedTool("summarize")}
              sx={{
                fontSize: "0.75rem",
                fontWeight: "500",
                bgcolor: selectedTool === "summarize" ? "#10a37f" : "rgba(255,255,255,0.06)",
                color: selectedTool === "summarize" ? "white" : "rgba(255,255,255,0.7)",
                px: 1.5,
                py: 0.5,
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.2s",
                border: "1px solid",
                borderColor: selectedTool === "summarize" ? "#10a37f" : "transparent",
                "&:hover": {
                  bgcolor: selectedTool === "summarize" ? "#10a37f" : "rgba(255,255,255,0.12)",
                  color: "white"
                }
              }}
            >
              📝 Summarize
            </Box>

            {/* Explain chip */}
            <Box 
              onClick={() => setSelectedTool("explain")}
              sx={{
                fontSize: "0.75rem",
                fontWeight: "500",
                bgcolor: selectedTool === "explain" ? "#10a37f" : "rgba(255,255,255,0.06)",
                color: selectedTool === "explain" ? "white" : "rgba(255,255,255,0.7)",
                px: 1.5,
                py: 0.5,
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.2s",
                border: "1px solid",
                borderColor: selectedTool === "explain" ? "#10a37f" : "transparent",
                "&:hover": {
                  bgcolor: selectedTool === "explain" ? "#10a37f" : "rgba(255,255,255,0.12)",
                  color: "white"
                }
              }}
            >
              💡 Explain
            </Box>

            {/* Describe chip */}
            <Box 
              onClick={() => setSelectedTool("describe")}
              sx={{
                fontSize: "0.75rem",
                fontWeight: "500",
                bgcolor: selectedTool === "describe" ? "#10a37f" : "rgba(255,255,255,0.06)",
                color: selectedTool === "describe" ? "white" : "rgba(255,255,255,0.7)",
                px: 1.5,
                py: 0.5,
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.2s",
                border: "1px solid",
                borderColor: selectedTool === "describe" ? "#10a37f" : "transparent",
                "&:hover": {
                  bgcolor: selectedTool === "describe" ? "#10a37f" : "rgba(255,255,255,0.12)",
                  color: "white"
                }
              }}
            >
              🔍 Describe
            </Box>

            {/* Generate PDF chip */}
            <Box 
              onClick={() => setSelectedTool("generate_pdf")}
              sx={{
                fontSize: "0.75rem",
                fontWeight: "500",
                bgcolor: selectedTool === "generate_pdf" ? "#10a37f" : "rgba(255,255,255,0.06)",
                color: selectedTool === "generate_pdf" ? "white" : "rgba(255,255,255,0.7)",
                px: 1.5,
                py: 0.5,
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.2s",
                border: "1px solid",
                borderColor: selectedTool === "generate_pdf" ? "#10a37f" : "transparent",
                "&:hover": {
                  bgcolor: selectedTool === "generate_pdf" ? "#10a37f" : "rgba(255,255,255,0.12)",
                  color: "white"
                }
              }}
            >
              📄 Generate PDF
            </Box>

            {/* Generate Image chip (only show in text tools mode without image upload) */}
            {!selectedFile && toolMode === "text_tools" && (
              <Box 
                onClick={() => setSelectedTool("generate_image")}
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  bgcolor: selectedTool === "generate_image" ? "#10a37f" : "rgba(255,255,255,0.06)",
                  color: selectedTool === "generate_image" ? "white" : "rgba(255,255,255,0.7)",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "16px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: "1px solid",
                  borderColor: selectedTool === "generate_image" ? "#10a37f" : "transparent",
                  "&:hover": {
                    bgcolor: selectedTool === "generate_image" ? "#10a37f" : "rgba(255,255,255,0.12)",
                    color: "white"
                  }
                }}
              >
                🎨 Generate Image
              </Box>
            )}
          </Box>
        )}

        {/* Image Preview Area */}
        {filePreview && (
          <Box sx={{ 
            position: "relative", 
            display: "inline-block", 
            mt: 1, 
            mb: 1.5,
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.15)",
            width: "fit-content",
            alignSelf: "flex-start",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
          }}>
            <img src={filePreview} alt="Preview" style={{ height: "65px", display: "block", borderRadius: "12px" }} />
            <IconButton
              onClick={handleClearFile}
              size="small"
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                bgcolor: "rgba(0,0,0,0.75)",
                color: "white",
                "&:hover": { bgcolor: "rgba(0,0,0,0.95)" },
                p: "4px"
              }}
            >
              <CloseIcon sx={{ fontSize: "14px" }} />
            </IconButton>
          </Box>
        )}

        {/* Input Control Row */}
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1.5, width: "100%" }}>
          
          {/* File Input */}
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
            <Tooltip title="Upload Image (OCR + Captioning)" placement="top">
              <IconButton 
                component="span" 
                disabled={loading}
                sx={{ 
                  color: selectedFile ? "#10a37f" : "rgba(255,255,255,0.6)",
                  "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.08)" },
                  p: "8px",
                  mb: "4px"
                }}
              >
                <AttachFileIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </label>

          {/* Mode Switcher Button */}
          <Tooltip 
            title={selectedFile ? "Image Tools Mode Active" : toolMode === "text_tools" ? "Switch to ChatGPT Chat" : "Switch to Smart Text Tools"} 
            placement="top"
          >
            <IconButton 
              disabled={loading || !!selectedFile}
              onClick={() => setToolMode(prev => prev === "chat" ? "text_tools" : "chat")}
              sx={{ 
                color: selectedFile 
                  ? "rgba(16, 163, 127, 0.4)" 
                  : toolMode === "text_tools" 
                    ? "#10a37f" 
                    : "rgba(255,255,255,0.6)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                p: "8px",
                mb: "4px",
                transition: "all 0.2s"
              }}
            >
              {selectedFile ? (
                <AutoAwesomeIcon fontSize="small" />
              ) : toolMode === "text_tools" ? (
                <AutoAwesomeIcon fontSize="small" />
              ) : (
                <ChatIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* Text Area */}
          <TextField
            fullWidth
            multiline
            maxRows={8}
            placeholder={
              selectedFile 
                ? "Add instructions for the image analysis..." 
                : toolMode === "text_tools" 
                  ? "Ask Smart Text Tools (summarize, explain, describe, generate pdf, generate image)..." 
                  : "Message ChatGPT..."
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            variant="standard"
            sx={{
              py: 1,
              px: 1,
              color: "white",
              "& .MuiInputBase-root": {
                color: "white",
              },
            }}
            InputProps={{ disableUnderline: true }}
          />

          {/* Send Button */}
          <IconButton 
            type="submit" 
            disabled={loading || (!prompt.trim() && !selectedFile)} 
            sx={{ 
              color: (prompt.trim() || selectedFile) ? "white" : "rgba(255,255,255,0.3)",
              bgcolor: (prompt.trim() || selectedFile) ? "white" : "transparent",
              "& svg": { color: (prompt.trim() || selectedFile) ? "#2f2f2f" : "rgba(255,255,255,0.4)" },
              "&:hover": { bgcolor: (prompt.trim() || selectedFile) ? "#d4d4d4" : "transparent" },
              p: "8px",
              mb: "4px",
              borderRadius: "50%",
              transition: "all 0.2s ease"
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      
      {/* Dynamic Instruction/Status Line */}
      <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 1.5, color: "#9b9b9b", fontSize: "0.75rem" }}>
        {selectedFile 
          ? "✨ Image Mode active: Uploading to Cloudinary + OCR + AI tool analysis" 
          : toolMode === "text_tools" 
            ? "⚡ Smart Text Mode active: AI will classify and execute summarize, explain, describe, generate pdf, or generate image" 
            : "💬 Chat mode active: Standard ChatGPT conversation"}
      </Typography>
    </Box>
  );
};

export default ChatInput;