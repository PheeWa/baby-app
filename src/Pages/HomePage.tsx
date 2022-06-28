import {
  CalendarMonthRounded,
  FavoriteRounded,
  HomeRounded,
  PersonRounded,
  PhoneRounded,
  TimelineRounded,
} from "@mui/icons-material";
import { Box, Tabs, Tab, Container } from "@mui/material";
import React from "react";
import { HomeTab } from "./HomeTab";
import { StatsTab } from "./StatsTab";

export const HomePage = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          variant="fullWidth"
        >
          <Tab icon={<HomeRounded />} aria-label="phone" />
          <Tab icon={<TimelineRounded />} aria-label="favorite" />
          {/* <Tab icon={<CalendarMonthRounded />} aria-label="person" /> */}
        </Tabs>
      </Box>
      {value === 0 && <HomeTab />}
      {value === 1 && <StatsTab />}
      {/* {value === 2 && <Box>Item Three</Box>} */}
    </Box>
  );
};
