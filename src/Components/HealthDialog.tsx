import { DeleteRounded } from "@mui/icons-material";
// import { MobileDateTimePicker } from "@mui/lab";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
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
  Input,
  InputAdornment,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { Health, HealthType } from "../Pages/HealthPage";

type Props = {
  health?: Health;
  onClose: () => void;
  onSave: (newHealth: Health) => void;
  hanleDelete: (id: number) => void;
};

export const HealthDialog = (props: Props) => {
  //usestates//
  const [date, setDate] = useState("");
  const [type, setType] = useState<HealthType>("medication");
  const [value, setValue] = useState("");
  const [details, setDetails] = useState("");
  //functions//
  useEffect(() => {
    if (props.health) {
      setDate(props.health.start);
      setType(props.health.type);
      setDetails(props.health.details);
      setValue(props.health.value);
    }
  }, [props.health]);

  return (
    <Dialog
      fullWidth
      open={!!props.health}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Health
        {props.health?.id ? (
          <IconButton
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            onClick={() => {
              if (props.health?.id) {
                props.hanleDelete(props.health?.id);
              }
            }}
          >
            <DeleteRounded />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent>
        <Box style={{ display: "flex" }}>
          <Typography variant="body1" component="p">
            Date
          </Typography>

          <MobileDateTimePicker
            openTo="hours"
            value={date}
            onChange={(newValue) => {
              setDate(newValue ?? "");
            }}
            renderInput={(params) => (
              <TextField {...params} variant="standard" fullWidth />
            )}
          />
        </Box>

        <Box style={{ display: "flex" }}>
          <Typography variant="body1" component="p">
            Type
          </Typography>
          <FormControl variant="standard" fullWidth>
            <Select
              value={type}
              onChange={(e) => {
                setType(e.target.value as HealthType);
              }}
            >
              <MenuItem value={"medication"}>Medication</MenuItem>
              <MenuItem value={"temperature"}>Temperature</MenuItem>
              <MenuItem value={"vaccination"}>Vaccination</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {type === "temperature" ? (
          <Box style={{ display: "flex" }}>
            <Typography variant="body1" component="p">
              Value
            </Typography>
            <FormControl sx={{ m: 1, width: "25ch" }} variant="standard">
              <Input
                id="filled-adornment-weight"
                value={value}
                type="number"
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">°C</InputAdornment>
                }
                aria-describedby="filled-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
              />
            </FormControl>
          </Box>
        ) : null}

        <Box style={{ display: "flex" }}>
          <Typography variant="body1" component="p">
            Details
          </Typography>

          <TextField
            id="standard-basic"
            variant="standard"
            fullWidth
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
        // onClick={props.onClose}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            props.onSave({
              id: props.health?.id ?? 0,
              start: date,
              type,
              value,
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