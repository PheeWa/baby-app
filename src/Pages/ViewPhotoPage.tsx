import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getText } from "../Components/BabyPhoto";
import { deletePhoto } from "../Store/photoSlice";
import { RootState } from "../Store/store";

export const ViewPhotoPage = () => {
  let { id = "0" } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const photo = useSelector((state: RootState) =>
    state.photo.photos.find((photo) => {
      return photo.id === +id;
    })
  );
  if (!photo) {
    return null;
  }

  const onDelete = (id: number) => {
    dispatch(deletePhoto(id));
    navigate("../photo");
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
