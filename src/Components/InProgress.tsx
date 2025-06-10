import React from "react";
import { ArrowForwardIosRounded } from "@mui/icons-material";
import {
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FeedingType } from "../Types/feeding";
import { LeisureType } from "../Pages/LeisurePage";
import { Counter } from "./Counter";
import { IconType } from "./IconType";
import { getLeisureText } from "./LeisureStopWatch";
import { getFeedText } from "./StopWatch";

type Props = {
  route: string;
  type: FeedingType | LeisureType | "Sleep";
  startDate: string;
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
        <Avatar style={{ backgroundColor: "#151e33" }}>
          <IconType type={props.type} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={primaryText()} secondary="In progress" />
      <Counter startDate={props.startDate} />
    </ListItem>
  );
};
