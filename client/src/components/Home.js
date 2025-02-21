import { Box, Typography } from "@mui/material";
import Sidebar from "../components/Sidebar";

function Home() {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4">Welcome to the InSightEd System</Typography>
      </Box>
    </Box>
  );
}

export default Home;
