// react and other modules
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// material ui components
import Box from "@mui/material/Box";
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

// ScoreBoard: Render the ScoreBoard for a event
function ScoreBoard() {
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [event, setEvent] = useState(null);

  const message = useSocket()[2];

  useEffect(() => {
    if (message.coll === "participants" && message.operationType === "update") {
      if (message.document.solution) {
        (async () => {
          try {
            let resp = await axios.get(
              `${BASE_URL}/events/${eventId}/retrieve`
            );
            setEvent(resp.data);

            resp = await axios.get(
              `${BASE_URL}/events/${eventId}/participants`
            );
            resp.data.sort(
              (a, b) =>
                Number(new Date(`1 jan 1970 ${a.time_taken}`)) -
                Number(new Date(`1 jan 1970 ${b.time_taken}`))
            );
            setParticipants(resp.data);
          } catch (error) {
            console.log(error);
          }
        })();
      }
    }
  }, [message, eventId]);

  useEffect(() => {
    (async () => {
      try {
        let resp = await axios.get(`${BASE_URL}/events/${eventId}/retrieve`);
        setEvent(resp.data);

        resp = await axios.get(`${BASE_URL}/events/${eventId}/participants`);
        resp.data.sort(
          (a, b) =>
            Number(new Date(`1 jan 1970 ${a.time_taken}`)) -
            Number(new Date(`1 jan 1970 ${b.time_taken}`))
        );
        setParticipants(resp.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    })();
  }, [eventId]);

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
        height: "400px",
      }}
    >
      {loading ? (
        <Loader />
      ) : (
        <Box sx={{ height: "400px" }}>
          <TableContainer sx={{ height: "400px" }}>
            <Toolbar
              sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                justifyContent: "end",
              }}
            >
              <Typography variant="h6" component="div" sx={{ mr: "auto" }}>
                {event.name} ScoreBoard
              </Typography>
            </Toolbar>
            <Table stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>#</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Participant Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Valid Output</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Time Taken</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ bgcolor: "#252525", position: "relative" }}>
                {participants
                  .filter((el) => el.solution !== null)
                  .map((participant, i) => (
                    <TableRow
                      key={participant.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      {console.log(participant)}
                      <TableCell component="th" scope="row">
                        {i + 1}
                      </TableCell>
                      <TableCell>{participant.user.username}</TableCell>
                      <TableCell>
                        {event.question_assigned.expected_output.trim() ===
                        participant.solution.output.trim()
                          ? "✅"
                          : "❌"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={participant.time_taken.split(".")[0]}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Paper>
  );
}

export default ScoreBoard;
