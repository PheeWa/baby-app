import { MoreVertRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  addSeconds,
  differenceInSeconds,
  format,
  startOfYear,
} from "date-fns";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector, useDispatch } from "react-redux";
import { EndMessage } from "../Components/EndMessage";
import { FeedingDialog } from "../Components/FeedingDialog";
import { Header } from "../Components/Header";
import { IconType } from "../Components/IconType";
import { ScrollLoader } from "../Components/ScrollLoader";
import { StopWatch, getFeedText } from "../Components/StopWatch";
import { useFeedings, useAddFeeding, useUpdateFeeding, useDeleteFeeding } from "../Hooks/useFeedings";
import { Feeding, FeedingType, FeedingStopwatch } from "../Types/feeding";
import { RootState } from "../Store/store";
import { updateStopwatch, startStopwatch, stopStopwatch } from "../Store/feedSlice";
import { Loader } from '../Components/Loader';

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
  const userId = useSelector((state: RootState) => state.auth.user);
  const { data: feedings = [], isLoading } = useFeedings(userId?.userId || "");
  const stopwatch = useSelector((state: RootState) => state.feed.stopwatch);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedFeeding, setSelectedFeeding] = useState<Feeding | null>(null);

  const addFeeding = useAddFeeding(userId?.userId || "");
  const updateFeeding = useUpdateFeeding(userId?.userId || "");
  const deleteFeeding = useDeleteFeeding(userId?.userId || "");

  const handleStartStopwatch = (type: FeedingType) => {
    dispatch(startStopwatch(type));
  };

  const handleStopStopwatch = () => {
    dispatch(stopStopwatch());
  };

  const handleUpdateStopwatch = (updatedStopwatch: FeedingStopwatch) => {
    dispatch(updateStopwatch(updatedStopwatch));
  };

  const handleSaveFeeding = (feeding: Feeding) => {
    if (feeding.id === "0") {
      addFeeding.mutate(feeding);
    } else {
      updateFeeding.mutate(feeding);
    }
    setOpen(false);
    setSelectedFeeding(null);
    handleStopStopwatch();
  };

  const handleDeleteFeeding = (id: string) => {
    deleteFeeding.mutate(id);
    setOpen(false);
    setSelectedFeeding(null);
  };

  const handleClickOpen = (feeding: Feeding | null = null) => {
    if (feeding === null) {
      const newFeeding: Feeding = {
        id: "0",
        type: "left breast",
        details: "",
        start: new Date().toISOString(),
        finish: new Date().toISOString(),
        amount: undefined,
        contents: "",

      };
      setSelectedFeeding(newFeeding);
    } else {
      setSelectedFeeding(feeding);
    }
    setOpen(true);
  };


  if (isLoading) {
    return <Loader message="Loading feedings..." />;
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Header title="Feeding" handleClickOpen={() => handleClickOpen()} />
      <Box sx={{ p: 2 }}>
        <StopWatch
          stopwatch={stopwatch}
          onStart={handleStartStopwatch}
          onStop={handleStopStopwatch}
          onUpdate={handleUpdateStopwatch}
          onSave={handleSaveFeeding}
          onOpenDialog={() => handleClickOpen()}
        />
      </Box>

      <Container>
        <List dense={true}>
          <InfiniteScroll
            dataLength={feedings.length}
            next={() => { }}
            hasMore={false}
            loader={<ScrollLoader />}
            endMessage={<EndMessage dataLength={feedings.length} />}
          >
            {feedings.map((feeding) => (
              <ListItem
                key={feeding.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleClickOpen(feeding)}
                  >
                    <MoreVertRounded />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <IconType type={feeding.type} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={getFeedText(feeding.type)}
                  secondary={
                    <>
                      {format(new Date(feeding.start), "h:mm a")} -{" "}
                      {format(new Date(feeding.finish), "h:mm a")}
                      {feeding.details && (
                        <>
                          <br />
                          {feeding.details}
                        </>
                      )}
                      {feeding.amount && (
                        <>
                          <br />
                          {feeding.amount}ml {feeding.contents}
                        </>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </InfiniteScroll>
        </List>
      </Container>

      {selectedFeeding && (
        <FeedingDialog
          open={open}
          feeding={selectedFeeding}
          onClose={() => {
            setOpen(false);
            setSelectedFeeding(null);
          }}
          onSave={handleSaveFeeding}
          onDelete={handleDeleteFeeding}
        />
      )}
    </Box>
  );
};
