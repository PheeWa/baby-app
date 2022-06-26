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
  startOfToday,
} from "date-fns";
import React from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  XAxis,
  Bar,
  Tooltip,
  Legend,
  YAxis,
  LineChart,
  Line,
} from "recharts";
import { RootState } from "../Store/store";
import { Feeding } from "./FeedPage";
import { getLineChartData } from "./StatsSleep";
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
  // const feedings = useSelector((state: RootState) => state.feed.feedings);
  const weeklyFeedings = useSelector((state: RootState) => {
    return state.feed.feedings.filter((feeding) => {
      const thisWeek = isWithinInterval(new Date(feeding.finish), {
        start: subDays(new Date(), 7),
        end: new Date(),
      });

      if (thisWeek) {
        return true;
      }
    });
  });

  //Statistics functions//

  const avgFeeding = (feedings: Feeding[]) => {
    let sumFeeding = 0;
    let numFeeding = 0;
    feedings.forEach((feeding) => {
      // const thisWeek = isWithinInterval(new Date(feeding.finish), {
      //   start: subDays(new Date(), 6),
      //   end: new Date(),
      // });

      // if (thisWeek) {
      const diff = differenceInSeconds(
        new Date(feeding.finish),
        new Date(feeding.start)
      );
      sumFeeding = sumFeeding + diff;
      numFeeding = numFeeding + 1;
    });
    // });
    const avgFeedingInSec = sumFeeding / (numFeeding || 1);
    const date = addSeconds(new Date(0), avgFeedingInSec);
    const x = addHours(date, 12);
    const avgFeedDuration = format(x, "m'm'");
    const avgFeedTimes = (numFeeding / 7).toFixed(1);
    return { avgFeedDuration, avgFeedTimes };
  };

  //Feeding duration by days//

  const leftBreast = weeklyFeedings.filter((feeding) => {
    if (feeding.type === "left breast") {
      return true;
    }
  });
  const rightBreast = weeklyFeedings.filter((feeding) => {
    if (feeding.type === "right breast") {
      return true;
    }
  });
  const bottle = weeklyFeedings.filter((feeding) => {
    if (feeding.type === "bottle") {
      return true;
    }
  });

  const x = getBarData(leftBreast);
  const y = getBarData(rightBreast);
  const z = getBarData(bottle);

  const feedingData = x.map((item, i) => {
    return {
      date: item.date,
      left: item.time,
      right: y[i].time,
      bottle: z[i].time,
    };
  });

  const getColor = (type: string): string => {
    if (type === "left breast") {
      return "#82ca9d";
    } else if (type === "right breast") {
      return "#8884d8";
    } else return "#f27a0d";
  };

  return (
    <Box>
      <List subheader={<ListSubheader>Statistics</ListSubheader>}>
        <ListItem>
          <ListItemText primary="Avg feeding per day" />
          <Typography
            variant="body1"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            {avgFeeding(weeklyFeedings).avgFeedTimes}
          </Typography>
        </ListItem>
        <ListItem>
          <ListItemText primary="Avg duration per feeding" />
          <Typography
            variant="body1"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            {avgFeeding(weeklyFeedings).avgFeedDuration}
          </Typography>
        </ListItem>
      </List>
      <Box>
        <Typography>Feeding duration by days</Typography>

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
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              return format(value, "EEE");
            }}
            fontSize="10px"
          />
          <YAxis fontSize="10px" tickFormatter={formatSeconds} />
          <Legend />
          <Tooltip
            labelFormatter={(value: any) => {
              return format(value, "LLL d yyyy");
            }}
            formatter={(value: any) => {
              return formatSeconds(value);
            }}
          />
          <Bar dataKey="left" stackId="a" fill="#82ca9d"></Bar>
          <Bar dataKey="right" stackId="a" fill="#8884d8"></Bar>
          <Bar dataKey="bottle" stackId="a" fill="#f27a0d"></Bar>
        </BarChart>

        <Typography>Feeding schedule</Typography>
        <LineChart width={350} height={600}>
          <XAxis
            dataKey="date"
            type="category"
            allowDuplicatedCategory={false}
            tickFormatter={(value) => {
              console.log(value);
              if (value === 0) {
                return "";
              }
              return format(new Date(value), "EEE");
            }}
          />
          <YAxis
            tickFormatter={(value) => {
              const date = addSeconds(startOfToday(), value);
              return format(date, "h a");
            }}
            tickCount={13}
            interval="preserveStartEnd"
            allowDataOverflow={false}
            domain={[0, 86400]}
          />
          <Legend
            payload={[
              { value: "left", type: "rect", id: "ID01", color: "#82ca9d" },
              { value: "right", type: "rect", id: "ID02", color: "#8884d8" },
              { value: "bottle", type: "rect", id: "ID03", color: "#f27a0d" },
            ]}
          />
          {getLineChartData(weeklyFeedings).map((s: any) => {
            return (
              <Line
                dataKey="time"
                data={s.data}
                name={s.name}
                key={s.name}
                dot={false}
                strokeWidth={7}
                stroke={getColor(s.type)}
              />
            );
          })}
        </LineChart>
      </Box>
    </Box>
  );
};
