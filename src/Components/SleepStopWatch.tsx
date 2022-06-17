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
import { differenceInSeconds } from "date-fns/esm";
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

  // const [time, setTime] = useState(0);
  // const [isEdit, setIsEdit] = useState(false);
  // const [details, setDetails] = useState("");
  // const [startDate, setStartDate] = useState(Date());

  // useEffect(() => {
  //   if (!sleepStopwatch) {
  //     return;
  //   }
  //   const diff = differenceInSeconds(
  //     new Date(),
  //     new Date(sleepStopwatch.startDate)
  //   );
  //   dispatch(updateSleepStopwatch({ ...sleepStopwatch, time: diff }));
  //   const interval = setInterval(() => {
  //     // setTime((time) => time + 1);
  //     const diff = differenceInSeconds(
  //       new Date(),
  //       new Date(sleepStopwatch.startDate)
  //     );
  //     dispatch(updateSleepStopwatch({ ...sleepStopwatch, time: diff }));
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

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
          color="secondary"
          startIcon={<ForkLeftRounded />}
        >
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
          color={sleepStopwatch.isEdit ? "secondary" : "inherit"}
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
        fullWidth
        variant="contained"
        color="secondary"
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
