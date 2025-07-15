import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getStats } from "../api";

const StatisticsPage = () => {
  const stats = getStats();
  return (
    <Box p={4}>
      <Typography variant="h4">URL Statistics</Typography>
      {stats.map((stat, i) => (
        <Box mt={3} key={i}>
          <Typography variant="h6">http://localhost:3000/{stat.shortcode}</Typography>
          <Typography>Original: {stat.longUrl}</Typography>
          <Typography>Expires: {stat.expiry}</Typography>
          <Typography>Total Clicks: {stat.clicks}</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stat.details.map((d, j) => (
                <TableRow key={j}>
                  <TableCell>{d.timestamp}</TableCell>
                  <TableCell>{d.source}</TableCell>
                  <TableCell>{d.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ))}
    </Box>
  );
};

export default StatisticsPage;