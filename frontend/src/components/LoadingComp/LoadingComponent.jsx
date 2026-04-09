import { CircularProgress, Box } from "@mui/material";

function Loading({ size = 20 }) {
  return (
    <Box display="flex" justifyContent="center">
      <CircularProgress size={size} />;
    </Box>
  );
}

export default Loading;
