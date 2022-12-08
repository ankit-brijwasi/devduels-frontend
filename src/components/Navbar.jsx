// react and other modules
import { useLocation, Link } from "react-router-dom";

// mui moduels
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// material icons
import ComputerIcon from "@mui/icons-material/Computer";

function Navbar(params) {
  const { pathname } = useLocation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "end" }}>
          <ComputerIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: "auto",
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            DEVDUELS
          </Typography>
          <Button
            color="primary"
            sx={{ mr: 2 }}
            variant={pathname === "/" ? "contained" : "text"}
            component={Link}
            to={"/"}
          >
            Create Event
          </Button>
          <Button
            color="primary"
            variant={pathname === "/join" ? "contained" : "text"}
            component={Link}
            to={"/join"}
          >
            Join Event
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
