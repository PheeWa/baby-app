import {
  ArrowForwardIosRounded,
  ArrowForwardRounded,
  BabyChangingStationRounded,
  CribRounded,
  Image,
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
  Paper,
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
import milkBottle from "../Assets/milkBottle.png";
import sleep from "../Assets/sleep.png";
import nappy from "../Assets/nappy.png";
import leisureIcon from "../Assets/leisureIcon.png";
import growthIcon from "../Assets/growthIcon.png";
import healthIcon from "../Assets/healthIcon.png";
import cameraIcon from "../Assets/cameraIcon.png";

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

  // const latestFeeding = feedings[feedings.length - 1] as Feeding | undefined;
  const latestFeeding = [...feedings].sort((a, b) => {
    if (+new Date(a.finish) < +new Date(b.finish)) {
      return 1;
    } else {
      return -1;
    }
  })[0];

  const latestSleep = [...sleeps].sort((a, b) => {
    if (+new Date(a.finish) < +new Date(b.finish)) {
      return 1;
    } else {
      return -1;
    }
  })[0];
  // const latestLeisure = leisures[leisures.length - 1] as Leisure | undefined;
  const latestLeisure = [...leisures].sort((a, b) => {
    if (+new Date(a.finish) < +new Date(b.finish)) {
      return 1;
    } else {
      return -1;
    }
  })[0];

  // const latestDiaper = diapers[diapers.length - 1] as Diaper | undefined;
  const latestDiaper = [...diapers].sort((a, b) => {
    if (+new Date(a.start) < +new Date(b.start)) {
      return 1;
    } else {
      return -1;
    }
  })[0];
  // const latestHealth = healths[healths.length - 1] as Health | undefined;
  const latestHealth = [...healths].sort((a, b) => {
    if (+new Date(a.start) < +new Date(b.start)) {
      return 1;
    } else {
      return -1;
    }
  })[0];
  // const latestGrowth = growths[growths.length - 1] as Growth | undefined;
  const latestGrowth = [...growths].sort((a, b) => {
    if (+new Date(a.start) < +new Date(b.start)) {
      return 1;
    } else {
      return -1;
    }
  })[0];

  //For Latest activity//
  const getFeedingText = () => {
    if (!latestFeeding) {
      return "";
    }
    const text = `${formatDuration(
      latestFeeding.finish,
      Date()
    )} ago, ${formatDuration(latestFeeding.start, latestFeeding.finish)}, ${
      latestFeeding.type
    } ${latestFeeding.details ? "," : ""} ${latestFeeding.details}`;

    return text;
  };

  const getSleepText = () => {
    if (!latestSleep) {
      return "";
    }
    // return latestSleep.id + "";
    const text = `${formatDuration(
      latestSleep.finish,
      Date()
    )} ago, ${formatDuration(latestSleep.start, latestSleep.finish)},sleep ${
      latestSleep.details ? "," : ""
    } ${latestSleep.details}
    `;
    return text;
  };

  const getLeisureText = () => {
    if (!latestLeisure) {
      return "";
    }
    const text = `${formatDuration(
      latestLeisure.finish,
      Date()
    )} ago, ${formatDuration(latestLeisure.start, latestLeisure.finish)}, ${
      latestLeisure.type
    } ${latestLeisure.details ? "," : ""} ${latestLeisure.details}`;
    return text;
  };

  const getDiaperText = () => {
    if (!latestDiaper) {
      return "";
    }
    const text = `${formatDuration(latestDiaper.start, Date())} ago,${
      latestDiaper.type
    } ${latestDiaper.details ? "," : ""} ${latestDiaper.details}`;
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
    const text = `${formatDuration(latestHealth.start, Date())} ago, ${
      latestHealth.type
    } ${showValue()} ${latestHealth.details ? "," : ""} ${
      latestHealth.details
    }`;

    return text;
  };

  const getGrowthText = () => {
    if (!latestGrowth) {
      return "";
    }
    const text = `${formatDuration(latestGrowth.start, Date())} ago, ${getLabel(
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
      let diff = 0;
      if (isToday(new Date(leisure.start))) {
        diff = differenceInSeconds(
          new Date(leisure.finish),
          new Date(leisure.start)
        );
      } else {
        diff = differenceInSeconds(new Date(leisure.finish), startOfToday());
      }

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
    sumDiapers.forEach((diaper) => {
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

  const noRecordToday = () => {
    if (
      sumFeedings.length === 0 &&
      sumSleeps.length === 0 &&
      sumLeisures.length === 0 &&
      sumDiapers.length === 0
    ) {
      return true;
    }
  };

  const noLatestActivity = () => {
    if (
      !latestFeeding &&
      !latestSleep &&
      !latestDiaper &&
      !latestGrowth &&
      !latestHealth &&
      !latestLeisure
    ) {
      return true;
    }
  };

  const stopwatchNotRun = () => {
    if (
      !stopwatch.isRunning &&
      !sleepStopwatch.isRunning &&
      !leisureStopwatch.isRunning
    ) {
      return true;
    }
    return false;
  };

  return (
    <Box>
      <Box
        style={{
          display: "flex",
          overflow: "auto",
          marginBottom: "16px",
          padding: "16px",
          gap: "16px",
          // justifyContent: "center",
        }}
      >
        <Link to="/feed">
          <Button style={{ backgroundColor: "#151e33" }}>
            <img width="50px" src={milkBottle}></img>
          </Button>
        </Link>
        <Link to="/sleep">
          <Button style={{ backgroundColor: "#151e33" }}>
            <img width="50px" src={sleep}></img>
          </Button>
        </Link>
        <Link to="/diapers">
          <Button style={{ backgroundColor: "#151e33" }}>
            <img width="50px" src={nappy}></img>
          </Button>
        </Link>
        <Link to="/leisure">
          <Button style={{ backgroundColor: "#151e33" }}>
            <img width="50px" src={leisureIcon}></img>
          </Button>
        </Link>
        <Link to="/growth">
          <Button style={{ backgroundColor: "#151e33" }}>
            <img width="50px" src={growthIcon}></img>
          </Button>
        </Link>
        <Link to="/health">
          <Button style={{ backgroundColor: "#151e33" }}>
            <img width="50px" src={healthIcon}></img>
          </Button>
        </Link>
        <Link to="/photo">
          <Button style={{ backgroundColor: "#151e33" }}>
            <img width="50px" src={cameraIcon}></img>
          </Button>
        </Link>
      </Box>
      <Container>
        {!stopwatchNotRun() ? (
          <Paper style={{ marginTop: "16px", marginBottom: "16px" }}>
            <List>
              {stopwatch.isRunning ? (
                <InProgress
                  route="/feed"
                  type={stopwatch.type}
                  time={stopwatch.time}
                />
              ) : null}
              {sleepStopwatch.isRunning ? (
                <InProgress
                  route="/sleep"
                  type="Sleep"
                  time={sleepStopwatch.time}
                />
              ) : null}
              {leisureStopwatch.isRunning ? (
                <InProgress
                  route="/leisure"
                  type={leisureStopwatch.type}
                  time={leisureStopwatch.time}
                />
              ) : null}
            </List>
          </Paper>
        ) : null}
        <Paper>
          <List
            subheader={
              <ListSubheader
                disableSticky={true}
                style={{ background: "transparent" }}
                // component="div" id="nested-list-subheader"
              >
                Latest activity
              </ListSubheader>
            }
          >
            {noLatestActivity() ? (
              <ListItem>
                <ListItemText primary="No latest activities" />
              </ListItem>
            ) : (
              <>
                {latestFeeding ? (
                  <LatestActivity
                    text={getFeedingText()}
                    route="/feed"
                    type={latestFeeding.type}
                  />
                ) : null}
                {latestSleep ? (
                  <LatestActivity
                    text={getSleepText()}
                    route="/sleep"
                    type={latestSleep.type}
                  />
                ) : null}
                {latestLeisure ? (
                  <LatestActivity
                    text={getLeisureText()}
                    route="/leisure"
                    type={latestLeisure.type}
                  />
                ) : null}
                {latestDiaper ? (
                  <LatestActivity
                    text={getDiaperText()}
                    route="/diapers"
                    type={latestDiaper.type}
                  />
                ) : null}
                {latestHealth ? (
                  <LatestActivity
                    text={getHealthText()}
                    route="/health"
                    type={latestHealth.type}
                  />
                ) : null}
                {latestGrowth ? (
                  <LatestActivity
                    text={getGrowthText()}
                    route="/growth"
                    type={latestGrowth.type}
                  />
                ) : null}
              </>
            )}
          </List>
        </Paper>
        <Paper style={{ marginTop: "16px", marginBottom: "16px" }}>
          <List
            subheader={
              <ListSubheader
                style={{ background: "transparent" }}
                disableSticky={true}
              >
                Summary for today
              </ListSubheader>
            }
          >
            {noRecordToday() ? (
              <ListItem>
                <ListItemText primary="No records for Today" />
              </ListItem>
            ) : (
              <>
                {sumFeedings.length ? (
                  <SummaryToday
                    text="Feedings"
                    totalTimes={sumFeedings.length}
                    totalDuration={totalFeedDuration}
                    type="bottle"
                  />
                ) : null}

                {sumSleeps.length ? (
                  <SummaryToday
                    text="Sleeps"
                    totalTimes={sumSleeps.length}
                    totalDuration={totalSleepDuration}
                    type="Sleep"
                  />
                ) : null}
                {sumLeisures.length ? (
                  <SummaryToday
                    text="Leisures"
                    totalTimes={sumLeisures.length}
                    totalDuration={totalLeisureDuration}
                    type="play time"
                  />
                ) : null}
                {sumDiapers.length ? (
                  <SummaryToday
                    text="Diapers"
                    totalTimes={sumDiapers.length}
                    totalDuration={totalDiapers}
                    type="pee & poo"
                  />
                ) : null}
              </>
            )}
          </List>
        </Paper>

        <Button
          style={{
            marginTop: "16px",
            marginBottom: "16px",
            width: "50%",
            display: "flex",
            alignSelf: "center",
          }}
          variant="contained"
          // color="secondary"
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
