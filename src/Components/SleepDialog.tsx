import { DeleteRounded } from "@mui/icons-material";
import { MobileDateTimePicker } from "@mui/lab";
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Box,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Sleep } from "../Pages/SleepPage";

type Props = {
  selectedSleep?: Sleep;
  onClose: () => void;
  onSave: (sleep: Sleep) => void;
  onDelete: (id: number) => void;
};

export const SleepDialog = (props: Props) => {
  //usestate//
  const [start, setStart] = useState("");
  const [finish, setFinish] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (props.selectedSleep) {
      setStart(props.selectedSleep.start);
      setFinish(props.selectedSleep.finish);
      setDetails(props.selectedSleep.details);
    }
  }, [props.selectedSleep]);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={!!props.selectedSleep}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Sleep
        {props.selectedSleep?.id ? (
          <IconButton
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            onClick={() => {
              if (props.selectedSleep?.id) {
                props.onDelete(props.selectedSleep?.id);
              }
            }}
          >
            <DeleteRounded />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent>
        <Box style={{ display: "flex", marginBottom: "16px" }}>
          <MobileDateTimePicker
            // openTo="hours"
            label="Start"
            value={start}
            showToolbar
            onChange={(newValue) => {
              setStart(newValue?.toString() ?? "");
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth variant="standard" />
            )}
            maxDateTime={new Date(finish)}
          />
        </Box>
        <Box style={{ display: "flex", marginBottom: "16px" }}>
          <MobileDateTimePicker
            label="Finish"
            value={finish}
            showToolbar
            onChange={(newValue) => {
              setFinish(newValue?.toString() ?? "");
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth variant="standard" />
            )}
            maxDateTime={new Date()}
            minDateTime={new Date(start)}
          />
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
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          onClick={() => {
            props.onSave({
              id: props.selectedSleep?.id ?? 0,
              type: "Sleep",
              start,
              finish,
              details,
            });
          }}
          autoFocus
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
