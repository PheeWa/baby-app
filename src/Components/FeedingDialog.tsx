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
} from "@mui/material";
import { subMinutes } from "date-fns";
import React, { useEffect, useState } from "react";
import { Feeding } from "../Pages/FeedPage";

type Props = {
  onClose: () => void;
  onSave: (newFeeding: Feeding) => void;
  selectedFeeding?: Feeding;
  onDelete: (id: number) => void;
};

export const FeedingDialog = (props: Props) => {
  //   const [open, setOpen] = React.useState(false);
  const [start, setStart] = useState("");
  const [finish, setFinish] = useState("");
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  //   const [feedings, setfeedings] = useState<any>([]);
  const [contents, setContents] = useState("");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (props.selectedFeeding) {
      setType(props.selectedFeeding?.type);
      setStart(props.selectedFeeding?.start);
      setFinish(props.selectedFeeding?.finish);
      setDetails(props.selectedFeeding?.details);
      setContents(props.selectedFeeding?.contents);
      setAmount(props.selectedFeeding?.amount);
    }
  }, [props.selectedFeeding]);

  return (
    <Dialog
      open={!!props.selectedFeeding}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Feeding
        {props.selectedFeeding?.id ? (
          <IconButton
            aria-label="close"
            // onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            onClick={() => {
              if (props.selectedFeeding?.id) {
                props.onDelete(props.selectedFeeding?.id);
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
            Start
          </Typography>

          <MobileDateTimePicker
            openTo="hours"
            value={start}
            onChange={(newValue) => {
              setStart(new Date(newValue ?? Date()).toString());
            }}
            renderInput={(params) => (
              <TextField {...params} variant="standard" />
            )}
          />
        </Box>
        <Box style={{ display: "flex" }}>
          <Typography variant="body1" component="p">
            Finish
          </Typography>

          <MobileDateTimePicker
            openTo="hours"
            value={finish}
            onChange={(newValue) => {
              setFinish(new Date(newValue ?? Date()).toString());
            }}
            renderInput={(params) => (
              <TextField {...params} variant="standard" />
            )}
          />
        </Box>

        <Box style={{ display: "flex" }}>
          <Typography variant="body1" component="p">
            Type
          </Typography>
          <FormControl variant="standard" fullWidth>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value={"left breast"}>Left Breast</MenuItem>
              <MenuItem value={"right breast"}>Right Breast</MenuItem>
              <MenuItem value={"bottle"}>Bottle</MenuItem>
              <MenuItem value={"meal"}>Meal</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {type === "bottle" ? (
          <Box>
            <Box style={{ display: "flex" }}>
              <Typography variant="body1" component="p">
                Amount
              </Typography>

              <TextField
                id="standard-basic"
                variant="standard"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value as any)}
                type="number"
              />
            </Box>

            <Box style={{ display: "flex" }}>
              <Typography variant="body1" component="p">
                Contents
              </Typography>
              <FormControl variant="standard" fullWidth>
                <Select
                  value={contents}
                  onChange={(e) => setContents(e.target.value)}
                >
                  <MenuItem value={"formula"}>Formula</MenuItem>
                  <MenuItem value={"breast milk"}>Breast milk</MenuItem>
                </Select>
              </FormControl>
            </Box>
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
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          onClick={() => {
            props.onSave({
              id: props.selectedFeeding?.id ?? 0,
              start,
              finish,
              type,
              details,
              contents,
              amount,
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
