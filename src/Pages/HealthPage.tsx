import { MoreVertRounded } from "@mui/icons-material";
import {
  Container,
  Button,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { Box } from "@mui/system";
import { format, isSameDay, isToday, isYesterday, subMinutes } from "date-fns";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { EndMessage } from "../Components/EndMessage";
import { Header } from "../Components/Header";
import { HealthDialog } from "../Components/HealthDialog";
import { IconType } from "../Components/IconType";
import { ScrollLoader } from "../Components/ScrollLoader";
import { useInfiniteScroll } from "../Hooks/infiniteScroll";
import { RootState } from "../Store/store";
import { formatDuration } from "./FeedPage";
import { useHealths, useAddHealth, useUpdateHealth, useDeleteHealth } from "../Hooks/useHealth";
import { Loader } from "../Components/Loader";

export type Health = {
  id: string;
  start: string;
  type: HealthType;
  value: string;
  details: string;
};

export type HealthType = "medication" | "temperature" | "vaccination";

export const HealthPage = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId || "");
  const { data: healthsList = [], isLoading } = useHealths(userId);
  const addHealthMutation = useAddHealth(userId);
  const updateHealthMutation = useUpdateHealth(userId);
  const deleteHealthMutation = useDeleteHealth(userId);


  const { fetchData, slicedList, dataLength, hasMore } =
    useInfiniteScroll(healthsList);
  const [health, setHealth] = useState<Health | undefined>(undefined);

  if (isLoading) {
    return <Loader message="Loading health records..." />;
  }


  const calcStartDate = () => {
    const defaultDate = subMinutes(new Date(), 15);
    return defaultDate.toString();
  };

  const handleClickOpen = (type?: HealthType) => {
    const newHealth: Health = {
      id: "",
      type: type ?? "medication",
      details: "",
      start: calcStartDate(),
      value: "",
    };
    setHealth(newHealth);
  };

  const onClose = () => {
    setHealth(undefined);
  };

  const onSave = async (newHealth: Health) => {
    onClose();

    try {
      if (newHealth.id === "") {
        await addHealthMutation.mutateAsync(newHealth);
      } else {
        await updateHealthMutation.mutateAsync(newHealth);
      }
    } catch (error) {
      console.error("Error saving health record:", error);
    }
  };

  const handleEdit = (health: Health) => {
    setHealth(health);
  };

  const hanleDelete = async (id: string) => {
    try {
      await deleteHealthMutation.mutateAsync(id);
      onClose();
    } catch (error) {
      console.error("Error deleting health record:", error);
    }
  };

  return (
    <Box>
      <Header title="Health" handleClickOpen={handleClickOpen} />
      <Container
        style={{
          marginTop: "16px",
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
        }}
      >
        <Box
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "16px",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleClickOpen("medication")}
          >
            Medication
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleClickOpen("temperature")}
          >
            Temperature
          </Button>
        </Box>
        <Box style={{ display: "flex", gap: "16px", flex: 1 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleClickOpen("vaccination")}
          >
            Vaccination
          </Button>
        </Box>
      </Container>
      <HealthDialog
        health={health}
        onClose={onClose}
        onSave={onSave}
        hanleDelete={hanleDelete}
      />

      <Box
        style={{
          marginTop: "16px",
        }}
      >
        <List dense={true}>
          <InfiniteScroll
            dataLength={dataLength}
            next={fetchData}
            hasMore={hasMore}
            loader={<ScrollLoader />}
            endMessage={<EndMessage dataLength={dataLength} />}
          >
            {slicedList.map((health, i: number) => {
              const text = `${format(new Date(health.start), "p")}`;

              const showValue = () => {
                if (health.value) {
                  return `${health.value} °C`;
                } else {
                  return "";
                }
              };

              const diff = formatDuration(
                slicedList[i].start,
                slicedList[i - 1]?.start ?? Date()
              );
              const dates = () => {
                if (isToday(new Date(slicedList[i].start))) {
                  return "Today";
                } else if (isYesterday(new Date(slicedList[i].start))) {
                  return "Yesterday";
                } else {
                  return format(new Date(slicedList[i].start), "LLL d EEEE");
                }
              };
              const isSameDate = isSameDay(
                new Date(slicedList[i - 1]?.start ?? Date()),
                new Date(slicedList[i].start)
              );

              return (
                <React.Fragment key={health.id}>
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
                        onClick={() => handleEdit(health)}
                      >
                        <MoreVertRounded />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: "#151e33" }}>
                        <IconType type={health.type} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${text}, ${health.type} ${showValue()}`}
                      secondary={health.details}
                    />
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