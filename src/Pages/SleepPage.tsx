import { ForkLeftRounded, MoreVertRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  addHours,
  addSeconds,
  differenceInSeconds,
  format,
  subMinutes,
} from "date-fns";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "../Components/Header";
import { SleepDialog } from "../Components/SleepDialog";
import { SleepStopWatch } from "../Components/SleepStopWatch";
import {
  addSleep,
  deleteSleep,
  editSleep,
  startSleepWatch,
  stopSleepWatch,
} from "../Store/SleepSlice";
import { RootState } from "../Store/store";
import { formatDuration } from "./FeedPage";

export type Sleep = {
  id: number;
  start: string;
  type: "Sleep";
  finish: string;
  details: string;
};
export const SleepPage = () => {
  const sleeps = useSelector((state: RootState) => state.sleep.sleeps);

  const sleepStopwatch = useSelector(
    (state: RootState) => state.sleep.sleepStopwatch
  );
  const dispatch = useDispatch();

  //usestate//
  const [selectedSleep, setSelectedSleep] = useState<Sleep | undefined>(
    undefined
  );
  // const [isStopWatch, setIsStopWatch] = useState(false);

  //function/

  const calcStartDate = () => {
    const defaultDate = subMinutes(new Date(), 15);
    return defaultDate.toString();
  };

  const handleClickOpen = () => {
    const newSleep: Sleep = {
      id: 0,
      type: "Sleep",
      start: calcStartDate(),
      finish: Date(),
      details: "",
    };
    setSelectedSleep(newSleep);
  };

  const onClose = () => {
    setSelectedSleep(undefined);
  };

  const onSave = (newSleep: Sleep) => {
    setSelectedSleep(undefined);
    dispatch(stopSleepWatch());
    if (newSleep.id === 0) {
      const sleepWithId = { ...newSleep, id: Math.random() };
      dispatch(addSleep(sleepWithId));
    } else {
      dispatch(editSleep(newSleep));
    }
  };

  const handleEditOpen = (newSleep: Sleep) => {
    setSelectedSleep(newSleep);
  };

  const onDelete = (id: number) => {
    dispatch(deleteSleep(id));
    onClose();
  };

  return (
    <Box>
      <Header title="Sleep" handleClickOpen={handleClickOpen} />
      <SleepDialog
        selectedSleep={selectedSleep}
        onClose={onClose}
        onSave={onSave}
        onDelete={onDelete}
      />

      {!sleepStopwatch.isRunning ? (
        <Container>
          <Button
            style={{ marginTop: "16px" }}
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<ForkLeftRounded />}
            onClick={() => dispatch(startSleepWatch())}
          >
            Sleep
          </Button>
        </Container>
      ) : null}

      {sleepStopwatch.isRunning ? <SleepStopWatch onSave={onSave} /> : null}
      <Box>
        <List dense={true}>
          {sleeps.map((sleep: any) => {
            const text = `${format(
              new Date(sleep.start),
              "p"
            )}, ${formatDuration(sleep.start, sleep.finish)},${sleep.type}
            `;

            return (
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleEditOpen(sleep)}
                  >
                    <MoreVertRounded />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <MoreVertRounded />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={text} secondary={sleep.details} />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};
