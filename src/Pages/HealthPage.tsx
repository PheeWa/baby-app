import { ForkLeftRounded, MoreVertRounded } from "@mui/icons-material";
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
import { useDispatch, useSelector } from "react-redux";
import { Header } from "../Components/Header";
import { HealthDialog } from "../Components/HealthDialog";
import { addHealth, deleteHealth, editHealth } from "../Store/healthSlice";
import { RootState } from "../Store/store";
import { formatDuration } from "./FeedPage";

export type Health = {
  id: number;
  start: string;
  type: HealthType;
  value: string;
  details: string;
};

export type HealthType = "medication" | "temperature" | "vaccination";

export const HealthPage = () => {
  const healthsList = useSelector((state: RootState) => {
    return [...state.health.healths].sort((a, b) => {
      if (+new Date(a.start) < +new Date(b.start)) {
        return 1;
      } else return -1;
    });
  });
  const dispatch = useDispatch();
  //usestates//
  const [health, setHealth] = useState<Health | undefined>(undefined);

  //functions//
  const calcStartDate = () => {
    const defaultDate = subMinutes(new Date(), 15);
    return defaultDate.toString();
  };

  const handleClickOpen = (type?: HealthType) => {
    const newHealth: Health = {
      id: 0,
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

  const onSave = (newHealth: Health) => {
    onClose();

    if (newHealth.id === 0) {
      const newHealthWithId = { ...newHealth, id: Math.random() };
      dispatch(addHealth(newHealthWithId));
    } else {
      dispatch(editHealth(newHealth));
    }
  };

  const handleEdit = (health: Health) => {
    setHealth(health);
  };

  const hanleDelete = (id: number) => {
    dispatch(deleteHealth(id));
    onClose();
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
            color="secondary"
            startIcon={<ForkLeftRounded />}
            onClick={() => handleClickOpen("medication")}
          >
            Medication
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<ForkLeftRounded />}
            onClick={() => handleClickOpen("temperature")}
          >
            Temperature
          </Button>
        </Box>
        <Box style={{ display: "flex", gap: "16px", flex: 1 }}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<ForkLeftRounded />}
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

      <Box>
        <List dense={true}>
          {healthsList.map((health, i: number) => {
            const text = `${format(new Date(health.start), "p")}`;

            const showValue = () => {
              if (health.value) {
                return `${health.value} °C`;
              } else {
                return "";
              }
            };

            const diff = formatDuration(
              healthsList[i].start,
              healthsList[i - 1]?.start ?? Date()
            );
            const dates = () => {
              if (isToday(new Date(healthsList[i].start))) {
                return "Today";
              } else if (isYesterday(new Date(healthsList[i].start))) {
                return "Yesterday";
              } else {
                return format(new Date(healthsList[i].start), "LLL d EEEE");
              }
            };
            const isSameDate = isSameDay(
              new Date(healthsList[i - 1]?.start ?? Date()),
              new Date(healthsList[i].start)
            );

            return (
              <>
                {!isSameDate && (
                  <ListItem
                    key={health.id + "showdates"}
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
                  key={health.id + "-showDiff"}
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
                    <Avatar>
                      <MoreVertRounded />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${text}, ${health.type} ${showValue()}`}
                    secondary={health.details}
                  />
                </ListItem>
              </>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};
