/**
 * HTTP server wrapper for MCP — enables remote deployment.
 * Creates a new transport per session to avoid "already initialized" errors.
 */

import { createServer } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const API_KEY = process.env.MCP_API_KEY;

function checkAuth(req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse): boolean {
  if (!API_KEY) return true;
  
  const auth = req.headers.authorization;
  if (auth === `Bearer ${API_KEY}`) return true;
  
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  if (url.searchParams.get("api_key") === API_KEY) return true;

  res.writeHead(401, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Unauthorized. Set Authorization: Bearer <MCP_API_KEY>" }));
  return false;
}

export async function startHttpServer(createMcpServer: () => McpServer, port: number) {
  const sessions = new Map<string, { transport: StreamableHTTPServerTransport; server: McpServer }>();

  const httpServer = createServer(async (req, res) => {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Mcp-Session-Id");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
    
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    // Health check
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", tools: 40, auth: !!API_KEY, sessions: sessions.size }));
      return;
    }

    if (!checkAuth(req, res)) return;

    const pathname = new URL(req.url || "/", `http://${req.headers.host}`).pathname;
    if (pathname !== "/mcp") {
      res.writeHead(404);
      res.end("Not found. MCP endpoint: /mcp");
      return;
    }

    // Check for existing session
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    
    if (sessionId && sessions.has(sessionId)) {
      // Existing session
      const session = sessions.get(sessionId)!;
      await session.transport.handleRequest(req, res);
      return;
    }

    if (sessionId && !sessions.has(sessionId)) {
      // Unknown session — tell client to reinitialize
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Session not found. Please reinitialize." }));
      return;
    }

    // New session — create transport + server
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
      onsessioninitialized: (id) => {
        sessions.set(id, { transport, server });
      },
    });

    const server = createMcpServer();
    
    // Clean up on close
    transport.onclose = () => {
      const id = [...sessions.entries()].find(([, v]) => v.transport === transport)?.[0];
      if (id) sessions.delete(id);
    };

    await server.connect(transport);
    await transport.handleRequest(req, res);
  });

  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`EasyPanel MCP server running at http://0.0.0.0:${port}/mcp`);
    console.log(`Auth: ${API_KEY ? "enabled" : "disabled"}`);
  });
}
