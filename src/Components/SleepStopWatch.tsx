import { EditRounded, ForkLeftRounded } from "@mui/icons-material";
import {
  Container,
  Box,
  Button,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import { addSeconds, format, subSeconds } from "date-fns";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Sleep } from "../Pages/SleepPage";
import { updateSleepStopwatch } from "../Store/SleepSlice";
import { RootState } from "../Store/store";

type Props = {
  onSave: (newSleep: Sleep) => void;
};

export const SleepStopWatch = (props: Props) => {
  const sleepStopwatch = useSelector(
    (state: RootState) => state.sleep.sleepStopwatch
  );
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
        <Button variant="contained" startIcon={<ForkLeftRounded />}>
          Sleep
        </Button>

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, textAlign: "center" }}
        >
          {formatTime(sleepStopwatch.time)}
        </Typography>

        <IconButton
          size="large"
          edge="start"
          color={sleepStopwatch.isEdit ? "primary" : "inherit"}
          aria-label="menu"
          onClick={() =>
            dispatch(
              updateSleepStopwatch({
                ...sleepStopwatch,
                isEdit: !sleepStopwatch.isEdit,
              })
            )
          }
        >
          <EditRounded />
        </IconButton>
      </Box>

      {sleepStopwatch.isEdit === true ? (
        <TextField
          autoFocus={true}
          label="Optional details"
          id="standard-basic"
          variant="standard"
          fullWidth
          value={sleepStopwatch.details}
          onChange={(e) =>
            dispatch(
              updateSleepStopwatch({
                ...sleepStopwatch,
                details: e.target.value,
              })
            )
          }
        />
      ) : null}

      <Button
        style={{ marginTop: "16px" }}
        fullWidth
        variant="contained"
        onClick={() => {
          props.onSave({
            start: subSeconds(new Date(), sleepStopwatch.time).toString(),
            finish: Date(),
            details: sleepStopwatch.details,
            id: 0,
            type: "Sleep",
          });
        }}
      >
        Finish
      </Button>
    </Container>
  );
};
