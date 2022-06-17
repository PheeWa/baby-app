import { ArrowBackRounded, AddRounded } from "@mui/icons-material";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  handleClickOpen?: () => void;
  title?: string;
};

export const Header = (props: Props) => {
  let navigate = useNavigate();

  const goBack = () => {
    navigate("/");
  };

  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={goBack}
        >
          <ArrowBackRounded></ArrowBackRounded>
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {props.title}
        </Typography>

        {props.handleClickOpen ? (
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={(e) => props.handleClickOpen?.()}
            color="inherit"
          >
            <AddRounded />
          </IconButton>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};
