import React from "react";
import {
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { getStats } from "../api";

const StatsPage = () => {
  const stats = getStats();

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" align="center" gutterBottom>
          📈 URL Statistics
        </Typography>

        {stats.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No statistics available.
          </Typography>
        ) : (
          stats.map((item, idx) => (
            <Card key={idx} sx={{ my: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🔗 {window.location.origin}/{item.shortcode}
                </Typography>
                <Typography><strong>Original URL:</strong> {item.longUrl}</Typography>
                <Typography><strong>Expires:</strong> {item.expiry}</Typography>
                <Typography><strong>Total Clicks:</strong> {item.clicks}</Typography>

                {item.details.length > 0 && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      Click Details:
                    </Typography>
                    <List dense>
                      {item.details.map((click, i) => (
                        <ListItem key={i}>
                          <ListItemText
                            primary={⏰ ${click.timestamp}}
                            secondary={📍 Location: ${click.location} | 🌐 Source: ${click.source}}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
};

export default StatsPage;