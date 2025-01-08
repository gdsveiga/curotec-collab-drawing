import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (): Socket | null => {
  const socketRef = useRef<Socket | null>(null);
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);

  useEffect(() => {
    const url = import.meta.env.VITE_SOCKET_URL;
    const socket = io(url);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsSocketInitialized(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsSocketInitialized(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsSocketInitialized(false);
    };
  }, []);

  if (!isSocketInitialized) {
    return null;
  }

  return socketRef.current;
};

export default useSocket;
