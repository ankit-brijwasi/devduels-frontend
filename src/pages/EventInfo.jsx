// react and other modules
import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// material ui components
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
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

// EventInfo: Render the details for a event
function EventInfo() {
  const { state } = useLocation();
  const { eventId } = useParams();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const [event, setEvent] = useState(state?.event);
  const [loading, setLoading] = useState(true);

  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(true);

  const [readyStatus, setReadyStatus] = useState(false);

  const [startEvent, setStartEvent] = useState(true);

  const message = useSocket()[2];

  useEffect(() => {
    if (message.coll === "participants" && message.operationType === "insert") {
      setParticipants((prevState) => [{ ...message.document }, ...prevState]);
    } else if (
      message.coll === "participants" &&
      message.operationType === "update"
    ) {
      setParticipants((prevState) =>
        prevState.map((p) => {
          if (p.id === message.document._id) {
            for (let attr in message.document) {
              if (attr === "_id") continue;
              p[attr] = message.document[attr];
            }
          }
          return p;
        })
      );
    } else if (
      message.coll === "events" &&
      message.operationType === "update"
    ) {
      if(message.document.has_started)
        navigate(`/${eventId}/start`);
    }
  }, [message, navigate, eventId]);

  useEffect(() => {
    if (event?.has_started) {
      navigate(`/${eventId}/start`);
    }

    (async () => {
      if (!event) {
        try {
          const resp = await axios.get(
            `${BASE_URL}/events/${eventId}/retrieve`
          );
          setEvent(resp.data);
        } catch (error) {
          console.log(error);
        }
      }
      setLoading(false);
    })();
  }, [event, navigate, eventId]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get(
          `${BASE_URL}/events/${eventId}/participants`
        );
        setParticipants(resp.data);
      } catch (error) {
        console.log(error);
      }
      setLoadingParticipants(false);
    })();
  }, [event, eventId]);

  const handleJoinEvent = async (e) => {
    try {
      await axios({
        method: "put",
        url: `${BASE_URL}/events/${eventId}/join`,
        params: { user_id: user._id },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartEvent = async (e) => {
    try {
      await axios({
        method: "get",
        url: `${BASE_URL}/events/${eventId}/start`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // eslint-disable-next-line
  useEffect(() => {
    (() => {
      if (participants.length >= 2) {
        const idx = participants.findIndex(
          (participant) => participant.is_ready === false
        );
        if (idx !== -1) return setStartEvent(true);
        setStartEvent(false);
      }
    })();
  }, [participants]);

  const participantReady = async (id) => {
    try {
      setReadyStatus(true);
      await axios({
        method: "put",
        url: `${BASE_URL}/participants/${id}/ready`,
      });
      setReadyStatus(false);
    } catch (error) {
      console.log(error);
    }
  };

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
                {event.name}
              </Typography>

              {event.admin_user._id === user._id && (
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mr: "10px" }}
                  disabled={startEvent}
                  onClick={handleStartEvent}
                >
                  Start Event
                </Button>
              )}
              {participants.length > 0 &&
                participants.findIndex(
                  (participant) => participant.user._id === user._id
                ) === -1 && (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#ff9900",
                      "&:hover": { backgroundColor: "#e68a00" },
                    }}
                    size="small"
                    onClick={handleJoinEvent}
                  >
                    Join Now
                  </Button>
                )}
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
                    <strong>Status</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ bgcolor: "#252525", position: "relative" }}>
                {loadingParticipants ? (
                  <TableRow sx={{ height: "278px" }}>
                    <TableCell colSpan={3}>
                      <Loader />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {participants.length === 0 && (
                      <TableRow sx={{ height: "278px" }}>
                        <TableCell colSpan={3}>
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <center>
                              <Typography sx={{ mb: 0.6 }} variant="subtitle1">
                                <strong>No participants yet!</strong>
                              </Typography>
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: "#ff9900",
                                  "&:hover": { backgroundColor: "#e68a00" },
                                }}
                                size="small"
                                onClick={handleJoinEvent}
                              >
                                Join Now
                              </Button>
                            </center>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                    {participants.map((participant, i) => (
                      <TableRow
                        key={participant.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {i + 1}
                        </TableCell>
                        <TableCell>{participant.user.username}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="contained"
                            elevation={0}
                            sx={{
                              backgroundColor: participant.is_ready
                                ? "#e62e00"
                                : "teal",
                              "&:hover": {
                                backgroundColor: participant.is_ready
                                  ? "#cc2900"
                                  : "#006666",
                              },
                            }}
                            onClick={() => participantReady(participant.id)}
                            disabled={
                              !(user._id === participant.user._id) ||
                              readyStatus
                            }
                          >
                            {user._id === participant.user._id
                              ? participant.is_ready
                                ? "Not Ready"
                                : "Ready"
                              : !participant.is_ready
                              ? "Not Ready"
                              : "Ready"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Paper>
  );
}

export default EventInfo;
