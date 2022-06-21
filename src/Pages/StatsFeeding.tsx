import {
  Box,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  isWithinInterval,
  subDays,
  differenceInSeconds,
  addSeconds,
  addHours,
  format,
} from "date-fns";
import React from "react";
import { useSelector } from "react-redux";
import { BarChart, XAxis, Bar, Tooltip, Legend, YAxis } from "recharts";
import { RootState } from "../Store/store";
import { getBarData } from "./StatsTab";

export const formatSeconds = (seconds: number) => {
  const date = addSeconds(new Date(0), seconds);
  const x = addHours(date, 12);
  if (seconds < 60) {
    return format(x, "s's'");
  }
  if (seconds < 3600) {
    return format(x, "mm'm'");
  }
  return format(x, "H'h'mm'm'");
};
export const StatsFeeding = () => {
  // From Redux//
  const feedings = useSelector((state: RootState) => state.feed.feedings);

  //Statistics functions//

  const avgFeeding = () => {
    let sumFeeding = 0;
    let numFeeding = 0;
    feedings.forEach((feeding) => {
      const thisWeek = isWithinInterval(new Date(feeding.finish), {
        start: subDays(new Date(), 6),
        end: new Date(),
      });

      if (thisWeek) {
        const diff = differenceInSeconds(
          new Date(feeding.finish),
          new Date(feeding.start)
        );
        sumFeeding = sumFeeding + diff;
        numFeeding = numFeeding + 1;
      }
    });
    const avgFeedingInSec = sumFeeding / (numFeeding || 1);
    const date = addSeconds(new Date(0), avgFeedingInSec);
    const x = addHours(date, 12);
    const avgFeedDuration = format(x, "m'm'");
    const avgFeedTimes = (numFeeding / 7).toFixed(1);
    return { avgFeedDuration, avgFeedTimes };
  };

  //Feeding duration by days//

  const leftBreast = feedings.filter((feeding) => {
    if (feeding.type === "left breast") {
      return true;
    }
  });
  const rightBreast = feedings.filter((feeding) => {
    if (feeding.type === "right breast") {
      return true;
    }
  });
  const bottle = feedings.filter((feeding) => {
    if (feeding.type === "bottle") {
      return true;
    }
  });

  const x = getBarData(leftBreast);
  const y = getBarData(rightBreast);
  const z = getBarData(bottle);

  //   const feedingData = [...x, ...y, ...z];
  //   console.log("first", feedingData);

  const feedingData = x.map((item, i) => {
    return {
      date: item.date,
      left: item.time,
      right: y[i].time,
      bottle: z[i].time,
    };
  });

  return (
    <Box>
      <List
        subheader={
          <ListSubheader
          // component="div" id="nested-list-subheader"
          >
            Statistics
          </ListSubheader>
        }
      >
        <ListItem>
          <ListItemText primary="Avg feeding per day" />
          <Typography
            variant="body1"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            {avgFeeding().avgFeedTimes}
          </Typography>
        </ListItem>
        <ListItem>
          <ListItemText primary="Avg duration per feeding" />
          <Typography
            variant="body1"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            {/* {avgSleepTime()} */}
            {avgFeeding().avgFeedDuration}
          </Typography>
        </ListItem>
      </List>
      <Box>
        <Typography>Sleep duration by days</Typography>

        {/* <ResponsiveContainer width="100%" height="100%"> */}
        <BarChart
          width={400}
          height={300}
          data={feedingData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              return format(value, "EEE");
            }}
            fontSize="10px"
          />
          <YAxis fontSize="10px" tickFormatter={formatSeconds} />
          <Legend fontSize="10px" />
          <Tooltip
            labelFormatter={(value: any) => {
              return format(value, "LLL d yyyy");
            }}
            formatter={(value: any) => {
              return formatSeconds(value);
            }}
          />
          <Bar dataKey="left" stackId="a" fill="#82ca9d">
            {/* <LabelList
              position={"top"}
              formatter={(value: any) => {
                const date = addSeconds(new Date(0), value);
                const x = addHours(date, 12);
                return format(x, "H'h'mm'm'");
              }}
            /> */}
          </Bar>
          <Bar dataKey="right" stackId="a" fill="#8884d8">
            {/* <LabelList
              position={"top"}
              formatter={(value: any) => {
                const date = addSeconds(new Date(0), value);
                const x = addHours(date, 12);
                return format(x, "H'h'mm'm'");
              }}
            /> */}
          </Bar>
          <Bar dataKey="bottle" stackId="a" fill="#f27a0d">
            {/* <LabelList
              position={"top"}
              formatter={(value: any) => {
                const date = addSeconds(new Date(0), value);
                const x = addHours(date, 12);
                return format(x, "H'h'mm'm'");
              }}
            /> */}
          </Bar>
        </BarChart>
        {/* </ResponsiveContainer> */}
      </Box>
    </Box>
  );
};
