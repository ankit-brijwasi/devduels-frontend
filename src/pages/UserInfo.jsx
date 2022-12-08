// react modules
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material ui components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

// custom modules
import { setUser } from "../redux/features/userSlice";
import { BASE_URL } from "../utils/helpers";

// UserInfo: Register a new user form
function UserInfo(params) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user._id !== null || user.username !== null) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const resp = await axios.post(`${BASE_URL}/users/create`, { username });

    if (resp.status === 200) {
      dispatch(setUser({ ...resp.data }));
    }
    setLoading(false);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        width: "100%",
        maxWidth: "550px",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Box p={4}>
        <form method="post" onSubmit={handleSubmit}>
          <Typography variant="h6" align="center">
            User Registration
          </Typography>
          <br />
          <TextField
            label="Username"
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
            required
            autoFocus
            fullWidth
          />
          <br />
          <br />
          <Button
            disabled={loading}
            variant="contained"
            type="submit"
            fullWidth
          >
            Register
          </Button>
        </form>
      </Box>
    </Paper>
  );
}

export default UserInfo;
