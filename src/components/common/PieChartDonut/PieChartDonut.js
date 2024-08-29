import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import PhoneIcon from "@mui/icons-material/Phone";
import TabletIcon from "@mui/icons-material/Tablet";

const PieChartDonut = ({ title, data, loading }) => {
  const theme = useTheme();
  const piedata = {
    datasets: [
      {
        data: data?.map((obj) => obj.count),
        backgroundColor: ["#b6e9d1", "#00a0ad", "#41424C"],
        borderWidth: 8,
        borderColor: "#FFFFFF",
        hoverBorderColor: "#FFFFFF",
      },
    ],
    labels: data?.map((obj) => obj._id),
  };

  const options = {
    animation: true,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    plugins: {
      legend: {
        position: "bottom",
        display: true,
      },
    },
    legend: {
      display: true,
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };
  // if (!data) {
  //   return;
  // }
  // const devices = data?.map(obj => ({
  //     title: obj._id,
  //     value: obj.count,
  //     icon: LaptopMacIcon,
  //     color: '#b6e9d1',
  // }));

  return (
    <Card sx={{ textAlign: "center" }}>
      <CardHeader title={title} />
      <Divider />
      {!loading ? (
        <CardContent>
          <Box
            sx={{
              height: 300,
              position: "relative",
            }}
          >
            <Doughnut data={piedata} options={options} />
          </Box>

          {/* <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pt: 2
            }}
          >
            {devices.map(({
              color,
              icon: Icon,
              title,
              value
            }) => (
              <Box
                key={title}
                sx={{
                  p: 1,
                  textAlign: 'center'
                }}
              >
                <Icon color="action" />
                <Typography
                  color="textPrimary"
                  variant="body1"
                >
                  {title}
                </Typography>
                <Typography
                  style={{ color }}
                  variant="h4"
                >
                  {value}
                  %
                </Typography>
              </Box>
            ))}
          </Box> */}
        </CardContent>
      ) : (
        <Skeleton
          sx={{ margin: "20px auto" }}
          variant="circular"
          width={260}
          height={260}
        />
      )}
    </Card>
  );
};

export default PieChartDonut;
