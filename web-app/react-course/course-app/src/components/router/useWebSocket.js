import { Client } from "@stomp/stompjs";
import { useEffect } from "react";
import SockJS from "sockjs-client";

const WEBSOCKET_URL = "ws://localhost:8080/ws";

export const useWebsocket = (url = WEBSOCKET_URL) => {
  const socket = new SockJS("http://localhost:8080/ws");

  const client = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      login: localStorage.getItem("token"),
    },
    onDisconnect: () => {
      console.log("Disconnected from the broker");
    },
  });

  useEffect(() => {
    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return client;
};
