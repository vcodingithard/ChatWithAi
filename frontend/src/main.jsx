import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App.jsx";
import "./index.css";

// 1. Define the recruiter-grade Dark Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { 
      main: "#10a37f", // ChatGPT Green
      contrastText: "#ffffff" 
    },
    background: { 
      default: "#343541", // Main chat area
      paper: "#444654"    // Sidebar/Modals
    },
    text: { 
      primary: "#ffffff", 
      secondary: "#c5c5d2" 
    },
  },
  shape: { 
    borderRadius: 8 
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
  },
  components: {
    MuiTextField: {
      defaultProps: { 
        variant: "outlined", 
        fullWidth: true, 
        margin: "normal" 
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: "#2e2f3a", // Slightly darker for depth
            transition: "all 0.2s ease-in-out",
            '&:hover fieldset': { borderColor: "#10a37f" },
            '&.Mui-focused fieldset': { borderWidth: '1px' }
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // More modern, less "default Material"
          fontWeight: 600,
        }
      }
    }
  },
});

// 2. Render with Global Providers
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      {/* CssBaseline kicks in the dark background color globally */}
      <CssBaseline /> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);