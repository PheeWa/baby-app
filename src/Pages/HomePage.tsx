import { HomeRounded, InfoRounded, TimelineRounded } from "@mui/icons-material";
import {
  Box,
  Tabs,
  Tab,
  Avatar,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { HomeTab } from "./HomeTab";
import { StatsTab } from "./StatsTab";
import lukaImg from "../Assets/luka.jpg";

export const HomePage = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
          paddingBottom: 0,
        }}
      >
        <Box style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar alt="Remy Sharp" src={lukaImg} />
          <Typography>Luka</Typography>
        </Box>
        <IconButton onClick={handleClickOpen}>
          <InfoRounded color="secondary"></InfoRounded>
        </IconButton>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          variant="fullWidth"
        >
          <Tab icon={<HomeRounded />} aria-label="phone" />
          <Tab icon={<TimelineRounded />} aria-label="favorite" />
        </Tabs>
      </Box>
      {value === 0 && <HomeTab />}
      {value === 1 && <StatsTab />}

      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
        <DialogTitle style={{ display: "flex", alignItems: "center" }}>
          <InfoRounded
            color="secondary"
            style={{ marginRight: 12 }}
          ></InfoRounded>
          {"Demo app"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              "This is a Demo app without a backend or any form of state persistence."
            }
          </DialogContentText>
          <br />
          <DialogContentText>
            {
              "The app's state is stored in memory, so refreshing the page will reset the data and any changes made will be lost."
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
