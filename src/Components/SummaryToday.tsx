import { MoreVertRounded } from "@mui/icons-material";
import { ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import React from "react";
import { IconType } from "./IconType";

type Props = {
  totalTimes: number;
  totalDuration: () => void;
  text: string;
  type: string;
};

export const SummaryToday = (props: Props) => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar style={{ backgroundColor: "#151e33" }}>
          <IconType type={props.type} />
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
