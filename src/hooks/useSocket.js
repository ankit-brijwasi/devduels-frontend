import { useContext } from "react";
import { SocketContext } from "../context/socketContext";


export default function useSocket() {
    return useContext(SocketContext)
}