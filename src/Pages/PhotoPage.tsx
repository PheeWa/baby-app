import { PhotoCameraRounded, PhotoRounded } from "@mui/icons-material";
import { Drawer, IconButton, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BabyPhoto } from "../Components/BabyPhoto";
import { Header } from "../Components/Header";
import { RootState } from "../Store/store";
import { usePhotos, useUpdatePhoto, useDeletePhoto, useAddPhoto } from "../Hooks/usePhotos";
import { Loader } from "../Components/Loader";

export type Photo = {
  id: string;
  month: number;
  image: string;
};

export const PhotoPage = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?.userId || "");
  const { data: photos = [], isLoading } = usePhotos(userId);
  const updatePhotoMutation = useUpdatePhoto(userId);
  const deletePhotoMutation = useDeletePhoto(userId);
  const addPhotoMutation = useAddPhoto(userId);

  if (isLoading) {
    return <Loader message="Loading photos..." />;
  }

  const handleDrawerOpen = (id: string) => {
    setSelectedId(id);
  };

  const goShoot = (id: string) => {
    navigate(`/photo/take-photo/${id}`);
  };

  const handlePhotoClick = (photo: Photo) => {
    if (photo.image) {
      navigate(`/photo/view-photo/${photo.id}`);
    } else {
      handleDrawerOpen(photo.id);
    }
  };

  const getPhoto = async (result: string | ArrayBuffer | null) => {
    if (typeof result === "string" && selectedId) {
      try {
        if (selectedId === "new") {
          const newPhoto = await addPhotoMutation.mutateAsync({ image: result, month: 0 });
          navigate(`/photo/view-photo/${newPhoto.id}`);
        } else {
          await updatePhotoMutation.mutateAsync({ id: selectedId, image: result, month: 0 });
          navigate(`/photo/view-photo/${selectedId}`);
        }
      } catch (error) {
        console.error("Error updating photo:", error);
      }
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
          justifyContent: photos.length === 0 ? "center" : undefined,
        }}
      >
        {photos.length === 0 ? (
          <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", marginTop: 48 }}>
            <Typography variant="h6" color="textSecondary" style={{ marginBottom: 16 }}>
              No photos yet
            </Typography>
            <IconButton
              color="primary"
              size="large"
              style={{ flexDirection: "column" }}
              onClick={() => setSelectedId("new")}
            >
              <PhotoCameraRounded style={{ fontSize: "50px" }} />
              <Typography>Add Photo</Typography>
            </IconButton>
          </Box>
        ) : (
          photos.map((photo) => {
            return (
              <BabyPhoto key={photo.id} photo={photo} open={() => handlePhotoClick(photo)} />
            );
          })
        )}
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
                goShoot(selectedId ?? "");
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
