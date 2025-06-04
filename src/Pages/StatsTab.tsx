import { Box, Tab, Tabs } from "@mui/material";
import { endOfToday, startOfToday, subDays } from "date-fns";
import { differenceInDays, differenceInSeconds } from "date-fns/esm";
import React from "react";
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
      <Box style={{ display: "flex", justifyContent: "center" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
          sx={{
            ".MuiTabs-scrollButtons.Mui-disabled": {
              opacity: 0.3,
            },
          }}
        >
          <Tab label="Feeding" />
          <Tab label="Sleep" />
          <Tab label="Diapers" />
          <Tab label="Leisure" />
          <Tab label="Growth" />
        </Tabs>
      </Box>
      {value === 0 && <StatsFeeding />}
      {value === 1 && <StatsSleep />}
      {value === 2 && <StasDiapers />}
      {value === 3 && <StasLeisure />}
      {value === 4 && <StasGrowth />}
    </Box>
  );
};
