import { DeleteRounded, MoreVertRounded } from "@mui/icons-material";
import { MobileDateTimePicker } from "@mui/lab";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { format, isSameDay, isToday, isYesterday, set } from "date-fns";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { EndMessage } from "../Components/EndMessage";
import { Header } from "../Components/Header";
import { IconType } from "../Components/IconType";
import { ScrollLoader } from "../Components/ScrollLoader";
import { Loader } from "../Components/Loader";
import { useInfiniteScroll } from "../Hooks/infiniteScroll";
import { useDiapers, useAddDiaper, useUpdateDiaper, useDeleteDiaper } from "../Hooks/useDiapers";
import { RootState } from "../Store/store";
import { formatDuration } from "./FeedPage";

export type Diaper = {
  id: string;
  start: string;
  type: string;
  details: string;
};

type DiaperType = "pee" | "poo" | "pee & poo";

export const DiapersPage = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId || "");
  const { data: diapersList = [], isLoading } = useDiapers(userId);
  const addDiaper = useAddDiaper(userId);
  const updateDiaper = useUpdateDiaper(userId);
  const deleteDiaper = useDeleteDiaper(userId);
  const { fetchData, slicedList, dataLength, hasMore } = useInfiniteScroll(diapersList);
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<Diaper | undefined>(undefined);

  const handleClickOpen = () => {
    setDialogOpen(true);

    setDate(Date());
    setType("pee");
    setDetails("");
  };

  const handleClose = () => {
    setDialogOpen(false);
    setIsEdit(undefined);
  };

  const onSave = () => {
    if (isEdit) {
      const newDiaper: Diaper = {
        ...isEdit,
        start: date,
        type: type,
        details: details,
      };
      updateDiaper.mutate(newDiaper);
    } else {
      const newDiaper: Omit<Diaper, 'id'> = {
        start: date,
        type: type,
        details: details,
      };
      addDiaper.mutate(newDiaper);
    }
    setDialogOpen(false);
  };

  const onEdit = (diaper: Diaper) => {
    setIsEdit(diaper);
    setDialogOpen(true);

    setDate(diaper.start);
    setType(diaper.type);
    setDetails(diaper.details);
  };

  const createDiaper = (type: DiaperType) => {
    const newDiaper: Omit<Diaper, 'id'> = {
      start: Date(),
      type: type,
      details: "",
    };
    addDiaper.mutate(newDiaper);
  };

  const onDelete = (id: string) => {
    handleClose();
    deleteDiaper.mutate(id);
  };

  if (isLoading) {
    return <Loader message="Loading diapers..." />;
  }

  return (
    <Box>
      <Header title="Diapers" handleClickOpen={handleClickOpen} />
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
            onClick={() => createDiaper("pee")}
          >
            Pee
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => createDiaper("poo")}
          >
            Poo
          </Button>
        </Box>
        <Box style={{ display: "flex", gap: "16px", flex: 1 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => createDiaper("pee & poo")}
          >
            Both
          </Button>
        </Box>
      </Container>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Diapers
          {isEdit ? (
            <IconButton
              aria-label="close"
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
              onClick={() => {
                onDelete(isEdit.id);
              }}
            >
              <DeleteRounded />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent>
          <Box style={{ display: "flex", marginBottom: "16px" }}>
            <MobileDateTimePicker
              showToolbar
              label="Date"
              value={date}
              onChange={(newValue) => {
                setDate(newValue?.toString() ?? "");
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth variant="standard" />
              )}
              maxDateTime={new Date()}
            />
          </Box>

          <Box style={{ display: "flex", marginBottom: "16px" }}>
            <FormControl variant="standard" fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Type
              </InputLabel>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <MenuItem value={"pee"}>Pee</MenuItem>
                <MenuItem value={"poo"}>Poo</MenuItem>
                <MenuItem value={"pee & poo"}>Pee & Poo</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box style={{ display: "flex", marginBottom: "16px" }}>
            <TextField
              label="Details"
              id="standard-basic"
              variant="standard"
              fullWidth
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onSave} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Box>
        <List dense={true}>
          <InfiniteScroll
            dataLength={dataLength}
            next={fetchData}
            hasMore={hasMore}
            loader={<ScrollLoader />}
            endMessage={<EndMessage dataLength={dataLength} />}
          >
            {slicedList.map((diaper, i: number) => {
              const text = `${format(new Date(diaper.start), "p")}`;
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
                <React.Fragment key={diaper.id}>
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
                        onClick={() => onEdit(diaper)}
                      >
                        <MoreVertRounded />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: "#151e33" }}>
                        <IconType type={diaper.type} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${text} ,${diaper.type}`}
                      secondary={diaper.details}
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
