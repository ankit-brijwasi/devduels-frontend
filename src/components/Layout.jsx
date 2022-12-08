// react and react router dom modules
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// material ui modules
import Stack from "@mui/material/Stack";

// custom components & modules
import Navbar from "./Navbar";

// Layout Component: Defines the structure of the application
function Layout() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user._id === null || user.username === null) {
      navigate("/user-info");
    }
  }, [user, navigate]);

  return (
    <>
      <Navbar />
      <Stack direction="column" alignItems="center" justifyContent="center">
        <Outlet />
      </Stack>
    </>
  );
}

export default Layout;
