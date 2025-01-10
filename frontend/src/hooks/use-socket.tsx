import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "src/contexts/auth";

const useSocket = (): Socket | null => {
  const socketRef = useRef<Socket | null>(null);
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    const url = import.meta.env.VITE_SOCKET_URL;
    const socket = io(url, { query: { userId: user!.id } });
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsSocketInitialized(true);
    });

    socket.on("disconnect", () => {
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
