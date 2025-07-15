import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  Divider,
} from "@mui/material";
import { shortenUrl } from "../api";
import { logRequest } from "../middleware/logging";

const ShortenerPage = () => {
  const [inputs, setInputs] = useState([
    { longUrl: "", validity: "", shortcode: "" },
  ]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const handleAdd = () => {
    if (inputs.length < 5)
      setInputs([...inputs, { longUrl: "", validity: "", shortcode: "" }]);
  };

  const handleShorten = () => {
    setError("");
    const newResults = [];

    try {
      inputs.forEach((item) => {
        if (!item.longUrl) throw new Error("URL required");

        const res = shortenUrl({
          longUrl: item.longUrl,
          validity: parseInt(item.validity || 30),
          shortcode: item.shortcode || undefined,
        });

        logRequest({
          action: "shorten",
          url: item.longUrl,
          shortcode: res.shortcode,
        });

        newResults.push({
          original: item.longUrl,
          shortcode: res.shortcode,
          expiry: res.expiry,
        });
      });

      setResults(newResults);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" gutterBottom align="center">
           URL Shortener
        </Typography>

        {inputs.map((input, index) => (
          <Card key={index} variant="outlined" sx={{ my: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Long URL"
                    fullWidth
                    variant="outlined"
                    value={input.longUrl}
                    onChange={(e) => handleChange(index, "longUrl", e.target.value)}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="Validity (min)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={input.validity}
                    onChange={(e) => handleChange(index, "validity", e.target.value)}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="Custom Shortcode"
                    fullWidth
                    variant="outlined"
                    value={input.shortcode}
                    onChange={(e) => handleChange(index, "shortcode", e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}

        <Box textAlign="center" my={2}>
          <Button variant="outlined" onClick={handleAdd} disabled={inputs.length >= 5}>
            + Add Another
          </Button>
          <Button
            variant="contained"
            onClick={handleShorten}
            sx={{ ml: 2 }}
            color="primary"
          >
            Shorten URLs
          </Button>
        </Box>

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        {results.length > 0 && (
          <>
            <Typography variant="h5" gutterBottom>
              Shortened URLs:
            </Typography>
            {results.map((r, i) => (
              <Card key={i} sx={{ my: 1, p: 2 }}>
                <Typography>
                  <strong>Original:</strong> {r.original}
                </Typography>
                <Typography>
                  <strong>Short:</strong>{" "}
                  <a href={/${r.shortcode}}>
                    {window.location.origin}/{r.shortcode}
                  </a>
                </Typography>
                <Typography>
                  <strong>Expires:</strong> {new Date(r.expiry).toLocaleString()}
                </Typography>
              </Card>
            ))}
          </>
        )}
      </Box>
    </Container>
  );
};

export default ShortenerPage;