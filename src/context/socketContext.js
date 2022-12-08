import { createContext, useState, useMemo, useEffect } from "react";
import { WEBSOCKET_URL } from "../utils/helpers";
import ReconnectingWebSocket from "reconnecting-websocket";


export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [error, setError] = useState(null);

  //   websocket states
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState({});

  // connect with websocket
  const socket = useMemo(
    () => new ReconnectingWebSocket(WEBSOCKET_URL + "/ws/watch"),
    []
  );

  useEffect(() => {
    if (socket) {
      socket.onopen = (e) => {
        setConnected(true);
      };

      socket.onmessage = (e) => {
        try {
          setMessage(JSON.parse(e.data));
        } catch (error) {
          setMessage(e.data);
        }
      };

      socket.onclose = (e) => {
        setConnected(false);
      };

      socket.onerror = (e) => {
        console.log("websocket error: ", e);
        setError(e);
      };
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={[connected, error, message, socket]}>
      {children}
    </SocketContext.Provider>
  );
}
