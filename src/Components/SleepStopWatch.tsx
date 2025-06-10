import { EditRounded } from "@mui/icons-material";
import { Container, Box, Button, IconButton, TextField } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Sleep } from "../Types/sleep";
import { updateSleepStopwatch, stopSleepWatch } from "../Store/SleepSlice";
import { RootState } from "../Store/store";
import { Counter } from "./Counter";

type SleepStopWatchProps = {
  onSave: (newSleep: Sleep) => void;
};

export const SleepStopWatch = (props: SleepStopWatchProps) => {
  const sleepStopwatch = useSelector(
    (state: RootState) => state.sleep.sleepStopwatch
  );
  const dispatch = useDispatch();

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
        <Button variant="contained">Sleep</Button>

        <Counter startDate={sleepStopwatch.startDate} />

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

      {sleepStopwatch.isEdit === true && (
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
      )}

      <Button
        style={{ marginTop: "16px" }}
        fullWidth
        variant="contained"
        onClick={() => {
          props.onSave({
            start: sleepStopwatch.startDate,
            finish: Date(),
            details: sleepStopwatch.details,
            id: "0",
            type: "Sleep",
          });
          dispatch(stopSleepWatch());
        }}
      >
        Finish
      </Button>
    </Container>
  );
};
