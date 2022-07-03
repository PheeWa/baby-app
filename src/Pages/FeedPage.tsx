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
  Typography,
} from "@mui/material";
import {
  addHours,
  addSeconds,
  differenceInSeconds,
  format,
  getDate,
  isSameDay,
  isToday,
  isYesterday,
  startOfYear,
  subMinutes,
} from "date-fns";
import { differenceInMinutes } from "date-fns/esm";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FeedingDialog } from "../Components/FeedingDialog";
import { Header } from "../Components/Header";
import { StopWatch } from "../Components/StopWatch";
import {
  addFeed,
  deleteFeed,
  editFeed,
  startStopwatch,
  stopStopwatch,
} from "../Store/feedSlice";
import { RootState } from "../Store/store";

export type Feeding = {
  id: number;
  type: string;
  details: string;
  start: string;
  finish: string;
  amount?: number;
  contents: string;
};

export type FeedingType = "left breast" | "right breast" | "bottle" | "meal";

export const formatDuration = (start: string, finish: string) => {
  const diff = differenceInSeconds(new Date(finish), new Date(start));
  const date = addSeconds(startOfYear(new Date()), diff);
  if (diff < 60) {
    return format(date, "ss's'");
  } else if (diff < 3600) {
    return format(date, "m'm'");
  } else if (diff < 86400) {
    return format(date, "H'h'mm'm'");
  }
  return format(date, "D'd'H'h'", {
    useAdditionalDayOfYearTokens: true,
  });
};

export const FeedPage = () => {
  const feedingsList = useSelector((state: RootState) => {
    return [...state.feed.feedings].sort((a, b) => {
      if (+new Date(a.start) < +new Date(b.start)) {
        return 1;
      } else return -1;
    });
  });

  const stopwatch = useSelector((state: RootState) => state.feed.stopwatch);
  const dispatch = useDispatch();

  // ........useStates.....
  const [selectedFeeding, setSelectedFeeding] = useState<Feeding | undefined>(
    undefined
  );
  // const [isStopwatch, setIsStopwatch] = useState<FeedingType | undefined>(
  //   undefined
  // );

  const onSave = (newFeeding: Feeding) => {
    handleClose();
    // setIsStopwatch(undefined);
    dispatch(stopStopwatch());
    if (newFeeding.id === 0) {
      const newFeedingWithId = { ...newFeeding, id: Math.random() };
      dispatch(addFeed(newFeedingWithId));
    } else {
      dispatch(editFeed(newFeeding));
    }
  };

  const onDelete = (id: number) => {
    handleClose();
    dispatch(deleteFeed(id));
    // setfeedings(feedings.filter((feeding) => feeding.id !== id));
  };

  const calcStartDate = () => {
    const defaultDate = subMinutes(new Date(), 15);
    return defaultDate.toString();
  };

  const handleClickOpen = () => {
    const newFeeding: Feeding = {
      id: 0,
      type: "left breast",
      details: "",
      start: calcStartDate(),
      finish: Date(),
      amount: undefined,
      contents: "",
    };
    setSelectedFeeding(newFeeding);
  };

  const handleEdit = (feeding: Feeding) => {
    setSelectedFeeding(feeding);
  };

  const handleClose = () => {
    setSelectedFeeding(undefined);
  };

  return (
    <Box>
      <Header handleClickOpen={handleClickOpen} title={"Feeding"} />

      {stopwatch.isRunning ? (
        <StopWatch onSave={onSave} feedingType={stopwatch.type} />
      ) : (
        <Container style={{ marginTop: "16px" }}>
          <Box style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<ForkLeftRounded />}
              onClick={() => dispatch(startStopwatch("left breast"))}
            >
              Left
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<ForkLeftRounded />}
              onClick={() => dispatch(startStopwatch("right breast"))}
            >
              Right
            </Button>
          </Box>
          <Box style={{ display: "flex", gap: "16px" }}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<ForkLeftRounded />}
              onClick={() => dispatch(startStopwatch("bottle"))}
            >
              Bottle
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<ForkLeftRounded />}
              onClick={() => dispatch(startStopwatch("meal"))}
            >
              Meal
            </Button>
          </Box>
        </Container>
      )}

      <Box>
        <List dense={true}>
          {feedingsList.map((feeding: Feeding, i: number) => {
            const text = `${format(
              new Date(feeding.start),
              "p"
            )}, ${formatDuration(feeding.start, feeding.finish)}, ${
              feeding.type
            }`;
            const diff = formatDuration(
              feedingsList[i].finish,
              feedingsList[i - 1]?.start ?? Date()
            );
            const showDiff = differenceInSeconds(
              new Date(feedingsList[i - 1]?.start ?? Date()),
              new Date(feedingsList[i].finish)
            );
            const dates = () => {
              if (isToday(new Date(feedingsList[i].finish))) {
                return "Today";
              } else if (isYesterday(new Date(feedingsList[i].finish))) {
                return "Yesterday";
              } else {
                return format(new Date(feedingsList[i].finish), "LLL d EEEE");
              }
            };
            const isSameDate = isSameDay(
              new Date(feedingsList[i - 1]?.finish ?? Date()),
              new Date(feedingsList[i].finish)
            );

            return (
              <>
                {!isSameDate && (
                  <ListItem
                    key={feeding.id + "showdates"}
                    style={{ paddingTop: 0, paddingBottom: 0 }}
                  >
                    <ListItemText
                      style={{ marginTop: 0, marginBottom: 0 }}
                      primary={dates()}
                      // secondary={diff}
                    />
                  </ListItem>
                )}
                {showDiff > 3600 && (
                  <ListItem
                    key={feeding.id + "-showDiff"}
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
                )}
                <ListItem
                  key={feeding.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleEdit(feeding)}
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
                  <ListItemText primary={text} secondary={feeding.details} />
                </ListItem>
              </>
            );
          })}
        </List>
      </Box>
      <FeedingDialog
        onClose={handleClose}
        onSave={onSave}
        selectedFeeding={selectedFeeding}
        onDelete={onDelete}
      />
    </Box>
  );
};
