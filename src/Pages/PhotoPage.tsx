import { PhotoCameraRounded, PhotoRounded } from "@mui/icons-material";
import { Drawer, IconButton, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BabyPhoto } from "../Components/BabyPhoto";
import { Header } from "../Components/Header";
import { updatePhoto } from "../Store/photoSlice";
import { RootState } from "../Store/store";

export type Photo = {
  id: number;
  month: number;
  image: string;
};

export const PhotoPage = () => {
  //usestates//

  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  //functions//
  const photos = useSelector((state: RootState) => state.photo.photos);

  const handleDrawerOpen = (id: number) => {
    setSelectedId(id);
  };

  const goShoot = (id: number) => {
    navigate(`/photo/take-photo/${id}`);
  };

  const handlePhotoClick = (photo: Photo) => {
    if (photo.image) {
      navigate(`/photo/view-photo/${photo.id}`);
    } else {
      handleDrawerOpen(photo.id);
    }
  };

  const dispatch = useDispatch();
  const getPhoto = (result: string | ArrayBuffer | null) => {
    if (typeof result === "string" && typeof selectedId === "number") {
      dispatch(updatePhoto({ id: selectedId, image: result, month: 0 }));
      navigate(`/photo/view-photo/${selectedId}`);
    }
  };

  return (
    <Box>
      <Header title="Monthly baby photos" />
      <Container
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "16px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {photos.map((photo) => {
          return (
            <BabyPhoto photo={photo} open={() => handlePhotoClick(photo)} />
          );
        })}
      </Container>

      <Drawer
        anchor="bottom"
        open={selectedId !== undefined}
        onClose={() => setSelectedId(undefined)}
        style={{ padding: "18px" }}
      >
        <Box padding="16px">
          <Typography>Add photo from</Typography>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              marginTop: "20px",
            }}
          >
            <input
              ref={fileInputRef}
              id="upload-photo"
              hidden
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => {
                const file = (fileInputRef as any)?.current?.files?.[0];
                const reader = new FileReader();

                reader.addEventListener(
                  "load",
                  function () {
                    getPhoto(reader.result);
                  },
                  false
                );

                if (file) {
                  reader.readAsDataURL(file);
                }
              }}
            ></input>
            <label htmlFor="upload-photo">
              <IconButton
                component="span"
                aria-label="delete"
                size="large"
                style={{ flexDirection: "column" }}
              >
                <PhotoRounded style={{ fontSize: "50px" }} />
                <Typography>Gallery</Typography>
              </IconButton>
            </label>

            <IconButton
              aria-label="delete"
              size="large"
              style={{ flexDirection: "column" }}
              onClick={() => {
                goShoot(selectedId ?? 0);
              }}
            >
              <PhotoCameraRounded style={{ fontSize: "50px" }} />
              <Typography>Camera</Typography>
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};
