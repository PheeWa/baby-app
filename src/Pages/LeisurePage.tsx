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
import { useSelector, useDispatch } from "react-redux";
import { EndMessage } from "../Components/EndMessage";
import { Header } from "../Components/Header";
import { IconType } from "../Components/IconType";
import { LeisureDialog } from "../Components/LeisureDialog";
import { LeisureStopWatch } from "../Components/LeisureStopWatch";
import { ScrollLoader } from "../Components/ScrollLoader";
import { useInfiniteScroll } from "../Hooks/infiniteScroll";
import { startStopwatch } from "../Store/LeisureSlice";
import { stopStopwatch } from "../Store/LeisureSlice";
import { addLeisure, deleteLeisure, editLeisure } from "../Store/LeisureSlice";
import { RootState } from "../Store/store";
import { formatDuration } from "./FeedPage";

export type LeisureType = "tummy time" | "play time" | "outdoors" | "bath time";
export type Leisure = {
  id: number;
  type: LeisureType;
  details: string;
  start: string;
  finish: string;
};

export const LeisurePage = () => {
  //usestates are here//
  const [selectedLeisure, setSelectedLeisure] = useState<Leisure | undefined>(
    undefined
  );

  // functions are here//

  const leisuresList = useSelector((state: RootState) => {
    return [...state.leisure.leisures].sort((a, b) => {
      if (+new Date(a.finish ?? a.start) < +new Date(b.finish ?? b.start)) {
        return 1;
      } else return -1;
    });
  });
  const stopwatch = useSelector((state: RootState) => state.leisure.stopwatch);
  //Hooks//
  const { limit, fetchData, slicedList, dataLength, hasMore } =
    useInfiniteScroll(leisuresList);
  const dispatch = useDispatch();

  const calcStartDate = () => {
    const defaultDate = subMinutes(new Date(), 15);
    return defaultDate.toString();
  };

  const handleClickOpen = () => {
    const newLeisure: Leisure = {
      id: 0,
      type: "tummy time",
      details: "",
      start: calcStartDate(),
      finish: Date(),
    };
    setSelectedLeisure(newLeisure);
  };

  const onClose = () => {
    setSelectedLeisure(undefined);
  };

  const onSave = (newLeisure: Leisure) => {
    onClose();
    dispatch(stopStopwatch());
    if (newLeisure.id === 0) {
      const newLeisureWithId = { ...newLeisure, id: Math.random() };
      dispatch(addLeisure(newLeisureWithId));
    } else {
      dispatch(editLeisure(newLeisure));
    }
  };

  const handleEdit = (leisure: Leisure) => {
    setSelectedLeisure(leisure);
  };

  const onDelete = (id: number) => {
    onClose();
    dispatch(deleteLeisure(id));
  };

  return (
    <Box>
      <Header title="Leisure" handleClickOpen={handleClickOpen} />
      {stopwatch.isRunning ? (
        <LeisureStopWatch onSave={onSave} />
      ) : (
        <Container style={{ marginTop: "16px" }}>
          <Box style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => dispatch(startStopwatch("tummy time"))}
            >
              Tummy time
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => dispatch(startStopwatch("play time"))}
            >
              Play time
            </Button>
          </Box>
          <Box style={{ display: "flex", gap: "16px" }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => dispatch(startStopwatch("outdoors"))}
            >
              Outdoors
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => dispatch(startStopwatch("bath time"))}
            >
              Bath time
            </Button>
          </Box>
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
            {slicedList.map((leisure: any, i: number) => {
              const text = `${format(
                new Date(leisure.start),
                "p"
              )}, ${formatDuration(leisure.start, leisure.finish)}, ${
                leisure.type
              }`;

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
                <React.Fragment key={leisure.id}>
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
                    key={leisure.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleEdit(leisure)}
                      >
                        <MoreVertRounded />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: "#151e33" }}>
                        <IconType type={leisure.type} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={text} secondary={leisure.details} />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </InfiniteScroll>
        </List>
      </Box>

      <LeisureDialog
        selectedLeisure={selectedLeisure}
        onClose={onClose}
        onSave={onSave}
        onDelete={onDelete}
      />
    </Box>
  );
};
