import { ForkLeftRounded, MoreVertRounded } from "@mui/icons-material";
import {
  Container,
  Box,
  Button,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

import { time } from "console";
import { format, isSameDay, isToday, isYesterday } from "date-fns";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLabel, getUnit, GrowthDialog } from "../Components/GrowthDialog";
import { Header } from "../Components/Header";
import { addGrowth, deleteGrowth, editGrowth } from "../Store/growthSlice";
import { RootState } from "../Store/store";
import { formatDuration } from "./FeedPage";

export type Growth = {
  id: number;
  type: GrowthType;
  value: string;
  start: string;
};

export type GrowthType = "weight" | "height" | "head";

export const GrowthPage = () => {
  const growthsList = useSelector((state: RootState) => {
    return [...state.growth.growths].sort((a, b) => {
      if (+new Date(a.start) < +new Date(b.start)) {
        return 1;
      } else return -1;
    });
  });
  const dispatch = useDispatch();

  //usestate//
  // const [growths, setGrowths] = useState<Growth[]>([]);
  // const [type, setType] = useState<GrowthType | undefined>(undefined);
  const [growth, setGrowth] = useState<Growth | undefined>(undefined);

  //functions//
  const onSave = (newGrowth: Growth) => {
    setGrowth(undefined);

    if (newGrowth.id === 0) {
      const newGrowthWithId = { ...newGrowth, id: Math.random() };
      dispatch(addGrowth(newGrowthWithId));
    } else {
      dispatch(editGrowth(newGrowth));
    }
  };

  const handleClose = () => {
    setGrowth(undefined);
  };

  const handleEdit = (growth: Growth) => {
    setGrowth(growth);
  };

  const createNewGrowth = (type: GrowthType) => {
    const newGrowth: Growth = {
      id: 0,
      start: Date(),
      value: "",
      type: type,
    };
    setGrowth(newGrowth);
  };

  const onDelete = (id: number) => {
    dispatch(deleteGrowth(id));
    handleClose();
  };

  return (
    <Box>
      <Header title="Growth" />
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
            onClick={() => createNewGrowth("weight")}
          >
            Weight
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<ForkLeftRounded />}
            onClick={() => createNewGrowth("height")}
          >
            Height
          </Button>
        </Box>
        <Box style={{ display: "flex", gap: "16px", flex: 1 }}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<ForkLeftRounded />}
            onClick={() => createNewGrowth("head")}
          >
            Head
          </Button>
        </Box>
      </Container>
      <GrowthDialog
        onSave={onSave}
        growth={growth}
        onClose={handleClose}
        onDelete={onDelete}
      />

      <Box>
        <List dense={true}>
          {growthsList.map((growth, i: number) => {
            const text = `${format(new Date(growth.start), "p")}`;
            const diff = formatDuration(
              growthsList[i].start,
              growthsList[i - 1]?.start ?? Date()
            );

            const dates = () => {
              if (isToday(new Date(growthsList[i].start))) {
                return "Today";
              } else if (isYesterday(new Date(growthsList[i].start))) {
                return "Yesterday";
              } else {
                return format(new Date(growthsList[i].start), "LLL d EEEE");
              }
            };
            const isSameDate = isSameDay(
              new Date(growthsList[i - 1]?.start ?? Date()),
              new Date(growthsList[i].start)
            );

            return (
              <>
                {!isSameDate && (
                  <ListItem
                    key={growth.id + "showdates"}
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
                  key={growth.id + "-showDiff"}
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
                      onClick={() => handleEdit(growth)}
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
                    primary={`${text} ,${getLabel(growth.type)},${
                      growth.value
                    }${getUnit(growth.type)}`}
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
