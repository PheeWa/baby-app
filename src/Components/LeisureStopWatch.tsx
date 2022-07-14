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
import { Counter } from "./Counter";

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
};

export const LeisureStopWatch = (props: Props) => {
  const stopwatch = useSelector((state: RootState) => state.leisure.stopwatch);
  const dispatch = useDispatch();

  const formatTime = (seconds: number) => {
    const date = addSeconds(new Date(0), seconds);

    return format(date, "m:ss");
  };

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
          variant="contained"
          // color="secondary"
        >
          {getLeisureText(stopwatch.type)}
        </Button>

        <Counter startDate={stopwatch.startDate} />

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
          autoFocus={true}
          label="Details"
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
        onClick={() => {
          props.onSave({
            start: stopwatch.startDate,
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
