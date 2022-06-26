import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import {
  addHours,
  addSeconds,
  endOfToday,
  format,
  isToday,
  isWithinInterval,
  startOfDay,
  startOfToday,
  subDays,
} from "date-fns";
import { differenceInDays, differenceInSeconds } from "date-fns/esm";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
  LabelList,
} from "recharts";
import { RootState } from "../Store/store";
import { Feeding } from "./FeedPage";
import { Leisure } from "./LeisurePage";
import { Sleep } from "./SleepPage";
import { StasDiapers } from "./StasDiapers";
import { StasGrowth } from "./StasGrowth";
import { StasLeisure } from "./StasLeisure";
import { StatsFeeding } from "./StatsFeeding";
import { StatsSleep } from "./StatsSleep";

export const calcDay = (
  item: Sleep | Feeding | Leisure,
  daysAgo: number
): { currentDay: number; previousDay: number } => {
  let diff = 0;
  let prev = 0;
  if (differenceInDays(endOfToday(), new Date(item.start)) === daysAgo) {
    diff = differenceInSeconds(new Date(item.finish), new Date(item.start));
  } else {
    diff = differenceInSeconds(
      new Date(item.finish),
      subDays(startOfToday(), daysAgo)
    );
    prev = differenceInSeconds(
      subDays(startOfToday(), daysAgo),
      new Date(item.start)
    );
  }
  return {
    currentDay: diff,
    previousDay: prev,
  };
};

export const getBarData = (events: Sleep[] | Feeding[] | Leisure[]) => {
  let result = [0, 0, 0, 0, 0, 0, 0];
  events.forEach((event) => {
    const daysDiff = differenceInDays(endOfToday(), new Date(event.finish));
    if (daysDiff < 7) {
      const { currentDay, previousDay } = calcDay(event, daysDiff);
      result[daysDiff] = result[daysDiff] + currentDay;
      if (daysDiff < 6) {
        result[daysDiff + 1] = result[daysDiff + 1] + previousDay;
      }
    }
  });

  return result
    .map((item, i) => {
      return {
        time: item,
        date: subDays(endOfToday(), i),
      };
    })
    .reverse();
};
export const StatsTab = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        // scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs example"
        sx={{
          ".MuiTabs-scrollButtons.Mui-disabled": {
            opacity: 0.3,
          },
        }}
      >
        <Tab label="Sleep" />
        <Tab label="Feeding" />
        <Tab label="Diapers" />
        <Tab label="Leisure" />
        <Tab label="Growth" />
      </Tabs>
      {value === 0 && <StatsSleep />}
      {value === 1 && <StatsFeeding />}
      {value === 2 && <StasDiapers />}
      {value === 3 && <StasLeisure />}
      {value === 4 && <StasGrowth />}
    </Box>
  );
};
