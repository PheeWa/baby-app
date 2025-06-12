import { MoreVertRounded } from "@mui/icons-material";
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
import { format, isSameDay, isToday, isYesterday } from "date-fns";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { EndMessage } from "../Components/EndMessage";
import { getLabel, getUnit, GrowthDialog } from "../Components/GrowthDialog";
import { Header } from "../Components/Header";
import { IconType } from "../Components/IconType";
import { ScrollLoader } from "../Components/ScrollLoader";
import { Loader } from "../Components/Loader";
import { useInfiniteScroll } from "../Hooks/infiniteScroll";
import { useGrowths, useAddGrowth, useUpdateGrowth, useDeleteGrowth } from "../Hooks/useGrowth";
import { RootState } from "../Store/store";
import { formatDuration } from "./FeedPage";

export type Growth = {
  id: string;
  type: GrowthType;
  value: string;
  start: string;
};

export type GrowthType = "weight" | "height" | "head";

export const GrowthPage = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId || "");
  const { data: growths = [], isLoading } = useGrowths(userId);
  const addGrowth = useAddGrowth(userId);
  const updateGrowth = useUpdateGrowth(userId);
  const deleteGrowth = useDeleteGrowth(userId);
  const [selectedGrowth, setSelectedGrowth] = useState<Growth | undefined>(undefined);

  const sortedGrowths = [...growths].sort((a, b) => {
    if (+new Date(a.start) < +new Date(b.start)) {
      return 1;
    } else return -1;
  });

  const { fetchData, slicedList, dataLength, hasMore } = useInfiniteScroll(sortedGrowths);

  const onSave = (newGrowth: Growth) => {
    setSelectedGrowth(undefined);

    if (newGrowth.id === "0") {
      addGrowth.mutate(newGrowth);
    } else {
      updateGrowth.mutate(newGrowth);
    }
  };

  const handleClose = () => {
    setSelectedGrowth(undefined);
  };

  const handleEdit = (growth: Growth) => {
    setSelectedGrowth(growth);
  };

  const createNewGrowth = (type: GrowthType) => {
    const newGrowth: Growth = {
      id: "0",
      start: new Date().toISOString(),
      value: "",
      type: type,
    };
    setSelectedGrowth(newGrowth);
  };

  const onDelete = (id: string) => {
    deleteGrowth.mutate(id);
    handleClose();
  };

  if (isLoading) {
    return <Loader message="Loading growth records..." />;
  }

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
            onClick={() => createNewGrowth("weight")}
          >
            Weight
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => createNewGrowth("height")}
          >
            Height
          </Button>
        </Box>
        <Box style={{ display: "flex", gap: "16px", flex: 1 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => createNewGrowth("head")}
          >
            Head
          </Button>
        </Box>
      </Container>
      <GrowthDialog
        onSave={onSave}
        growth={selectedGrowth}
        onClose={handleClose}
        onDelete={onDelete}
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
            {slicedList.map((growth, i: number) => {
              const text = `${format(new Date(growth.start), "p")}`;
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
                <React.Fragment key={growth.id}>
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
                        onClick={() => handleEdit(growth)}
                      >
                        <MoreVertRounded />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: "#151e33" }}>
                        <IconType type={growth.type} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${text} ,${getLabel(growth.type)},${growth.value
                        }${getUnit(growth.type)}`}
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
