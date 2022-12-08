// react modules
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// material ui components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

// custom modules
import { BASE_URL } from "../utils/helpers";

const initialState = {
  name: "",
  level: 0,
  language: "",
};

// Home Page Container: Create a event
function Home() {
  const [value, setValue] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await axios.post(`${BASE_URL}/events/create`, {
        ...value,
        admin_user: user._id,
      });
      navigate(`/join/${resp.data.id}`, { state: { event: resp.data } });
    } catch (error) {
      console.log(error.request?.response);
      setLoading(false);
    }
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
            Create a new event
          </Typography>
          <br />
          <TextField
            type="text"
            label="Name"
            variant="standard"
            value={value.name}
            onChange={(e) => setValue({ ...value, name: e.target.value })}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
            required
            autoFocus
            fullWidth
          />
          <br />
          <br />
          <FormControl variant="standard" disabled={loading} required fullWidth>
            <InputLabel shrink>Language</InputLabel>
            <Select
              value={value.language}
              label="Language"
              onChange={(e) => setValue({ ...value, language: e.target.value })}
            >
              <MenuItem value="python3">Python</MenuItem>
              <MenuItem value="nodejs">Javascript</MenuItem>
              <MenuItem value="cpp">C++</MenuItem>
              <MenuItem value="go">GO Lang</MenuItem>
              <MenuItem value="c">C</MenuItem>
            </Select>
          </FormControl>
          <br />
          <br />
          <FormControl variant="standard" disabled={loading} required fullWidth>
            <InputLabel shrink>Level</InputLabel>
            <Select
              value={value.level}
              label="Level"
              onChange={(e) => setValue({ ...value, level: e.target.value })}
            >
              <MenuItem value={0}>Easy</MenuItem>
              <MenuItem value={1}>Hard</MenuItem>
            </Select>
          </FormControl>
          <br />
          <br />

          <Button
            disabled={loading}
            variant="contained"
            type="submit"
            fullWidth
          >
            Create
          </Button>
        </form>
      </Box>
    </Paper>
  );
}

export default Home;
