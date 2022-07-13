import { MoreVertRounded } from "@mui/icons-material";
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
import { format, isSameDay, isToday, isYesterday, subMinutes } from "date-fns";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { EndMessage } from "../Components/EndMessage";
import { Header } from "../Components/Header";
import { IconType } from "../Components/IconType";
import { ScrollLoader } from "../Components/ScrollLoader";
import { SleepDialog } from "../Components/SleepDialog";
import { SleepStopWatch } from "../Components/SleepStopWatch";
import { useInfiniteScroll } from "../Hooks/infiniteScroll";
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
  const sleepsList = useSelector((state: RootState) => {
    return [...state.sleep.sleeps].sort((a, b) => {
      if (+new Date(a.finish ?? a.start) < +new Date(b.finish ?? b.start)) {
        return 1;
      } else return -1;
    });
  });

  const { limit, fetchData, slicedList, dataLength, hasMore } =
    useInfiniteScroll(sleepsList);

  const sleepStopwatch = useSelector(
    (state: RootState) => state.sleep.sleepStopwatch
  );
  const dispatch = useDispatch();

  //usestate//
  const [selectedSleep, setSelectedSleep] = useState<Sleep | undefined>(
    undefined
  );

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
      {sleepStopwatch.isRunning ? (
        <SleepStopWatch onSave={onSave} />
      ) : (
        <Container style={{ marginTop: "16px" }}>
          <Button
            style={{ marginBottom: "16px" }}
            fullWidth
            variant="contained"
            onClick={() => dispatch(startSleepWatch())}
          >
            Sleep
          </Button>
        </Container>
      )}
      <Box style={{ marginTop: "16px" }}>
        <List dense={true}>
          <InfiniteScroll
            dataLength={dataLength}
            next={fetchData}
            hasMore={hasMore}
            loader={<ScrollLoader />}
            endMessage={<EndMessage dataLength={dataLength} />}
          >
            {slicedList.map((sleep: any, i: number) => {
              const text = `${format(
                new Date(sleep.start),
                "p"
              )}, ${formatDuration(sleep.start, sleep.finish)},${sleep.type}
            `;
              const diff = formatDuration(
                slicedList[i].finish,
                slicedList[i - 1]?.start ?? Date()
              );

              const dates = () => {
                if (isToday(new Date(slicedList[i].finish))) {
                  return "Today";
                } else if (isYesterday(new Date(slicedList[i].finish))) {
                  return "Yesterday";
                } else {
                  return format(new Date(slicedList[i].finish), "LLL d EEEE");
                }
              };
              const isSameDate = isSameDay(
                new Date(slicedList[i - 1]?.finish ?? Date()),
                new Date(slicedList[i].finish)
              );

              return (
                <React.Fragment key={sleep.id}>
                  {!isSameDate && (
                    <ListItem style={{ paddingTop: 0, paddingBottom: 0 }}>
                      <ListItemText
                        style={{ marginTop: 0, marginBottom: 0 }}
                        primary={dates()}
                      />
                    </ListItem>
                  )}
                  <ListItem style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <ListItemAvatar style={{ opacity: 0, height: 0 }}>
                      <Avatar>
                        <MoreVertRounded />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      style={{ marginTop: 0, marginBottom: 0 }}
                      secondary={diff}
                    />
                  </ListItem>
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
                      <Avatar style={{ backgroundColor: "#151e33" }}>
                        <IconType type={sleep.type} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={text} secondary={sleep.details} />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </InfiniteScroll>
        </List>
      </Box>
    </Box>
  );
};
