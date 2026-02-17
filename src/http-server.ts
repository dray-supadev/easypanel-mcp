/**
 * HTTP server wrapper for MCP — enables remote deployment.
 * Run with EASYPANEL_MCP_MODE=http to start as HTTP server.
 */

import { createServer } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

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

    // Health check
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", tools: 40 }));
      return;
    }

    // MCP endpoint
    if (req.url === "/mcp") {
      await transport.handleRequest(req, res);
      return;
    }

    res.writeHead(404);
    res.end("Not found. MCP endpoint: /mcp");
  });

  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`EasyPanel MCP server running at http://0.0.0.0:${port}/mcp`);
  });
}
