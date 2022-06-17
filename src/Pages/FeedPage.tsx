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
  subMinutes,
} from "date-fns";
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

  const date = addSeconds(new Date(0), diff);
  const x = addHours(date, 12);
  if (diff < 60) {
    return format(x, "ss's'");
  } else if (diff < 3600) {
    return format(x, "m'm'ss's'");
  }
  return format(x, "H'h'mm'm'");
};

export const FeedPage = () => {
  const feedings = useSelector((state: RootState) => state.feed.feedings);

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
          {feedings.map((feeding: Feeding) => {
            const text = `${format(
              new Date(feeding.start),
              "p"
            )}, ${formatDuration(feeding.start, feeding.finish)}, ${
              feeding.type
            }`;

            return (
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
