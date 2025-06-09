import { DeleteRounded } from "@mui/icons-material";
import { MobileDateTimePicker } from "@mui/lab";
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  DialogActions,
  Button,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Feeding, FeedingType } from "../types/feeding";

type FeedingDialogProps = {
  open: boolean;
  feeding: Feeding;
  onClose: () => void;
  onSave: (newFeeding: Feeding) => void;
  onDelete: (id: string) => void;
};

export const FeedingDialog = (props: FeedingDialogProps) => {
  const [start, setStart] = useState("");
  const [finish, setFinish] = useState("");
  const [type, setType] = useState<FeedingType>("left breast");
  const [details, setDetails] = useState("");
  const [contents, setContents] = useState("");
  const [amount, setAmount] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (props.feeding) {
      setType(props.feeding.type);
      setStart(props.feeding.start);
      setFinish(props.feeding.finish);
      setDetails(props.feeding.details);
      setContents(props.feeding.contents || "");
      setAmount(props.feeding.amount);
    }
  }, [props.feeding]);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Feeding
        {props.feeding.id !== '0' ? (
          <IconButton
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
            onClick={() => {
              props.onDelete(props.feeding.id);
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
            value={start}
            showToolbar
            onChange={(newValue) => {
              setStart(new Date(newValue ?? Date()).toISOString());
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
              setFinish(new Date(newValue ?? Date()).toISOString());
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth variant="standard" />
            )}
            maxDateTime={new Date()}
            minDateTime={new Date(start)}
          />
        </Box>

        <Box style={{ display: "flex", marginBottom: "16px" }}>
          <FormControl variant="standard" fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Type
            </InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value as FeedingType)}>
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
              <TextField
                label="Amount"
                id="standard-basic"
                variant="standard"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                type="number"
              />
            </Box>

            <Box style={{ display: "flex", marginBottom: "16px" }}>
              <FormControl variant="standard" fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Contents
                </InputLabel>
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
            const feedingToSave = {
              id: props.feeding.id,
              start,
              finish,
              type,
              details,
              contents,
              amount,
            };
            props.onSave(feedingToSave);
          }}
          autoFocus
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
