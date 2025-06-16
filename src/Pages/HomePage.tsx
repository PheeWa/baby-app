import {
  HomeRounded,
  InfoRounded,
  TimelineRounded,
  LogoutRounded,
} from "@mui/icons-material";
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
import { AppDispatch, RootState } from "../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../Store/authSlice";
import { useNavigate } from "react-router-dom";
import { useBabyProfile } from "../Hooks/useBabyProfile";
import { OnBoarding } from "./Onboarding";
import { formatDistanceToNowStrict, parseISO } from "date-fns";

export const HomePage = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, user } = useSelector((state: RootState) => state.auth);
  const userId = useSelector((state: RootState) => state.auth.user?.userId || "");
  const { data: babyProfile, isLoading } = useBabyProfile(userId);

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

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk());
      setOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) return null;


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
          <Avatar alt={babyProfile?.photoUrl || "Baby"} src={babyProfile?.photoUrl || undefined} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
              {babyProfile?.name || "Your Baby"}
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: 'text.secondary' }}>
              {babyProfile?.birthDate
                ? formatDistanceToNowStrict(parseISO(babyProfile.birthDate), { unit: 'month' }) + " old"
                : "Age unknown"}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClickOpen}>
          <LogoutRounded />
        </IconButton>
      </Box>
      {babyProfile ?
        <Box>
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
        </Box> : <OnBoarding />}

      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
        <DialogTitle style={{ display: "flex", alignItems: "center" }}>
          <InfoRounded
            color="secondary"
            style={{ marginRight: 12 }}
          ></InfoRounded>
          {"Log out"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{user?.email}</DialogContentText>
          <br />
          <DialogContentText>
            {
              "Are you sure you want to sign out? You'll need to sign in again to access your account."
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogout} autoFocus>
            {loading ? "Signing out..." : "Sign Out"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
