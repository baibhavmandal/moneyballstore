import { useEffect, useState } from "react";
import io from "socket.io-client";

function useWebSocket(SERVER_URL, SOCKET_PATH) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize the socket connection when the component mounts
    const socketInstance = io(SERVER_URL, {
      path: SOCKET_PATH,
      // You can add any additional configuration options here
    });

    // Handle any events or listeners specific to your application
    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server");
      // You can add any logic for handling connection here
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      // You can add any logic for handling disconnection here
    });

    // Store the socket instance in state
    setSocket(socketInstance);

    // Cleanup the socket connection when the component unmounts
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []); // Empty dependency array to run this effect only once

  return socket;
}

export default useWebSocket;
