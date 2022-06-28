import { Box, Typography } from "@mui/material";
import {
  addDays,
  differenceInDays,
  format,
  formatDistanceStrict,
} from "date-fns/esm";
import React from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line,
  Tooltip,
} from "recharts";
import { RootState } from "../Store/store";

export const StasGrowth = () => {
  const babyBirthDate = "23-Feb-2022 11:04 AM";
  const growths = useSelector((state: RootState) => state.growth.growths);

  const babyWeights = growths.filter((growth) => {
    if (growth.type === "weight") {
      return true;
    }
  });

  const babyHeights = growths.filter((growth) => {
    if (growth.type === "height") {
      return true;
    }
  });

  const babyHeadCir = growths.filter((growth) => {
    if (growth.type === "head") {
      return true;
    }
  });

  const actualWeight = babyWeights.map((item) => {
    const days = differenceInDays(
      new Date(item.start),
      new Date(babyBirthDate)
    );
    return {
      day: days,
      Weight: item.value,
    };
  });

  const actualHeight = babyHeights.map((item) => {
    const days = differenceInDays(
      new Date(item.start),
      new Date(babyBirthDate)
    );
    return { day: days, Height: item.value };
  });

  const actualHeadCir = babyHeadCir.map((item) => {
    const days = differenceInDays(
      new Date(item.start),
      new Date(babyBirthDate)
    );
    return { day: days, Head: item.value };
  });

  const projectedWeight = [
    { day: 0, min: 2.355451, max: 4.446488 },
    { day: 15, min: 2.799549, max: 5.032625 },
    { day: 45, min: 3.614688, max: 6.121929 },
    { day: 75, min: 4.342341, max: 7.10625 },
    { day: 105, min: 4.992898, max: 7.993878 },
    { day: 135, min: 5.575169, max: 8.793444 },
    { day: 165, min: 6.096775, max: 9.513307 },
    { day: 195, min: 6.56443, max: 10.16135 },
    // { name: "7.5", min: 6.984123, max: 10.74492 },
    // { name: "8.5", min: 7.361236, max: 11.27084 },
    // { name: "9.5", min: 7.700624, max: 11.74538 },
    // { name: "10.5", min: 8.006677, max: 12.17436 },
    // { name: "11.5", min: 8.283365, max: 12.56308 },
    // { name: "12.5", min: 8.534275, max: 12.91645 },
  ];

  const projectedHeight = [
    { day: 0, min: 44.9251, max: 54.919 },
    { day: 15, min: 47.97812, max: 57.62984 },
    { day: 45, min: 52.19859, max: 61.62591 },
    { day: 75, min: 55.26322, max: 64.69241 },
    { day: 105, min: 57.73049, max: 67.2519 },
    { day: 135, min: 59.82569, max: 69.48354 },
    { day: 165, min: 61.66384, max: 71.48218 },
    { day: 195, min: 63.31224, max: 73.30488 },
    // { days: 7.5, min: 64.81395, max: 74.98899 },
    // { days: 8.5, min: 66.19833, max: 76.56047 },
    // { days: 9.5, min: 67.48635, max: 78.03819 },
    // { days: 10.5, min: 68.6936, max: 79.43637 },
    // { days: 11.5, min: 69.832, max: 80.76602 },
    // { days: 12.5, min: 70.91088, max: 82.03585 },
  ];

  const projectedHeadCir = [
    { day: 0, min: 31.48762, max: 38.85417 },
    { day: 15, min: 33.25006, max: 40.10028 },
    { day: 45, min: 35.78126, max: 41.94138 },
    { day: 75, min: 37.5588, max: 43.28181 },
    { day: 105, min: 38.89944, max: 44.32733 },
    { day: 135, min: 39.95673, max: 45.17877 },
    { day: 165, min: 40.81642, max: 45.893 },
    { day: 195, min: 41.53109, max: 46.50524 },
    // {day:7.5,min:42.13521,max:47.0388},
    // {day:8.5,min:42.65253,max:47.5099},
    // {day:9.5,min:43.10009,max:47.93027},
    // {day:10.5,min:43.49049,max:48.30867},
    // {day:11.5,min:43.83332,max:48.65181},
    // {day:12.5,min:44.136,max:48.96494},
  ];

  const getWeightData = [...projectedWeight, ...actualWeight];

  const getHeightData = [...projectedHeight, ...actualHeight];

  const getHeadCirData = [...projectedHeadCir, ...actualHeadCir];

  return (
    <Box>
      <Box>
        <Typography>Weight chart</Typography>
        <LineChart
          width={400}
          height={300}
          data={getWeightData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis
            type="number"
            dataKey="day"
            ticks={[30, 60, 90, 120, 150, 180, 210]}
            tickFormatter={(value) => {
              const day = addDays(new Date(), value);
              const months = formatDistanceStrict(day, new Date());
              return months.replace(" month", "m").replace("s", "");
            }}
          />
          <YAxis
            unit="kg"
            domain={["dataMin", "dataMax"]}
            tickCount={15}
            tickFormatter={(value) => {
              return value.toFixed(1);
            }}
          />
          <Tooltip
            labelFormatter={(value: any) => {
              const day = addDays(new Date(babyBirthDate), value);
              return format(day, "LLL d yyyy");
            }}
          />
          <Legend />
          <Line
            connectNulls
            type="monotone"
            dataKey="max"
            stroke="#82ca9d"
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            connectNulls
            type="monotone"
            dataKey="Weight"
            stroke="#8884d8"
          />
          <Line
            connectNulls
            type="monotone"
            dataKey="min"
            stroke="#82ca9d"
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </Box>
      <Box>
        <Typography>Height chart</Typography>
        <LineChart
          width={400}
          height={300}
          data={getHeightData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis
            type="number"
            dataKey="day"
            ticks={[30, 60, 90, 120, 150, 180, 210]}
            tickFormatter={(value) => {
              const day = addDays(new Date(), value);
              const months = formatDistanceStrict(day, new Date());
              return months.replace(" month", "m").replace("s", "");
            }}
          />
          <YAxis
            unit="cm"
            domain={["dataMin", "dataMax"]}
            tickCount={15}
            tickFormatter={(value) => {
              return value.toFixed(1);
            }}
          />
          <Tooltip
            labelFormatter={(value: any) => {
              const day = addDays(new Date(babyBirthDate), value);
              return format(day, "LLL d yyyy");
            }}
          />
          <Legend />
          <Line
            connectNulls
            type="monotone"
            dataKey="max"
            stroke="#82ca9d"
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            connectNulls
            type="monotone"
            dataKey="Height"
            stroke="#8884d8"
          />
          <Line
            connectNulls
            type="monotone"
            dataKey="min"
            stroke="#82ca9d"
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </Box>
      <Box>
        <Typography>Height chart</Typography>
        <LineChart
          width={400}
          height={300}
          data={getHeadCirData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis
            type="number"
            dataKey="day"
            ticks={[30, 60, 90, 120, 150, 180, 210]}
            tickFormatter={(value) => {
              const day = addDays(new Date(), value);
              const months = formatDistanceStrict(day, new Date());
              return months.replace(" month", "m").replace("s", "");
            }}
          />
          <YAxis
            unit="cm"
            domain={["dataMin", "dataMax"]}
            tickCount={15}
            tickFormatter={(value) => {
              return value.toFixed(1);
            }}
          />
          <Tooltip
            labelFormatter={(value: any) => {
              const day = addDays(new Date(babyBirthDate), value);
              return format(day, "LLL d yyyy");
            }}
          />
          <Legend />
          <Line
            connectNulls
            type="monotone"
            dataKey="max"
            stroke="#82ca9d"
            strokeDasharray="5 5"
            dot={false}
          />
          <Line connectNulls type="monotone" dataKey="Head" stroke="#8884d8" />
          <Line
            connectNulls
            type="monotone"
            dataKey="min"
            stroke="#82ca9d"
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </Box>
    </Box>
  );
};
