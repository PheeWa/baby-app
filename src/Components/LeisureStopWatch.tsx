import {
  ArrowBackRounded,
  EditRoad,
  EditRounded,
  ForkLeftRounded,
} from "@mui/icons-material";
import {
  Container,
  Box,
  Button,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import { type } from "@testing-library/user-event/dist/type";
import {
  addSeconds,
  addHours,
  format,
  subSeconds,
  differenceInSeconds,
} from "date-fns";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Leisure, LeisureType } from "../Pages/LeisurePage";
import { updateStopwatch } from "../Store/LeisureSlice";
import { RootState } from "../Store/store";

export const getLeisureText = (leisureType: LeisureType) => {
  switch (leisureType) {
    case "tummy time":
      return "Tummy time";
    case "play time":
      return "Play time";
    case "outdoors":
      return "Outdoors";
    case "bath time":
      return "Bath time";
  }
};

type Props = {
  onSave: (newLeisure: Leisure) => void;
  // leisureType: LeisureType;
};

export const LeisureStopWatch = (props: Props) => {
  const stopwatch = useSelector((state: RootState) => state.leisure.stopwatch);
  const dispatch = useDispatch();

  // const [time, setTime] = useState(0);
  // const [isEdit, setIsEdit] = useState(false);
  // const [details, setDetails] = useState("");

  useEffect(() => {
    // if (!stopwatch) {
    //   return;
    // }
    const interval = setInterval(() => {
      // setTime((time) => time + 1);
      const diff = differenceInSeconds(
        new Date(),
        new Date(stopwatch.startDate)
      );
      dispatch(updateStopwatch({ ...stopwatch, time: diff }));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const date = addSeconds(new Date(0), seconds);
    // const x = addHours(date, 12);

    return format(date, "m:ss");
  };

  // if (!stopwatch) {
  //   return null;
  // }
  return (
    <Container style={{ marginTop: "16px" }}>
      <Box
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        <Button
          //   fullWidth
          variant="contained"
          // color="secondary"
          startIcon={<ForkLeftRounded />}
        >
          {getLeisureText(stopwatch.type)}
        </Button>

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, textAlign: "center" }}
        >
          {formatTime(stopwatch.time)}
        </Typography>

        <IconButton
          size="large"
          edge="start"
          color={stopwatch.isEdit ? "primary" : "inherit"}
          aria-label="menu"
          //   sx={{ mr: 2 }}
          onClick={() =>
            dispatch(
              updateStopwatch({ ...stopwatch, isEdit: !stopwatch.isEdit })
            )
          }
        >
          <EditRounded />
        </IconButton>
      </Box>

      {stopwatch.isEdit === true ? (
        <TextField
          id="standard-basic"
          variant="standard"
          fullWidth
          value={stopwatch.details}
          onChange={(e) => {
            dispatch(
              updateStopwatch({ ...stopwatch, details: e.target.value })
            );
          }}
        />
      ) : null}

      <Button
        fullWidth
        style={{ marginTop: "16px" }}
        variant="contained"
        // color="secondary"
        // startIcon={<ForkLeftRounded />}
        onClick={() => {
          props.onSave({
            start: subSeconds(new Date(), stopwatch.time).toString(),
            finish: Date(),
            details: stopwatch.details,
            id: 0,
            type: stopwatch.type,
          });
        }}
      >
        Finish
      </Button>
    </Container>
  );
};
