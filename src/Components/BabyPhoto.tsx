import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Photo } from "../Pages/PhotoPage";
import babyIcon from "../Assets/babyIcon.jpeg";

type Props = {
  photo: Photo;
  open: () => void;
};

export const getText = (month: number) => {
  if (month === 0) {
    return "Just born";
  } else if (month === 1) {
    return "1 month";
  } else if (month === 12) {
    return "1 year";
  } else {
    return `${month} months`;
  }
};
export const BabyPhoto = (props: Props) => {
  return (
    <Box sx={{ width: "calc(50% - 8px)" }}>
      <Card onClick={props.open}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={props.photo.image || babyIcon}
            style={{ opacity: props.photo.image ? 1 : 0.3 }}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary" align="center">
              {getText(props.photo.month)}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};
