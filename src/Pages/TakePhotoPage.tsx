import { ArrowBackRounded, PhotoCameraRounded } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import { RootState } from "../Store/store";
import { useUpdatePhoto } from "../Hooks/usePhotos";

export const TakePhotoPage = () => {
  const webcamRef = React.useRef<any>(null);
  let { id = "" } = useParams();
  const userId = useSelector((state: RootState) => state.auth.user?.userId || "");
  const updatePhotoMutation = useUpdatePhoto(userId);
  const navigate = useNavigate();

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot?.();
    if (imageSrc) {
      try {
        await updatePhotoMutation.mutateAsync({ id, image: imageSrc, month: 0 });
        navigate(`/photo/view-photo/${id}`);
      } catch (error) {
        console.error("Error updating photo:", error);
      }
    }
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
