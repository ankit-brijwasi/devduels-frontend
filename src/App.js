// react and react router dom modules
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// material ui modules
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// custom components
import Layout from "./components/Layout";

// custom modules
import { darkTheme } from "./utils/theme";
import { SocketProvider } from "./context/socketContext";

// pages
import Home from "./pages/Home";
import Join from "./pages/Join";
import UserInfo from "./pages/UserInfo";
import EventInfo from "./pages/EventInfo";
import EventStart from "./pages/EventStart";
import ScoreBoard from "./pages/ScoreBoard";
import NotFound from "./pages/NotFound";

// css
import "./index.css";

// App component: Contains all the routes
function App() {
  const theme = createTheme(darkTheme);
  return (
    <ThemeProvider theme={theme}>
      <SocketProvider>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/join">
                <Route index element={<Join />} />
                <Route path=":eventId" element={<EventInfo />} />
              </Route>
              <Route path="/:eventId/start" element={<EventStart />} />
              <Route path="/:eventId/scoreboard" element={<ScoreBoard />} />
            </Route>
            <Route path="/user-info" element={<UserInfo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
