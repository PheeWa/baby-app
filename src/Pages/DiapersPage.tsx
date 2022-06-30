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
import { format, set } from "date-fns";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { start } from "repl";
import { text } from "stream/consumers";
import { Header } from "../Components/Header";
import {
  addDiaper,
  deleteDiaper,
  editDiaper,
  recordDiaper,
} from "../Store/diaperSlice";
import { RootState } from "../Store/store";

export type Diaper = {
  id: number;
  start: string;
  type: string;
  details: string;
};

type DiaperType = "pee" | "poo" | "pee & poo";

export const DiapersPage = () => {
  const diapers = useSelector((state: RootState) => state.diaper.diapers);
  const dispatch = useDispatch();

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
            color="secondary"
            startIcon={<ForkLeftRounded />}
            onClick={() => createDiaper("pee")}
          >
            Pee
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
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
            color="secondary"
            startIcon={<ForkLeftRounded />}
            onClick={() => createDiaper("pee & poo")}
          >
            Both
          </Button>
        </Box>
      </Container>

      <Dialog
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
          <Box style={{ display: "flex" }}>
            <MobileDateTimePicker
              showToolbar
              label="Date"
              // openTo="hours"
              value={date}
              onChange={(newValue) => {
                setDate(newValue ?? "");
              }}
              renderInput={(params) => (
                <TextField {...params} variant="standard" />
              )}
            />
          </Box>

          <Box style={{ display: "flex" }}>
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

          <Box style={{ display: "flex" }}>
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
          {diapers.map((diaper) => {
            const text = `${format(new Date(diaper.start), "p")}`;

            return (
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
            );
          })}
        </List>
      </Box>
    </Box>
  );
};
