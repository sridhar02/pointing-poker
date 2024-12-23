import { applyWSSHandler } from "@trpc/server/adapters/ws";
import WebSocket, { WebSocketServer } from "ws";
import { appRouter } from "./api/root";
import { createTRPCContext } from "./api/trpc";

const wss = new WebSocketServer({ port: 3001 });
const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createTRPCContext,
});

wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});

console.log("WebSocket server is running on ws://localhost:3001");
