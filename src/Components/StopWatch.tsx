import { EditRounded } from "@mui/icons-material";
import {
  Container,
  Box,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { addSeconds, format } from "date-fns";
import { Feeding, FeedingType, FeedingStopwatch } from "../Types/feeding";
import { Counter } from "./Counter";

type Props = {
  stopwatch: FeedingStopwatch;
  onStart: (type: FeedingType) => void;
  onStop: () => void;
  onUpdate: (updatedStopwatch: FeedingStopwatch) => void;
  onSave: (feeding: Feeding) => void;
  onOpenDialog: () => void;
};

export const getFeedText = (feedingType: FeedingType) => {
  switch (feedingType) {
    case "left breast":
      return "Left";
    case "right breast":
      return "Right";
    case "bottle":
      return "Bottle";
    case "meal":
      return "Meal";
  }
};

export const formatTime = (seconds: number) => {
  const date = addSeconds(new Date(0), seconds);
  return format(date, "m:ss");
};

export const StopWatch = (props: Props) => {
  const handleStart = (type: FeedingType) => {
    props.onStart(type);
  };

  const handleStop = () => {
    props.onStop();
  };

  const handleUpdate = (updatedStopwatch: FeedingStopwatch) => {
    props.onUpdate(updatedStopwatch);
  };

  const handleSave = () => {
    props.onSave({
      id: "0",
      type: props.stopwatch.type,
      details: props.stopwatch.details,
      start: props.stopwatch.startDate,
      finish: new Date().toISOString(),
      amount: props.stopwatch.amount,
      contents: props.stopwatch.contents,

    });
  };

  return (
    <Container style={{ marginTop: "16px" }}>
      {props.stopwatch.isRunning ? (
        <>
          <Box
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "16px",
              alignItems: "center",
            }}
          >
            <Button variant="contained">{getFeedText(props.stopwatch.type)}</Button>
            <Counter startDate={props.stopwatch.startDate} />
            <IconButton
              size="large"
              edge="start"
              color={props.stopwatch.isEdit ? "primary" : "inherit"}
              aria-label="menu"
              onClick={() =>
                handleUpdate({ ...props.stopwatch, isEdit: !props.stopwatch.isEdit })
              }
            >
              <EditRounded />
            </IconButton>
          </Box>
          {props.stopwatch.isEdit && (
            <>
              {props.stopwatch.type === "bottle" ? (
                <Box style={{ display: "flex", flexDirection: "column" }}>
                  <Box style={{ display: "flex" }}>
                    <TextField
                      autoFocus={true}
                      label="Amount"
                      id="standard-basic"
                      variant="standard"
                      fullWidth
                      value={props.stopwatch.amount}
                      onChange={(e) => {
                        handleUpdate({
                          ...props.stopwatch,
                          amount: Number(e.target.value),
                        });
                      }}
                      type="number"
                    />
                  </Box>
                  <Box style={{ display: "flex", marginBottom: "16px" }}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        Contents
                      </InputLabel>
                      <Select
                        value={props.stopwatch.contents}
                        onChange={(e) => {
                          handleUpdate({
                            ...props.stopwatch,
                            contents: e.target.value,
                          });
                        }}
                      >
                        <MenuItem value={"formula"}>Formula</MenuItem>
                        <MenuItem value={"breast milk"}>Breast milk</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              ) : (
                <TextField
                  autoFocus={true}
                  label="Optional details"
                  id="standard-basic"
                  variant="standard"
                  fullWidth
                  value={props.stopwatch.details}
                  onChange={(e) =>
                    handleUpdate({ ...props.stopwatch, details: e.target.value })
                  }
                />
              )}
            </>
          )}
          <Button
            fullWidth
            variant="contained"
            style={{ marginTop: "16px" }}
            onClick={handleSave}
          >
            Finish
          </Button>
        </>
      ) : (
        <Container style={{ marginTop: "16px" }}>
          <Box style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleStart("left breast")}
            >
              Left
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleStart("right breast")}
            >
              Right
            </Button>
          </Box>
          <Box style={{ display: "flex", gap: "16px" }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleStart("bottle")}
            >
              Bottle
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleStart("meal")}
            >
              Meal
            </Button>
          </Box>
        </Container>
      )}
    </Container>
  );
};
