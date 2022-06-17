import {
  ArrowForwardIosRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";
import {
  Box,
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FeedingType } from "../Pages/FeedPage";
import { LeisureType } from "../Pages/LeisurePage";
import { getLeisureText } from "./LeisureStopWatch";
import { getFeedText, formatTime } from "./StopWatch";

type Props = {
  route: string;
  type: FeedingType | LeisureType | "Sleep";
  time: number;
};

export const InProgress = (props: Props) => {
  const navigate = useNavigate();

  const primaryText = () => {
    if (props.route === "/feed") {
      return getFeedText(props.type as FeedingType);
    } else if (props.route === "/leisure") {
      return getLeisureText(props.type as LeisureType);
    } else if (props.route === "/sleep") {
      return "Sleep";
    } else {
      return "";
    }
  };

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => navigate(props.route)}
        >
          <ArrowForwardIosRounded />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar>
          <ArrowForwardRounded />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={primaryText()} secondary="In progress" />
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1, textAlign: "center" }}
      >
        {formatTime(props.time)}
      </Typography>
    </ListItem>
  );
};
