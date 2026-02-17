import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ps, ok } from "./helpers.js";

type DbType = "postgres" | "mysql" | "mariadb" | "mongo" | "redis";

const DB_UI_TOOLS: Record<DbType, { enable: string; disable: string; label: string }[]> = {
  postgres: [{ enable: "enablePgWeb", disable: "disablePgWeb", label: "PgWeb" }, { enable: "enableDbGate", disable: "disableDbGate", label: "DbGate" }],
  mysql: [{ enable: "enablePhpMyAdmin", disable: "disablePhpMyAdmin", label: "phpMyAdmin" }, { enable: "enableDbGate", disable: "disableDbGate", label: "DbGate" }],
  mariadb: [{ enable: "enablePhpMyAdmin", disable: "disablePhpMyAdmin", label: "phpMyAdmin" }, { enable: "enableDbGate", disable: "disableDbGate", label: "DbGate" }],
  mongo: [{ enable: "enableMongoExpress", disable: "disableMongoExpress", label: "MongoExpress" }, { enable: "enableDbGate", disable: "disableDbGate", label: "DbGate" }],
  redis: [{ enable: "enableRedisCommander", disable: "disableRedisCommander", label: "RedisCommander" }, { enable: "enableDbGate", disable: "disableDbGate", label: "DbGate" }],
};

export function registerDatabaseTools(server: McpServer, client: EasyPanelClient) {
  for (const db of ["postgres", "mysql", "mariadb", "mongo", "redis"] as DbType[]) {
    server.tool(`easypanel_${db}_inspect`, `Inspect ${db} service`, ps, async (a) =>
      ok(await client.query(`${db}.inspectService`, a)));

    server.tool(`easypanel_${db}_destroy`, `Destroy ${db} service`, ps, async (a) =>
      ok(await client.mutation(`${db}.destroyService`, a)));

    server.tool(`easypanel_${db}_enable`, `Enable ${db} service`, ps, async (a) =>
      ok(await client.mutation(`${db}.enableService`, a)));

    server.tool(`easypanel_${db}_disable`, `Disable ${db} service`, ps, async (a) =>
      ok(await client.mutation(`${db}.disableService`, a)));

    server.tool(`easypanel_${db}_expose`, `Expose ${db} service port`, ps, async (a) =>
      ok(await client.mutation(`${db}.exposeService`, a)));

    server.tool(`easypanel_${db}_update_credentials`, `Update ${db} credentials`, {
      ...ps, password: z.string().optional(),
    }, async (a) => ok(await client.mutation(`${db}.updateCredentials`, a)));

    server.tool(`easypanel_${db}_update_advanced`, `Update ${db} advanced settings`, {
      ...ps, command: z.string().optional(),
    }, async (a) => ok(await client.mutation(`${db}.updateAdvanced`, a)));

    server.tool(`easypanel_${db}_update_resources`, `Update ${db} resource limits`, {
      ...ps, memoryLimit: z.number().optional(), memoryReservation: z.number().optional(), cpuLimit: z.number().optional(), cpuReservation: z.number().optional(),
    }, async (a) => ok(await client.mutation(`${db}.updateResources`, a)));

    // DB-specific UI tools
    for (const ui of DB_UI_TOOLS[db]) {
      server.tool(`easypanel_${db}_enable_${ui.label.toLowerCase().replace(/[^a-z]/g, "")}`, `Enable ${ui.label} for ${db}`, ps, async (a) =>
        ok(await client.mutation(`${db}.${ui.enable}`, a)));

      server.tool(`easypanel_${db}_disable_${ui.label.toLowerCase().replace(/[^a-z]/g, "")}`, `Disable ${ui.label} for ${db}`, ps, async (a) =>
        ok(await client.mutation(`${db}.${ui.disable}`, a)));
    }
  }
}
