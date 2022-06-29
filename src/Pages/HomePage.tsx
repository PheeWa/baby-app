import {
  CalendarMonthRounded,
  FavoriteRounded,
  HomeRounded,
  PersonRounded,
  PhoneRounded,
  SettingsRounded,
  TimelineRounded,
} from "@mui/icons-material";
import { Box, Tabs, Tab, Container, Avatar, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { HomeTab } from "./HomeTab";
import { StatsTab } from "./StatsTab";

export const HomePage = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 16,
          paddingBottom: 0,
        }}
      >
        <Box style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar alt="Remy Sharp" src="" />
          <Typography>Luka</Typography>
        </Box>
        <SettingsRounded
          onClick={() => {
            navigate("/setting");
          }}
        />
      </Box>
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
