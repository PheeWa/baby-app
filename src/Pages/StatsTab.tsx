import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import {
  addHours,
  addSeconds,
  format,
  isWithinInterval,
  subDays,
} from "date-fns";
import { differenceInSeconds } from "date-fns/esm";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LineChart, Line } from "recharts";
import { RootState } from "../Store/store";

export const StatsTab = () => {
  // From Redux//
  const sleeps = useSelector((state: RootState) => state.sleep.sleeps);

  //Statistics functions//

  const avgSleep = () => {
    let sumSleep = 0;
    sleeps.forEach((sleep) => {
      const thisWeek = isWithinInterval(new Date(sleep.finish), {
        start: subDays(new Date(), 6),
        end: new Date(),
      });

      if (thisWeek) {
        const diff = differenceInSeconds(
          new Date(sleep.finish),
          new Date(sleep.start)
        );
        sumSleep = sumSleep + diff;
      }
    });
    const avgSleepInSec = sumSleep / 7;
    const date = addSeconds(new Date(0), avgSleepInSec);
    const x = addHours(date, 12);
    return format(x, "H'h'mm'm'");
  };

  // const avg;

  return (
    <Box>
      <Container sx={{ marginTop: "16px", display: "flex", gap: "16px" }}>
        <Link to="/feed-stats" style={{ textDecorationLine: "none" }}>
          <Button variant="outlined" sx={{ textTransform: "none" }}>
            Feeding
          </Button>
        </Link>
        <Link to="" style={{ textDecorationLine: "none" }}>
          <Button variant="outlined" sx={{ textTransform: "none" }}>
            Diapers
          </Button>
        </Link>
        <Link to="" style={{ textDecorationLine: "none" }}>
          <Button variant="outlined" sx={{ textTransform: "none" }}>
            Leisure
          </Button>
        </Link>
        <Link to="" style={{ textDecorationLine: "none" }}>
          <Button variant="outlined" sx={{ textTransform: "none" }}>
            Growth
          </Button>
        </Link>
        <Link to="" style={{ textDecorationLine: "none" }}>
          <Button variant="outlined" sx={{ textTransform: "none" }}>
            All in one
          </Button>
        </Link>
      </Container>
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
            <ListItemText primary="Avg sleep per day" />
            <Typography
              variant="body1"
              component="div"
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              {avgSleep()}
            </Typography>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};
