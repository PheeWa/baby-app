import { MoreVertRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { format, isToday, isYesterday } from "date-fns";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector, useDispatch } from "react-redux";
import { EndMessage } from "../Components/EndMessage";
import { Header } from "../Components/Header";
import { IconType } from "../Components/IconType";
import { ScrollLoader } from "../Components/ScrollLoader";
import { SleepDialog } from "../Components/SleepDialog";
import { SleepStopWatch } from "../Components/SleepStopWatch";
import { useSleeps, useAddSleep, useUpdateSleep, useDeleteSleep } from "../Hooks/useSleeps";
import { Sleep } from "../Types/sleep";
import { formatDuration } from "./FeedPage";
import { startSleepWatch } from "../Store/SleepSlice";
import { Loader } from '../Components/Loader';

export const SleepPage = () => {
  const userId = useSelector((state: any) => state.auth.user?.userId || "");
  const { data: sleeps = [], isLoading } = useSleeps(userId);
  const addSleep = useAddSleep(userId);
  const updateSleep = useUpdateSleep(userId);
  const deleteSleep = useDeleteSleep(userId);
  const [selectedSleep, setSelectedSleep] = useState<Sleep | undefined>(undefined);
  const dispatch = useDispatch();
  const sleepStopwatch = useSelector((state: any) => state.sleep.sleepStopwatch);

  const handleClickOpen = (sleep?: Sleep) => {
    if (sleep) {
      setSelectedSleep(sleep);
    } else {
      setSelectedSleep({
        id: "0",
        type: "Sleep",
        start: new Date().toISOString(),
        finish: new Date().toISOString(),
        details: "",
      });
    }
  };

  const onClose = () => setSelectedSleep(undefined);

  const onSave = (sleep: Sleep) => {
    if (sleep.id === "0") {
      addSleep.mutate(sleep);
    } else {
      updateSleep.mutate(sleep);
    }
    setSelectedSleep(undefined);
  };

  const onDelete = (id: string) => {
    deleteSleep.mutate(id);
    setSelectedSleep(undefined);
  };

  if (isLoading) {
    return <Loader message="Loading sleeps..." />;
  }

  return (
    <Box>
      <Header title="Sleep" handleClickOpen={() => handleClickOpen()} />
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
            dataLength={sleeps.length}
            next={() => { }}
            hasMore={false}
            loader={<ScrollLoader />}
            endMessage={<EndMessage dataLength={sleeps.length} />}
          >
            {sleeps.map((sleep, i) => {
              const text = `${format(
                new Date(sleep.start),
                "p"
              )}, ${formatDuration(sleep.start, sleep.finish)}`;
              const dates = () => {
                if (isToday(new Date(sleep.finish))) {
                  return "Today";
                } else if (isYesterday(new Date(sleep.finish))) {
                  return "Yesterday";
                } else {
                  return format(new Date(sleep.finish), "LLL d EEEE");
                }
              };
              return (
                <ListItem
                  key={sleep.id}
                  onClick={() => handleClickOpen(sleep)}
                  style={{ cursor: "pointer" }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <IconType type="Sleep" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={text}
                    secondary={dates()}
                  />
                </ListItem>
              );
            })}
          </InfiniteScroll>
        </List>
      </Box>
    </Box>
  );
};
