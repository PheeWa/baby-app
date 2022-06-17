import { MoreVertRounded } from "@mui/icons-material";
import { ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import React from "react";

type Props = {
  totalTimes: number;
  totalDuration: () => void;
  text: string;
};

export const SummaryToday = (props: Props) => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <MoreVertRounded />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={`${props.text} ${
          props.totalTimes
        } times, ${props.totalDuration()}`}
      />
    </ListItem>
  );
};
