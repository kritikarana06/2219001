mport { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { resolveShortcode } from "../api";
import { Box, Typography, CircularProgress, Container } from "@mui/material";

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const url = resolveShortcode(shortcode, "redirect");
      setTimeout(() => {
        window.location.href = url;
      }, 1000); // show loading briefly
    } catch (err) {
      alert("Invalid or expired link");
      navigate("/");
    }
  }, [shortcode, navigate]);

  return (
    <Container maxWidth="sm">
      <Box py={8} textAlign="center">
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Redirecting...
        </Typography>
      </Box>
    </Container>
  );
};

export default RedirectHandler;