import { MoreVertRounded } from "@mui/icons-material";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IconType } from "./IconType";

type Props = {
  text: string;
  route: string;
  type: string;
};

export const LatestActivity = (props: Props) => {
  const navigate = useNavigate();

  return (
    <ListItem
      onClick={() => {
        navigate(props.route);
      }}
    >
      <ListItemAvatar>
        <Avatar style={{ backgroundColor: "#151e33" }}>
          <IconType type={props.type} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={props.text} />
    </ListItem>
  );
};
