import { Box, TextField, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatInput = ({ prompt, setPrompt, onSubmit, loading }) => {
  return (
    <Box component="footer" sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "#212121" }}>
      <Box 
        component="form" 
        onSubmit={onSubmit}
        sx={{ 
          display: "flex", 
          alignItems: "flex-end", 
          gap: 1, 
          width: "100%",
          maxWidth: "800px", 
          bgcolor: "#2f2f2f",
          borderRadius: "26px",
          p: "6px 12px",
          position: "relative",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)"
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={8}
          placeholder="Message ChatGPT..."
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
        <IconButton 
          type="submit" 
          disabled={loading || !prompt.trim()} 
          sx={{ 
            color: prompt.trim() ? "white" : "rgba(255,255,255,0.3)",
            bgcolor: prompt.trim() ? "white" : "transparent",
            "& svg": { color: prompt.trim() ? "#2f2f2f" : "rgba(255,255,255,0.4)" },
            "&:hover": { bgcolor: prompt.trim() ? "#d4d4d4" : "transparent" },
            p: "8px",
            mb: "4px",
            borderRadius: "50%",
            transition: "all 0.2s ease"
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 1.5, color: "#9b9b9b", fontSize: "0.75rem" }}>
        ChatGPT can make mistakes. Consider verifying important information.
      </Typography>
    </Box>
  );
};

export default ChatInput;