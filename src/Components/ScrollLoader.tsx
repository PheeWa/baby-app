import { Box, CircularProgress } from "@mui/material";

export const ScrollLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <CircularProgress />
    </Box>
  );
};
