// material ui modules
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

// Loader: Show a circular progress bar
export default function Loader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}
