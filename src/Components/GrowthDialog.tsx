import { CalendarMonthRounded, DeleteRounded } from "@mui/icons-material";
import { MobileDatePicker } from "@mui/lab";
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Box,
  Typography,
  InputAdornment,
  FormControl,
  Input,
  Button,
  DialogActions,
} from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Growth, GrowthType } from "../Pages/GrowthPage";

type Props = {
  onSave: (newGrowth: Growth) => void;
  onClose: () => void;
  growth?: Growth;
  onDelete: (id: string) => void;
};

export const getUnit = (type?: GrowthType) => {
  switch (type) {
    case "weight":
      return "kg";
    case "head":
      return "cm";
    case "height":
      return "cm";
  }
  return "";
};

export const getLabel = (type?: GrowthType) => {
  switch (type) {
    case "weight":
      return "Weight";
    case "height":
      return "Height";
    case "head":
      return "Head";
  }
};

export const GrowthDialog = (props: Props) => {
  const [time, setTime] = useState(Date());
  const [value, setValue] = useState("");

  useEffect(() => {
    if (props.growth) {
      setTime(props.growth.start);
      setValue(props.growth.value);
    }
  }, [props.growth]);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={!!props.growth}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {format(new Date(time), "MMM d, y")}
        <Box
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <IconButton aria-label="close">
            <MobileDatePicker
              label="For mobile"
              value="{value}"
              onChange={(newValue) => {
                setTime(newValue?.toString() ?? Date());
              }}
              maxDate={new Date()}
              renderInput={({ inputRef, inputProps, InputProps }) => {
                return (
                  <IconButton
                    aria-label="close"
                    onClick={(e) => {
                      inputProps?.onClick?.(inputRef as any);
                    }}
                  >
                    <CalendarMonthRounded />
                  </IconButton>
                );
              }}
            />
          </IconButton>
          {props.growth?.id !== "0" ? (
            <IconButton
              aria-label="close"
              onClick={() => {
                if (props.growth?.id) {
                  props.onDelete(props.growth.id);
                }
              }}
            >
              <DeleteRounded />
            </IconButton>
          ) : null}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box style={{ display: "flex" }}>
          <Typography variant="body1" component="p">
            {getLabel(props.growth?.type)}
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
                <InputAdornment position="end">
                  {getUnit(props.growth?.type)}
                </InputAdornment>
              }
              aria-describedby="filled-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
            />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          onClick={() => {
            props.onSave({
              id: props.growth?.id ?? "0",
              start: time,
              value: value,
              type: props.growth?.type ?? "head",
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
