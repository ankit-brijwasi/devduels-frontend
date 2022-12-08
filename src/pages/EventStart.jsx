// react and other modules
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";

// material ui components
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";

// custom modules
import { BASE_URL } from "../utils/helpers";

let STARTED_ON = null;
const LANGUAGES = {
  python3: "python",
  nodejs: "javascript",
  go: "go",
  c: "c",
  cpp: "cpp",
};

function EventStart() {
  const [answer, setAnswer] = useState("");
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [participant, setParticipant] = useState(null);
  const user = useSelector((state) => state.user);
  const [submitting, setSubmitting] = useState(false);

  const params = useParams();

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true)
    try {
      await axios.post(
        `${BASE_URL}/participants/submit-solution`,
        {
          participant_id: participant.id,
          proposed_answer: {
            script: answer,
            started_on: STARTED_ON.toISOString(),
            ended_on: new Date().toISOString(),
          },
        }
      );
      navigate(`/${params.eventId}/scoreboard`);
    } catch (error) {
      console.log(error)
    }
    setSubmitting(false)
  }

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get(
          `${BASE_URL}/events/${params.eventId}/participants`
        );
        const currParticipant = resp.data.filter(
          (data) => data.user._id === user._id
        );
        if (currParticipant.length === 0) {
          alert("You haven't participated in this event");
          navigate("/");
        }

        setParticipant(currParticipant[0]);
      } catch (error) {
        setError(error.request?.response);
      }

      try {
        const resp = await axios.get(
          `${BASE_URL}/events/${params.eventId}/retrieve`
        );
        setEvent(resp.data);
      } catch (error) {
        setError(error.request?.response);
      }

      setLoading(false);
      STARTED_ON = new Date();
    })();
  }, [params.eventId, user._id, navigate]);

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
        minHeight: "550px",
      }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "inherit",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body1" component="div">
              <pre style={{ whiteSpace: "break-spaces", maxWidth: "550px" }}>
                P: {event?.question_assigned.statement}
              </pre>
            </Typography>
          </Toolbar>
          <Divider />
          <Editor
            defaultLanguage={LANGUAGES[event?.question_assigned.language]}
            theme="vs-dark"
            height="50vh"
            onChange={(value, event) => setAnswer(value)}
            autoIndent={true}
            colorDecorators={true}
          />
          <Divider />
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              justifyContent: "space-between",
            }}
          >
            <Button
              size="small"
              variant="contained"
              sx={{
                backgroundColor: "teal",
                "&:hover": { backgroundColor: "#006666" },
              }}
              onClick={handleSubmit}
              disabled={submitting}
              fullWidth
            >
              Submit
            </Button>
          </Toolbar>
        </>
      )}
    </Paper>
  );
}

export default EventStart;
