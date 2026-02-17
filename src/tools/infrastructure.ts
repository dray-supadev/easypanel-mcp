import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ps, ok } from "./helpers.js";

export function registerInfrastructureTools(server: McpServer, client: EasyPanelClient) {
  // === CERTIFICATES ===
  server.tool("easypanel_list_certificates", "List SSL certificates", {}, async () =>
    ok(await client.query("certificates.listCertificates")));

  server.tool("easypanel_remove_certificate", "Remove an SSL certificate", {
    domain: z.string(),
  }, async (a) => ok(await client.mutation("certificates.removeCertificate", a)));

  // === PORTS ===
  server.tool("easypanel_list_ports", "List ports for a service", ps, async (a) =>
    ok(await client.query("ports.listPorts", a)));

  server.tool("easypanel_create_port", "Create a port mapping", {
    ...ps, published: z.number(), target: z.number(), protocol: z.string().optional(),
  }, async (a) => ok(await client.mutation("ports.createPort", a)));

  server.tool("easypanel_delete_port", "Delete a port mapping", {
    ...ps, published: z.number(), protocol: z.string().optional(),
  }, async (a) => ok(await client.mutation("ports.deletePort", a)));

  server.tool("easypanel_delete_all_ports", "Delete all ports for a service", ps, async (a) =>
    ok(await client.mutation("ports.deleteAllPorts", a)));

  server.tool("easypanel_update_port", "Update a port mapping", {
    ...ps, published: z.number(), target: z.number(), protocol: z.string().optional(),
  }, async (a) => ok(await client.mutation("ports.updatePort", a)));

  // === MOUNTS ===
  server.tool("easypanel_list_mounts", "List mounts for a service", ps, async (a) =>
    ok(await client.query("mounts.listMounts", a)));

  server.tool("easypanel_create_mount", "Create a mount", {
    ...ps, type: z.string().optional(), hostPath: z.string().optional(), mountPath: z.string().optional(), name: z.string().optional(),
  }, async (a) => ok(await client.mutation("mounts.createMount", a)));

  server.tool("easypanel_delete_mount", "Delete a mount", {
    ...ps, name: z.string().optional(), mountPath: z.string().optional(),
  }, async (a) => ok(await client.mutation("mounts.deleteMount", a)));

  server.tool("easypanel_update_mount", "Update a mount", {
    ...ps, name: z.string().optional(), hostPath: z.string().optional(), mountPath: z.string().optional(),
  }, async (a) => ok(await client.mutation("mounts.updateMount", a)));

  // === MIDDLEWARES ===
  server.tool("easypanel_list_middlewares", "List middlewares for a service", ps, async (a) =>
    ok(await client.query("middlewares.listMiddlewares", a)));

  server.tool("easypanel_create_middleware", "Create a middleware", {
    ...ps, name: z.string(), type: z.string(),
  }, async (a) => ok(await client.mutation("middlewares.createMiddleware", a)));

  server.tool("easypanel_destroy_middleware", "Destroy a middleware", {
    ...ps, name: z.string(),
  }, async (a) => ok(await client.mutation("middlewares.destroyMiddleware", a)));

  server.tool("easypanel_update_middleware", "Update a middleware", {
    ...ps, name: z.string(), type: z.string().optional(),
  }, async (a) => ok(await client.mutation("middlewares.updateMiddleware", a)));

  // === GIT ===
  server.tool("easypanel_git_get_public_key", "Get Git SSH public key", {}, async () =>
    ok(await client.query("git.getPublicKey")));

  server.tool("easypanel_git_generate_key", "Generate new Git SSH key", {}, async () =>
    ok(await client.mutation("git.generateKey", {})));

  // === TRAEFIK ===
  server.tool("easypanel_traefik_get_dashboard", "Get Traefik dashboard URL", {}, async () =>
    ok(await client.query("traefik.getDashboard")));

  server.tool("easypanel_traefik_get_env", "Get Traefik env vars", {}, async () =>
    ok(await client.query("traefik.getEnv")));

  server.tool("easypanel_traefik_set_env", "Set Traefik env vars", {
    env: z.string(),
  }, async (a) => ok(await client.mutation("traefik.setEnv", a)));

  server.tool("easypanel_traefik_get_custom_config", "Get Traefik custom config", {}, async () =>
    ok(await client.query("traefik.getCustomConfig")));

  server.tool("easypanel_traefik_set_custom_config", "Set Traefik custom config", {
    config: z.string(),
  }, async (a) => ok(await client.mutation("traefik.setCustomConfig", a)));

  server.tool("easypanel_traefik_restart", "Restart Traefik", {}, async () =>
    ok(await client.mutation("traefik.restart", {})));

  // === CLUSTER ===
  server.tool("easypanel_cluster_list_nodes", "List cluster nodes", {}, async () =>
    ok(await client.query("cluster.listNodes")));

  server.tool("easypanel_cluster_add_worker_command", "Get command to add worker node", {}, async () =>
    ok(await client.query("cluster.addWorkerCommand")));

  server.tool("easypanel_cluster_remove_node", "Remove a cluster node", {
    nodeId: z.string(),
  }, async (a) => ok(await client.mutation("cluster.removeNode", a)));

  // === DOCKER BUILDERS ===
  server.tool("easypanel_list_docker_builders", "List Docker builders", {}, async () =>
    ok(await client.query("dockerBuilders.listDockerBuilders")));

  server.tool("easypanel_create_docker_builder", "Create a Docker builder", {
    name: z.string().optional(),
  }, async (a) => ok(await client.mutation("dockerBuilders.createDockerBuilder", a)));

  server.tool("easypanel_remove_docker_builder", "Remove a Docker builder", {
    name: z.string(),
  }, async (a) => ok(await client.mutation("dockerBuilders.removeDockerBuilder", a)));

  server.tool("easypanel_stop_docker_builder", "Stop a Docker builder", {
    name: z.string(),
  }, async (a) => ok(await client.mutation("dockerBuilders.stopDockerBuilder", a)));

  server.tool("easypanel_use_docker_builder", "Set active Docker builder", {
    name: z.string(),
  }, async (a) => ok(await client.mutation("dockerBuilders.useDockerBuilder", a)));

  // === ACTIONS ===
  server.tool("easypanel_list_actions", "List running actions/builds", {
    ...ps,
  }, async (a) => ok(await client.query("actions.listActions", a)));

  server.tool("easypanel_get_action", "Get action details", {
    actionId: z.string(),
  }, async (a) => ok(await client.query("actions.getAction", a)));

  server.tool("easypanel_kill_action", "Kill a running action", {
    actionId: z.string(),
  }, async (a) => ok(await client.mutation("actions.killAction", a)));
}
