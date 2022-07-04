import {
  DeleteRounded,
  ForkLeftRounded,
  MoreVertRounded,
} from "@mui/icons-material";
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
  Typography,
} from "@mui/material";
import { type } from "@testing-library/user-event/dist/type";
import { format, isSameDay, isToday, isYesterday, set } from "date-fns";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector, useDispatch } from "react-redux";
import { start } from "repl";
import { text } from "stream/consumers";
import { EndMessage } from "../Components/EndMessage";
import { Header } from "../Components/Header";
import { ScrollLoader } from "../Components/ScrollLoader";
import { useInfiniteScroll } from "../Hooks/infiniteScroll";
import {
  addDiaper,
  deleteDiaper,
  editDiaper,
  recordDiaper,
} from "../Store/diaperSlice";
import { RootState } from "../Store/store";
import { formatDuration } from "./FeedPage";

export type Diaper = {
  id: number;
  start: string;
  type: string;
  details: string;
};

type DiaperType = "pee" | "poo" | "pee & poo";

export const DiapersPage = () => {
  const diapersList = useSelector((state: RootState) => {
    return [...state.diaper.diapers].sort((a, b) => {
      if (+new Date(a.start) < +new Date(b.start)) {
        return 1;
      } else return -1;
    });
  });

  //Hooks//
  const dispatch = useDispatch();
  const { limit, fetchData, slicedList, dataLength, hasMore } =
    useInfiniteScroll(diapersList);

  //usetates//

  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  // const [diapers, setDiapers] = useState<Diaper[]>([]);
  const [isEdit, setIsEdit] = useState<Diaper | undefined>(undefined);

  //functions//

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
      dispatch(editDiaper(newDiaper));
    } else {
      const newDiaper: Diaper = {
        id: Math.floor(Math.random() * 100),
        start: date,
        type: type,
        details: details,
      };
      dispatch(addDiaper(newDiaper));
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
    const newDiaper = {
      id: Math.floor(Math.random() * 100),
      start: Date(),
      type: type,
      details: "",
    };
    dispatch(recordDiaper(newDiaper));
  };

  const onDelete = (id: number) => {
    handleClose();
    dispatch(deleteDiaper(id));
  };

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
            // color="secondary"
            startIcon={<ForkLeftRounded />}
            onClick={() => createDiaper("pee")}
          >
            Pee
          </Button>
          <Button
            fullWidth
            variant="contained"
            // color="secondary"
            startIcon={<ForkLeftRounded />}
            onClick={() => createDiaper("poo")}
          >
            Poo
          </Button>
        </Box>
        <Box style={{ display: "flex", gap: "16px", flex: 1 }}>
          <Button
            fullWidth
            variant="contained"
            // color="secondary"
            startIcon={<ForkLeftRounded />}
            onClick={() => createDiaper("pee & poo")}
          >
            Both
          </Button>
        </Box>
      </Container>

      <Dialog
        fullWidth
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
              // onClick={onClose}
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
              // openTo="hours"
              value={date}
              onChange={(newValue) => {
                setDate(newValue ?? "");
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth variant="standard" />
              )}
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
            endMessage={<EndMessage />}
          >
            {slicedList.map((diaper, i: number) => {
              const text = `${format(new Date(diaper.start), "p")}`;
              const diff = formatDuration(
                slicedList[i].start,
                slicedList[i - 1]?.start ?? Date()
              );
              // console.log("hahahha", diff);
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
                <>
                  {!isSameDate && (
                    <ListItem
                      key={diaper.id + "showdates"}
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
                    key={diaper.id + "-showDiff"}
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
                        onClick={() => onEdit(diaper)}
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
                      primary={`${text} ,${diaper.type}`}
                      secondary={diaper.details}
                    />
                  </ListItem>
                </>
              );
            })}
          </InfiniteScroll>
        </List>
      </Box>
    </Box>
  );
};
