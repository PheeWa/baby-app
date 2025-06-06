import { ArrowBackRounded, PhotoCameraRounded } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import { updatePhoto } from "../Store/photoSlice";

export const TakePhotoPage = () => {
  const webcamRef = React.useRef<any>(null);
  let { id = "0" } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot?.();
    dispatch(updatePhoto({ id: +id, image: imageSrc, month: 0 }));
    navigate(`/photo/view-photo/${id}`);
  };

  const goBack = () => {
    navigate("/photo");
  };

  return (
    <Box style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Webcam
        style={{ flex: "1", objectFit: "cover" }}
        ref={webcamRef}
        videoConstraints={{ facingMode: { ideal: "environment" } }}
      ></Webcam>
      <Box style={{ display: "flex", justifyContent: "space-around" }}>
        <IconButton size="large" onClick={goBack}>
          <ArrowBackRounded style={{ fontSize: "40px" }}></ArrowBackRounded>
        </IconButton>
        <IconButton
          aria-label="delete"
          size="large"
          style={{ flexDirection: "column" }}
          onClick={capture}
        >
          <PhotoCameraRounded style={{ fontSize: "50px" }} />
        </IconButton>
        <IconButton style={{ opacity: 0 }} size="large">
          <ArrowBackRounded style={{ fontSize: "40px" }}></ArrowBackRounded>
        </IconButton>
      </Box>
    </Box>
  );
};
