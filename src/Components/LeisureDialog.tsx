import { DeleteRounded } from "@mui/icons-material";
import { MobileDateTimePicker } from "@mui/lab";
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  DialogActions,
  Button,
  InputLabel,
} from "@mui/material";
import { type } from "@testing-library/user-event/dist/type";
import React, { useEffect, useState } from "react";
import { start } from "repl";
import { Leisure, LeisureType } from "../Pages/LeisurePage";

type Props = {
  onClose: () => void;
  selectedLeisure?: Leisure;
  onSave: (newLeisure: Leisure) => void;
  onDelete: (id: number) => void;
};

export const LeisureDialog = (props: Props) => {
  //usestates are here//

  const [start, setStart] = useState("");
  const [finish, setFinish] = useState("");
  const [type, setType] = useState<LeisureType>("tummy time");
  const [details, setDetails] = useState("");

  //functions//
  useEffect(() => {
    if (props.selectedLeisure) {
      setType(props.selectedLeisure?.type);
      setStart(props.selectedLeisure?.start);
      setFinish(props.selectedLeisure?.finish);
      setDetails(props.selectedLeisure?.details);
    }
  }, [props.selectedLeisure]);

  return (
    <Dialog
      fullWidth
      open={!!props.selectedLeisure}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Leisure
        {props.selectedLeisure?.id ? (
          <IconButton
            aria-label="close"
            // onClick={props.onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            onClick={() => {
              if (props.selectedLeisure?.id) {
                props.onDelete(props.selectedLeisure?.id);
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
            label="Start"
            showToolbar
            // openTo="hours"
            value={start}
            onChange={(newValue) => {
              setStart(newValue ?? "");
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth variant="standard" />
            )}
          />
        </Box>
        <Box style={{ display: "flex", marginBottom: "16px" }}>
          <MobileDateTimePicker
            label="Finish"
            showToolbar
            // openTo="hours"
            value={finish}
            onChange={(newValue) => {
              setFinish(newValue ?? "");
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
            <Select
              value={type}
              onChange={(e) => {
                setType(e.target.value as LeisureType);
              }}
            >
              <MenuItem value={"tummy time"}>Tummy Time</MenuItem>
              <MenuItem value={"play time"}>Play Time</MenuItem>
              <MenuItem value={"outdoors"}>Outdoors</MenuItem>
              <MenuItem value={"bath time"}>Bath Time</MenuItem>
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
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          onClick={() => {
            props.onSave({
              id: props.selectedLeisure?.id ?? 0,
              start,
              finish,
              type,
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
