import { Box, Container, Paper, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const AuthLayout = ({ title, onSubmit, children, linkText, linkTo, linkLabel }) => {
  return (
    <Box sx={{ 
      minHeight: "100vh", display: "flex", alignItems: "center", 
      bgcolor: "#343541", p: 2 
    }}>
      <Container maxWidth="xs">
        <Paper 
          elevation={4} 
          component="form" 
          onSubmit={onSubmit}
          sx={{ 
            p: 4, bgcolor: "#444654", color: "white", borderRadius: 4,
            display: "flex", flexDirection: "column", gap: 2 
          }}
        >
          <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
            {title}
          </Typography>

          {children}

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ 
              bgcolor: "#10a37f", py: 1.5, mt: 2, 
              "&:hover": { bgcolor: "#0e906e" } 
            }}
          >
            Submit
          </Button>

          <Typography variant="body2" textAlign="center" sx={{ color: "#c5c5d2", mt: 1 }}>
            {linkText}{" "}
            <Link to={linkTo} style={{ color: "#10a37f", textDecoration: "none" }}>
              {linkLabel}
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;