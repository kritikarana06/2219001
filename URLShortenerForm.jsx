import React, { useState } from "react";
import { TextField, Button, Typography, Box, Grid } from "@mui/material";
import { logEvent } from "../logger/middleware";
import { shortenUrl } from "../api";

const URLShortenerForm = () => {
  const [urls, setUrls] = useState([{ longUrl: "", validity: "", shortcode: "" }]);
  const [results, setResults] = useState([]);
  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const addRow = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: "", validity: "", shortcode: "" }]);
    }
  };

  const handleSubmit = () => {
    const validEntries = urls.filter(u => u.longUrl);
    const output = [];
    for (const entry of validEntries) {
      try {
        logEvent("SHORTEN_URL", entry);
        const res = shortenUrl({
          longUrl: entry.longUrl,
          validity: parseInt(entry.validity) || 30,
          shortcode: entry.shortcode,
        });
        output.push({
          original: entry.longUrl,
          shortUrl: `http://localhost:3000/${res.shortcode}`,
          expiry: Math.round((res.expiry - Date.now()) / (60 * 1000))
        });
      } catch (e) {
        alert(e.message);
      }
    }
    setResults(output);
  };

  return (
    <Box p={4}>
      <Typography variant="h4">URL Shortener</Typography>
      {urls.map((url, i) => (
        <Grid container spacing={2} key={i} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField label="Long URL" fullWidth value={url.longUrl} onChange={(e) => handleChange(i, "longUrl", e.target.value)} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Validity (mins)" type="number" fullWidth value={url.validity} onChange={(e) => handleChange(i, "validity", e.target.value)} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Custom Shortcode" fullWidth value={url.shortcode} onChange={(e) => handleChange(i, "shortcode", e.target.value)} />
          </Grid>
        </Grid>
      ))}
      <Box mt={2}>
        <Button variant="outlined" onClick={addRow} disabled={urls.length >= 5}>Add Another</Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ ml: 2 }}>Shorten</Button>
      </Box>
      <Box mt={4}>
        {results.map((res, i) => (
          <Typography key={i}>{res.original} → <a href={res.shortUrl}>{res.shortUrl}</a> (Expires in: {res.expiry} mins)</Typography>
        ))}
      </Box>
    </Box>
  );
};

export default URLShortenerForm;
