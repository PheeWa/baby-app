import { MoreVertRounded } from "@mui/icons-material";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
  text: string;
  route: string;
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
        <Avatar>
          <MoreVertRounded />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={props.text} />
    </ListItem>
  );
};
