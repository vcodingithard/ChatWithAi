import { Box, TextField, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatInput = ({ prompt, setPrompt, onSubmit, loading }) => {
  return (
    <Box component="footer" sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      <Box 
        component="form" 
        onSubmit={onSubmit}
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1, 
          maxWidth: "800px", 
          mx: "auto" 
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Ask anything"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              color: "white"
            }
          }}
        />
        <IconButton type="submit" disabled={loading || !prompt.trim()} color="primary" sx={{ p: "10px" }}>
          <SendIcon />
        </IconButton>
      </Box>
      <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 1, opacity: 0.5 }}>
        Doggpt can make mistakes and is not 100% right.
      </Typography>
    </Box>
  );
};

export default ChatInput;