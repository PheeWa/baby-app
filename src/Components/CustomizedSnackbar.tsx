import * as React from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type CustomizedSnackbarProps = {
  open: boolean;
  onCloseClick: () => void;
  message: string;
};
export default function CustomizedSnackbar({
  message,
  open,
  onCloseClick,
}: CustomizedSnackbarProps) {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    onCloseClick();
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Alert
        onClose={handleClose}
        severity="error"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
