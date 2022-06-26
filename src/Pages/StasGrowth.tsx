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

  const actualWeight = babyWeights.map((item) => {
    const days = differenceInDays(
      new Date(item.start),
      new Date(babyBirthDate)
    );
    return {
      day: days,
      actualWeight: item.value,
    };
  });

  const data = [
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

  const getWeightData = [...data, ...actualWeight];
  console.log("hahahah", getWeightData);

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
          // formatter={(value: any) => {
          //   return format(value, "LLL d yyyy");
          // }}
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
            dataKey="actualWeight"
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
    </Box>
  );
};
