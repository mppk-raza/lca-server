import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

const DashboardStats = ({ title, icon, data, loading }) => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {!loading ? (
                data
              ) : (
                <Skeleton
                  variant="rounded"
                  width={40}
                  height={58}
                />
              )}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "#00a0ad",
                height: 50,
                width: 50,
              }}
            >
              {icon}
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DashboardStats;
