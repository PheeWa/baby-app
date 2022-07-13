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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { type } from "@testing-library/user-event/dist/type";
import { time } from "console";
import {
  addSeconds,
  addHours,
  format,
  subSeconds,
  differenceInSeconds,
} from "date-fns";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Feeding, FeedingType } from "../Pages/FeedPage";
import { updateStopwatch } from "../Store/feedSlice";
import { feedingData } from "../Store/initData";
import { RootState } from "../Store/store";

type Props = {
  onSave: (newFeeding: Feeding) => void;
  feedingType: FeedingType;
};

export const getFeedText = (feedingType: FeedingType) => {
  switch (feedingType) {
    case "left breast":
      return "Left breast";
    case "right breast":
      return "Right breast";
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
  const stopwatch = useSelector((state: RootState) => state.feed.stopwatch);

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
        <Button
          //   fullWidth
          variant="contained"
          // color="secondary"
          startIcon={<ForkLeftRounded />}
        >
          {getFeedText(props.feedingType)}
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
        <>
          {props.feedingType === "bottle" ? (
            <Box style={{ display: "flex", flexDirection: "column" }}>
              <Box style={{ display: "flex" }}>
                <TextField
                  autoFocus={true}
                  label="Amount"
                  id="standard-basic"
                  variant="standard"
                  fullWidth
                  value={stopwatch.amount}
                  // onChange={(e) => setAmount(e.target.value as any)}
                  onChange={(e) => {
                    dispatch(
                      updateStopwatch({
                        ...stopwatch,
                        amount: e.target.value as any,
                      })
                    );
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
                    value={stopwatch.contents}
                    // onChange={(e) => setContents(e.target.value)}
                    onChange={(e) => {
                      dispatch(
                        updateStopwatch({
                          ...stopwatch,
                          contents: e.target.value as any,
                        })
                      );
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
              value={stopwatch.details}
              onChange={(e) =>
                dispatch(
                  updateStopwatch({ ...stopwatch, details: e.target.value })
                )
              }
            />
          )}
        </>
      ) : null}{" "}
      <Button
        fullWidth
        variant="contained"
        style={{ marginTop: "16px" }}
        // color="secondary"
        // startIcon={<ForkLeftRounded />}
        onClick={() => {
          props.onSave({
            start: subSeconds(new Date(), stopwatch.time).toString(),
            finish: Date(),
            details: stopwatch.details,
            id: 0,
            type: props.feedingType,
            contents: stopwatch.contents,
            amount: stopwatch.amount,
          });
        }}
      >
        Finish
      </Button>
    </Container>
  );
};
