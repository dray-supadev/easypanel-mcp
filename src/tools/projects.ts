import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EasyPanelClient } from "../client.js";
import { ok } from "./helpers.js";

export function registerProjectTools(server: McpServer, client: EasyPanelClient) {
  server.tool("easypanel_list_projects", "List all projects", {}, async () =>
    ok(await client.query("projects.listProjects")));

  server.tool("easypanel_create_project", "Create a new project", {
    name: z.string(),
  }, async ({ name }) => ok(await client.mutation("projects.createProject", { name })));

  server.tool("easypanel_destroy_project", "Destroy a project", {
    projectName: z.string(),
  }, async (a) => ok(await client.mutation("projects.destroyProject", a)));

  server.tool("easypanel_inspect_project", "Inspect project details", {
    projectName: z.string(),
  }, async (a) => ok(await client.query("projects.inspectProject", a)));

  server.tool("easypanel_list_projects_and_services", "List all projects with services", {}, async () =>
    ok(await client.query("projects.listProjectsAndServices")));

  server.tool("easypanel_can_create_project", "Check if you can create a project", {}, async () =>
    ok(await client.query("projects.canCreateProject")));

  server.tool("easypanel_get_docker_containers", "Get Docker containers for a project", {
    projectName: z.string(),
  }, async (a) => ok(await client.query("projects.getDockerContainers", a)));

  server.tool("easypanel_update_project_access", "Update project access", {
    projectName: z.string(),
    userIds: z.array(z.string()).optional(),
  }, async (a) => ok(await client.mutation("projects.updateAccess", a)));

  server.tool("easypanel_update_project_env", "Update project-level environment variables", {
    projectName: z.string(),
    env: z.string().describe("KEY=VALUE lines"),
  }, async (a) => ok(await client.mutation("projects.updateProjectEnv", a)));
}
