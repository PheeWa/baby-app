import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getText } from "../Components/BabyPhoto";
import { RootState } from "../Store/store";
import { usePhotos, useDeletePhoto } from "../Hooks/usePhotos";
import { Loader } from "../Components/Loader";

export const ViewPhotoPage = () => {
  let { id = "" } = useParams();
  const userId = useSelector((state: RootState) => state.auth.user?.userId || "");
  const { data: photos = [], isLoading } = usePhotos(userId);
  const deletePhotoMutation = useDeletePhoto(userId);
  const navigate = useNavigate();

  if (isLoading) {
    return <Loader message="Loading photo..." />;
  }

  const photo = photos.find((photo) => photo.id === id);
  if (!photo) {
    return null;
  }

  const onDelete = async (id: string) => {
    try {
      await deletePhotoMutation.mutateAsync(id);
      navigate("../photo");
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  return (
    <Box
      style={{
        display: "flex",
        flex: "1",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <img src={photo.image} style={{ flex: "1", objectFit: "cover" }}></img>

      <Typography variant="body1" color="text.secondary" align="center">
        {getText(photo.month)}
      </Typography>

      <Box style={{ display: "flex", padding: "16px" }} gap="16px">
        <Button
          fullWidth
          variant="contained"
          onClick={() => onDelete(photo.id)}
        >
          Delete
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate("../photo")}
        >
          Done
        </Button>
      </Box>
    </Box>
  );
};
