/**
 * HTTP server wrapper for MCP — enables remote deployment.
 * 
 * Env:
 *   EASYPANEL_MCP_MODE=http  — enables HTTP mode
 *   MCP_API_KEY              — optional API key to protect the endpoint
 *   PORT                     — server port (default 3000)
 */

import { createServer } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const API_KEY = process.env.MCP_API_KEY;

function checkAuth(req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse): boolean {
  if (!API_KEY) return true; // No key = no auth (dev mode)
  
  const auth = req.headers.authorization;
  if (auth === `Bearer ${API_KEY}`) return true;
  
  // Also check query param for SSE connections
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  if (url.searchParams.get("api_key") === API_KEY) return true;

  res.writeHead(401, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Unauthorized. Set Authorization: Bearer <MCP_API_KEY>" }));
  return false;
}

export async function startHttpServer(server: McpServer, port: number) {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => crypto.randomUUID() });
  await server.connect(transport);

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

    // Health check (no auth required)
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", tools: 40, auth: !!API_KEY }));
      return;
    }

    // Auth check for MCP endpoint
    if (!checkAuth(req, res)) return;

    // MCP endpoint
    const pathname = new URL(req.url || "/", `http://${req.headers.host}`).pathname;
    if (pathname === "/mcp") {
      await transport.handleRequest(req, res);
      return;
    }

    res.writeHead(404);
    res.end("Not found. MCP endpoint: /mcp");
  });

  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`EasyPanel MCP server running at http://0.0.0.0:${port}/mcp`);
    console.log(`Auth: ${API_KEY ? "enabled (MCP_API_KEY set)" : "disabled (set MCP_API_KEY to protect)"}`);
  });
}
