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
  isSameDay,
  isToday,
  isYesterday,
  subMinutes,
} from "date-fns";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Header } from "../Components/Header";
import { LeisureDialog } from "../Components/LeisureDialog";
import { LeisureStopWatch } from "../Components/LeisureStopWatch";
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
  // const [isStopwatch, setIsStopwatch] = useState<LeisureType | undefined>(
  //   undefined
  // );

  // functions are here//

  const leisuresList = useSelector((state: RootState) => {
    return [...state.leisure.leisures].sort((a, b) => {
      if (+new Date(a.start) < +new Date(b.start)) {
        return 1;
      } else return -1;
    });
  });
  const stopwatch = useSelector((state: RootState) => state.leisure.stopwatch);
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
    // setfeedings(feedings.filter((feeding) => feeding.id !== id));
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
              color="secondary"
              startIcon={<ForkLeftRounded />}
              onClick={() => dispatch(startStopwatch("tummy time"))}
            >
              Tummy time
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<ForkLeftRounded />}
              // onClick={() => setIsStopwatch("play time")}
              onClick={() => dispatch(startStopwatch("play time"))}
            >
              Play time
            </Button>
          </Box>
          <Box style={{ display: "flex", gap: "16px" }}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<ForkLeftRounded />}
              // onClick={() => setIsStopwatch("outdoors")}
              onClick={() => dispatch(startStopwatch("outdoors"))}
            >
              Outdoors
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<ForkLeftRounded />}
              // onClick={() => setIsStopwatch("bath time")}
              onClick={() => dispatch(startStopwatch("bath time"))}
            >
              Bath time
            </Button>
          </Box>
        </Container>
      )}

      <Box>
        <List dense={true}>
          {leisuresList.map((leisure: any, i: number) => {
            const text = `${format(
              new Date(leisure.start),
              "p"
            )}, ${formatDuration(leisure.start, leisure.finish)}, ${
              leisure.type
            }`;

            const diff = formatDuration(
              leisuresList[i].finish,
              leisuresList[i - 1]?.start ?? Date()
            );

            const dates = () => {
              if (isToday(new Date(leisuresList[i].finish))) {
                return "Today";
              } else if (isYesterday(new Date(leisuresList[i].finish))) {
                return "Yesterday";
              } else {
                return format(new Date(leisuresList[i].finish), "LLL d EEEE");
              }
            };
            const isSameDate = isSameDay(
              new Date(leisuresList[i - 1]?.finish ?? Date()),
              new Date(leisuresList[i].finish)
            );

            return (
              <>
                {!isSameDate && (
                  <ListItem
                    key={leisure.id + "showdates"}
                    style={{ paddingTop: 0, paddingBottom: 0 }}
                  >
                    <ListItemText
                      style={{ marginTop: 0, marginBottom: 0 }}
                      primary={dates()}
                      // secondary={diff}
                    />
                  </ListItem>
                )}
                <ListItem
                  key={leisure.id + "-showDiff"}
                  style={{ paddingTop: 0, paddingBottom: 0 }}
                >
                  <ListItemAvatar style={{ opacity: 0, height: 0 }}>
                    <Avatar>
                      <MoreVertRounded />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    style={{ marginTop: 0, marginBottom: 0 }}
                    // primary={text}
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
                    <Avatar>
                      <MoreVertRounded />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={text} secondary={leisure.details} />
                  {/* <ListItemText
                    primary={leisure.id}
                    secondary={leisure.details}
                  /> */}
                </ListItem>
              </>
            );
          })}
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
