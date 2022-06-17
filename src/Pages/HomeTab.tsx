import {
  ArrowForwardIosRounded,
  ArrowForwardRounded,
  BabyChangingStationRounded,
  CribRounded,
  LastPageSharp,
  LocalCafeRounded,
  LocalHospitalRounded,
  MonitorWeightRounded,
  MoreVertRounded,
  PhotoCameraRounded,
  SportsBasketballRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import {
  addHours,
  addSeconds,
  differenceInSeconds,
  format,
  isToday,
} from "date-fns";
import { startOfToday } from "date-fns/esm";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { text } from "stream/consumers";
import { updateNonNullChain } from "typescript";
import { getText } from "../Components/BabyPhoto";
import { getLabel, getUnit } from "../Components/GrowthDialog";
import { InProgress } from "../Components/InProgress";
import { LatestActivity } from "../Components/LatestActivity";
import { getLeisureText } from "../Components/LeisureStopWatch";
import { SleepStopWatch } from "../Components/SleepStopWatch";
import { formatTime, getFeedText } from "../Components/StopWatch";
import { SummaryToday } from "../Components/SummaryToday";
import { RootState } from "../Store/store";
import { Diaper } from "./DiapersPage";
import { Feeding, formatDuration } from "./FeedPage";
import { Growth } from "./GrowthPage";
import { Health } from "./HealthPage";
import { Leisure } from "./LeisurePage";
import { Sleep } from "./SleepPage";

export const HomeTab = () => {
  const navigate = useNavigate();
  const stopwatch = useSelector((state: RootState) => state.feed.stopwatch);
  const feedings = useSelector((state: RootState) => state.feed.feedings);
  const sleepStopwatch = useSelector(
    (state: RootState) => state.sleep.sleepStopwatch
  );
  const sleeps = useSelector((state: RootState) => state.sleep.sleeps);
  const leisureStopwatch = useSelector(
    (state: RootState) => state.leisure.stopwatch
  );
  const leisures = useSelector((state: RootState) => state.leisure.leisures);
  const diapers = useSelector((state: RootState) => state.diaper.diapers);
  const healths = useSelector((state: RootState) => state.health.healths);
  const growths = useSelector((state: RootState) => state.growth.growths);

  const dispatch = useDispatch();

  const latestFeeding = feedings[feedings.length - 1] as Feeding | undefined;
  const latestSleep = [...sleeps].sort((a, b) => {
    if (+new Date(a.finish) < +new Date(b.finish)) {
      return 1;
    } else {
      return -1;
    }
  })[0];
  const latestLeisure = leisures[leisures.length - 1] as Leisure | undefined;
  const latestDiaper = diapers[diapers.length - 1] as Diaper | undefined;
  const latestHealth = healths[healths.length - 1] as Health | undefined;
  const latestGrowth = growths[growths.length - 1] as Growth | undefined;

  // TODO: fix , at the end, when there is no details

  //For Latest activity//
  const getFeedingText = () => {
    if (!latestFeeding) {
      return "";
    }
    const text = `${format(
      new Date(latestFeeding.start),
      "p"
    )}, ${formatDuration(latestFeeding.start, latestFeeding.finish)}, ${
      latestFeeding.type
    }, ${latestFeeding.details}`;
    return text;
  };

  const getSleepText = () => {
    if (!latestSleep) {
      return "";
    }
    // return latestSleep.id + "";
    const text = `${format(new Date(latestSleep.start), "p")}, ${formatDuration(
      latestSleep.start,
      latestSleep.finish
    )},sleep,${latestSleep.details}
    `;
    return text;
  };

  const getLeisureText = () => {
    if (!latestLeisure) {
      return "";
    }
    const text = `${format(
      new Date(latestLeisure.start),
      "p"
    )}, ${formatDuration(latestLeisure.start, latestLeisure.finish)}, ${
      latestLeisure.type
    }, ${latestLeisure.details}`;
    return text;
  };

  const getDiaperText = () => {
    if (!latestDiaper) {
      return "";
    }
    const text = `${format(new Date(latestDiaper.start), "p")},${
      latestDiaper.type
    },${latestDiaper.details}`;
    return text;
  };

  const getHealthText = () => {
    if (!latestHealth) {
      return "";
    }
    const showValue = () => {
      if (latestHealth.value) {
        return `${latestHealth.value} °C`;
      } else {
        return "";
      }
    };
    const text = `${format(new Date(latestHealth.start), "p")}, ${
      latestHealth.type
    } ${showValue()},${latestHealth.details}`;

    return text;
  };

  const getGrowthText = () => {
    if (!latestGrowth) {
      return "";
    }
    const text = `${format(new Date(latestGrowth.start), "p")}, ${getLabel(
      latestGrowth.type
    )}, ${latestGrowth.value}${getUnit(latestGrowth.type)}`;
    return text;
  };
  //For Summary for today//
  const sumFeedings = feedings.filter((feeding) => {
    const finishDate = new Date(feeding.finish);
    if (isToday(finishDate)) {
      return feeding;
    }
  });

  const totalFeedDuration = () => {
    let totalSec = 0;
    sumFeedings.forEach((feeding) => {
      let diff = 0;
      if (isToday(new Date(feeding.start))) {
        diff = differenceInSeconds(
          new Date(feeding.finish),
          new Date(feeding.start)
        );
      } else {
        diff = differenceInSeconds(new Date(feeding.finish), startOfToday());
      }

      totalSec = totalSec + diff;
    });

    const date = addSeconds(new Date(0), totalSec);
    const x = addHours(date, 12);
    return format(x, "H'h'mm'm'");
  };

  const sumSleeps = sleeps.filter((sleep) => {
    const finishDate = new Date(sleep.finish);
    if (isToday(finishDate)) {
      return sleep;
    }
  });

  const totalSleepDuration = () => {
    let totalSec = 0;
    sumSleeps.forEach((sleep) => {
      let diff = 0;
      if (isToday(new Date(sleep.start))) {
        diff = differenceInSeconds(
          new Date(sleep.finish),
          new Date(sleep.start)
        );
      } else {
        diff = differenceInSeconds(new Date(sleep.finish), startOfToday());
      }

      totalSec = totalSec + diff;
    });
    const date = addSeconds(new Date(0), totalSec);
    const x = addHours(date, 12);
    return format(x, "H'h'mm'm'");
  };

  const sumLeisures = leisures.filter((leisure) => {
    const finishDate = new Date(leisure.finish);
    if (isToday(finishDate)) {
      return leisure;
    }
  });

  const totalLeisureDuration = () => {
    let totalSec = 0;
    sumLeisures.forEach((leisure) => {
      const diff = differenceInSeconds(
        new Date(leisure.finish),
        new Date(leisure.start)
      );
      totalSec = totalSec + diff;
    });
    const date = addSeconds(new Date(0), totalSec);
    const x = addHours(date, 12);
    return format(x, "H'h'mm'm'");
  };

  const sumDiapers = diapers.filter((diaper) => {
    const date = new Date(diaper.start);
    if (isToday(date)) {
      return diaper;
    }
  });

  const totalDiapers = () => {
    let pooCounter = 0;
    let peeCounter = 0;
    diapers.forEach((diaper) => {
      if (diaper.type === "poo") {
        pooCounter = pooCounter + 1;
      } else if (diaper.type === "pee") {
        peeCounter = peeCounter + 1;
      } else {
        pooCounter = pooCounter + 1;
        peeCounter = peeCounter + 1;
      }
    });
    return `${peeCounter}pee, ${pooCounter}poo`;
  };

  return (
    <Box>
      <Box>
        <Link to="/feed">
          <IconButton aria-label="delete" size="large">
            <LocalCafeRounded fontSize="inherit" />
          </IconButton>
        </Link>
        <Link to="/sleep">
          <IconButton aria-label="delete" size="large">
            <CribRounded fontSize="inherit" />
          </IconButton>
        </Link>
        <Link to="/diapers">
          <IconButton aria-label="delete" size="large">
            <BabyChangingStationRounded fontSize="inherit" />
          </IconButton>
        </Link>
        <Link to="/leisure">
          <IconButton aria-label="delete" size="large">
            <SportsBasketballRounded fontSize="inherit" />
          </IconButton>
        </Link>
        <Link to="/growth">
          <IconButton aria-label="delete" size="large">
            <MonitorWeightRounded fontSize="inherit" />
          </IconButton>
        </Link>
        <Link to="/health">
          <IconButton aria-label="delete" size="large">
            <LocalHospitalRounded fontSize="inherit" />
          </IconButton>
        </Link>
        <Link to="/photo">
          <IconButton aria-label="delete" size="large">
            <PhotoCameraRounded fontSize="inherit" />
          </IconButton>
        </Link>
      </Box>
      <List>
        {stopwatch.isRunning ? (
          <InProgress
            route="/feed"
            type={stopwatch.type}
            time={stopwatch.time}
          />
        ) : null}
        {sleepStopwatch.isRunning ? (
          <InProgress route="/sleep" type="Sleep" time={sleepStopwatch.time} />
        ) : null}
        {leisureStopwatch.isRunning ? (
          <InProgress
            route="/leisure"
            type={leisureStopwatch.type}
            time={leisureStopwatch.time}
          />
        ) : null}
      </List>
      <List
        subheader={
          <ListSubheader
          // component="div" id="nested-list-subheader"
          >
            Latest activity
          </ListSubheader>
        }
      >
        {latestFeeding ? (
          <LatestActivity text={getFeedingText()} route="/feed" />
        ) : null}
        {latestSleep ? (
          <LatestActivity text={getSleepText()} route="/sleep" />
        ) : null}
        {latestLeisure ? (
          <LatestActivity text={getLeisureText()} route="/leisure" />
        ) : null}
        {latestDiaper ? (
          <LatestActivity text={getDiaperText()} route="/diapers" />
        ) : null}
        {latestHealth ? (
          <LatestActivity text={getHealthText()} route="/health" />
        ) : null}
        {latestGrowth ? (
          <LatestActivity text={getGrowthText()} route="/growth" />
        ) : null}
      </List>
      <List
        subheader={
          <ListSubheader
          // component="div" id="nested-list-subheader"
          >
            Summary for today
          </ListSubheader>
        }
      >
        {sumFeedings.length ? (
          <SummaryToday
            text="Feedings"
            totalTimes={sumFeedings.length}
            totalDuration={totalFeedDuration}
          />
        ) : null}

        {sumSleeps.length ? (
          <SummaryToday
            text="Sleeps"
            totalTimes={sumSleeps.length}
            totalDuration={totalSleepDuration}
          />
        ) : null}
        {sumLeisures.length ? (
          <SummaryToday
            text="Leisures"
            totalTimes={sumLeisures.length}
            totalDuration={totalLeisureDuration}
          />
        ) : null}
        {sumDiapers.length ? (
          <SummaryToday
            text="Diapers"
            totalTimes={sumDiapers.length}
            totalDuration={totalDiapers}
          />
        ) : null}
      </List>
      <Container
      // sx={{ display: "flex", position: "absolute", bottom: "16px" }}
      >
        <Button
          style={{ marginTop: "16px" }}
          fullWidth
          variant="contained"
          color="secondary"
          onClick={() => {
            navigate("/all-log");
          }}
        >
          All logs
        </Button>
      </Container>
    </Box>
  );
};

// TODO: Add timeframe to display latest activity
