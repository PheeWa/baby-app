import { Typography } from "@mui/material";
import { differenceInSeconds } from "date-fns";
import React, { useEffect, useState } from "react";
import { formatTime } from "./StopWatch";

type Props = {
  startDate: string;
};

export const Counter = (props: Props) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const callback = () => {
      const diff = differenceInSeconds(new Date(), new Date(props.startDate));
      setTime(formatTime(diff));
    };
    callback();
    const interval = setInterval(callback, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Typography
      variant="h6"
      component="div"
      sx={{ flexGrow: 1, textAlign: "center" }}
    >
      {time}
    </Typography>
  );
};
