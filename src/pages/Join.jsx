// react and other modules
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// material ui components
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

// custom modules
import { BASE_URL } from "../utils/helpers";
import Loader from "../components/Loader";
import useSocket from "../hooks/useSocket";

// Join: Table where all the events are shown
function Join() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const message = useSocket()[2];

  useEffect(() => {
    (async () => {
      try {
        const resp = await axios({
          method: "get",
          url: `${BASE_URL}/events/list`,
        });
        setEvents(resp.data.items);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (message.coll === "events" && message.operationType === "insert") {
      setEvents((prevState) => [{ ...message.document }, ...prevState]);
    }
  }, [message]);

  return (
    <Paper
      elevation={2}
      sx={{
        width: "100%",
        maxWidth: "550px",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          New Events to Join
        </Typography>
      </Toolbar>
      <TableContainer sx={{ height: "400px" }}>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>#</strong>
              </TableCell>
              <TableCell>
                <strong>Event Name</strong>
              </TableCell>
              <TableCell>
                <strong>Language</strong>
              </TableCell>
              <TableCell>
                <strong>Level</strong>
              </TableCell>
              <TableCell>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ bgcolor: "#252525" }}>
            {loading ? (
              <TableRow sx={{ height: "343px" }}>
                <TableCell colSpan={5}>
                  <Loader />
                </TableCell>
              </TableRow>
            ) : (
              events.map((event, i) => (
                <TableRow
                  key={event.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {i + 1}
                  </TableCell>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{event.language}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={event.level === 0 ? "Easy" : "Hard"}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/join/${event.id}`}
                      size="small"
                      variant="contained"
                    >
                      Join
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default Join;
