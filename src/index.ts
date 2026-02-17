#!/usr/bin/env node
/**
 * EasyPanel MCP Server — Namespace-based tools
 * 
 * Each EasyPanel namespace = one MCP tool with an `action` parameter.
 * ~25 tools covering 347 tRPC procedures.
 *
 * Env:
 *   EASYPANEL_URL   - Panel URL
 *   EASYPANEL_TOKEN - API token
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { EasyPanelClient } from "./client.js";

const EP_URL = process.env.EASYPANEL_URL;
const EP_TOKEN = process.env.EASYPANEL_TOKEN;

if (!EP_URL) { console.error("EASYPANEL_URL required"); process.exit(1); }
if (!EP_TOKEN) { console.error("EASYPANEL_TOKEN required"); process.exit(1); }

const client = new EasyPanelClient(EP_URL, EP_TOKEN);

const server = new McpServer({ name: "easypanel", version: "0.2.0" });

function ok(r: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(r, null, 2) }] };
}

function err(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  return { content: [{ type: "text" as const, text: `Error: ${msg}` }], isError: true as const };
}

async function call(action: string, input: Record<string, unknown> | undefined, mutations: string[]) {
  try {
    const isMutation = mutations.includes(action.split(".").pop()!);
    const result = isMutation
      ? await client.mutation(action, input ?? {})
      : await client.query(action, input as any);
    return ok(result);
  } catch (e) { return err(e); }
}

// === PROJECTS ===
server.tool("projects", "Manage EasyPanel projects. Actions: listProjects, listProjectsAndServices, inspectProject, createProject, destroyProject, canCreateProject, getDockerContainers, updateAccess, updateProjectEnv", {
  action: z.enum(["listProjects", "listProjectsAndServices", "inspectProject", "createProject", "destroyProject", "canCreateProject", "getDockerContainers", "updateAccess", "updateProjectEnv"]),
  input: z.record(z.string(), z.unknown()).optional().describe("Input fields: projectName, name, etc."),
}, async ({ action, input }) => call(`projects.${action}`, input, ["createProject", "destroyProject", "updateAccess", "updateProjectEnv"]));

// === APP SERVICES ===
server.tool("app", "Manage app services (Docker/Git/GitHub deploys). Actions: inspectService, createService, deployService, startService, stopService, restartService, destroyService, updateEnv, updateSourceImage, updateSourceGithub, updateSourceGit, updateSourceDockerfile, updateBuild, updateDeploy, updateResources, updateRedirects, updateBasicAuth, updateMaintenance, getExposedPorts, refreshDeployToken, enableGithubDeploy, disableGithubDeploy", {
  action: z.enum(["inspectService", "createService", "deployService", "startService", "stopService", "restartService", "destroyService", "updateEnv", "updateSourceImage", "updateSourceGithub", "updateSourceGit", "updateSourceDockerfile", "updateBuild", "updateDeploy", "updateResources", "updateRedirects", "updateBasicAuth", "updateMaintenance", "getExposedPorts", "refreshDeployToken", "enableGithubDeploy", "disableGithubDeploy"]),
  input: z.record(z.string(), z.unknown()).optional().describe("Fields: projectName, serviceName, image, env, owner, repo, branch, etc."),
}, async ({ action, input }) => call(`app.${action}`, input, ["createService", "deployService", "startService", "stopService", "restartService", "destroyService", "updateEnv", "updateSourceImage", "updateSourceGithub", "updateSourceGit", "updateSourceDockerfile", "updateBuild", "updateDeploy", "updateResources", "updateRedirects", "updateBasicAuth", "updateMaintenance", "refreshDeployToken", "enableGithubDeploy", "disableGithubDeploy"]));

// === COMPOSE ===
server.tool("compose", "Manage Docker Compose services. Actions: inspectService, createService, deployService, startService, stopService, restartService, destroyService, updateEnv, updateSourceGit, updateSourceInline, updateBasicAuth, updateMaintenance, updateRedirects, refreshDeployToken, getDockerServices, getIssues", {
  action: z.enum(["inspectService", "createService", "deployService", "startService", "stopService", "restartService", "destroyService", "updateEnv", "updateSourceGit", "updateSourceInline", "updateBasicAuth", "updateMaintenance", "updateRedirects", "refreshDeployToken", "getDockerServices", "getIssues"]),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`compose.${action}`, input, ["createService", "deployService", "startService", "stopService", "restartService", "destroyService", "updateEnv", "updateSourceGit", "updateSourceInline", "updateBasicAuth", "updateMaintenance", "updateRedirects", "refreshDeployToken"]));

// === DATABASES (unified) ===
server.tool("database", "Manage database services (postgres, mysql, mariadb, mongo, redis). Actions: inspectService, createService, destroyService, enableService, disableService, exposeService, updateCredentials, updateResources, updateAdvanced, enableDbGate, disableDbGate + DB-specific: enablePgWeb/disablePgWeb (postgres), enablePhpMyAdmin/disablePhpMyAdmin (mysql/mariadb), enableMongoExpress/disableMongoExpress (mongo), enableRedisCommander/disableRedisCommander (redis)", {
  engine: z.enum(["postgres", "mysql", "mariadb", "mongo", "redis"]),
  action: z.string().describe("Action name (e.g. inspectService, createService, enablePgWeb)"),
  input: z.record(z.string(), z.unknown()).optional().describe("Fields: projectName, serviceName, password, etc."),
}, async ({ engine, action, input }) => call(`${engine}.${action}`, input, ["createService", "destroyService", "enableService", "disableService", "exposeService", "updateCredentials", "updateResources", "updateAdvanced", "enableDbGate", "disableDbGate", "enablePgWeb", "disablePgWeb", "enablePhpMyAdmin", "disablePhpMyAdmin", "enableMongoExpress", "disableMongoExpress", "enableRedisCommander", "disableRedisCommander"]));

// === DOMAINS ===
server.tool("domains", "Manage domains for services. Actions: listDomains, createDomain, deleteDomain, updateDomain, getPrimaryDomain, setPrimaryDomain", {
  action: z.enum(["listDomains", "createDomain", "deleteDomain", "updateDomain", "getPrimaryDomain", "setPrimaryDomain"]),
  input: z.record(z.string(), z.unknown()).optional().describe("Fields: projectName, serviceName, host, https, port, domainId"),
}, async ({ action, input }) => call(`domains.${action}`, input, ["createDomain", "deleteDomain", "updateDomain", "setPrimaryDomain"]));

// === MONITOR ===
server.tool("monitor", "System and service monitoring. Actions: getSystemStats, getServiceStats, getStorageStats, getAdvancedStats, getDockerTaskStats, getMonitorTableData", {
  action: z.enum(["getSystemStats", "getServiceStats", "getStorageStats", "getAdvancedStats", "getDockerTaskStats", "getMonitorTableData"]),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`monitor.${action}`, input, []));

// === SETTINGS ===
server.tool("settings", "Panel settings and maintenance. Actions: getPanelDomain, setPanelDomain, getServerIp, refreshServerIp, getServiceDomain, setServiceDomain, getLetsEncryptEmail, setLetsEncryptEmail, getGithubToken, setGithubToken, getDailyDockerCleanup, setDailyDockerCleanup, cleanupDockerImages, cleanupDockerBuilder, systemPrune, restartEasypanel, checkForUpdates, checkDockerUpdate, getDemoMode, getDockerVersion, getGoogleAnalyticsMeasurementId, setGoogleAnalyticsMeasurementId, changeCredentials", {
  action: z.string().describe("Settings action name"),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`settings.${action}`, input, ["setPanelDomain", "refreshServerIp", "setServiceDomain", "setLetsEncryptEmail", "setGithubToken", "setDailyDockerCleanup", "cleanupDockerImages", "cleanupDockerBuilder", "systemPrune", "restartEasypanel", "setGoogleAnalyticsMeasurementId", "changeCredentials"]));

// === USERS ===
server.tool("users", "User management and auth. Actions: listUsers, createUser, destroyUser, updateUser, generateApiToken, revokeApiToken. Auth: login, logout, getSession, getUser. 2FA: configure, enable, disable", {
  action: z.string().describe("users.X / auth.X / twoFactor.X — pass full procedure name or just the action"),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => {
  // Smart routing: if action contains dot, use as-is; otherwise guess namespace
  let procedure = action;
  if (!action.includes(".")) {
    if (["login", "logout", "getSession", "getUser"].includes(action)) procedure = `auth.${action}`;
    else if (["configure", "enable", "disable"].includes(action)) procedure = `twoFactor.${action}`;
    else procedure = `users.${action}`;
  }
  return call(procedure, input, ["createUser", "destroyUser", "updateUser", "generateApiToken", "revokeApiToken", "login", "logout", "configure", "enable", "disable"]);
});

// === CERTIFICATES ===
server.tool("certificates", "SSL certificate management. Actions: listCertificates, removeCertificate", {
  action: z.enum(["listCertificates", "removeCertificate"]),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`certificates.${action}`, input, ["removeCertificate"]));

// === MOUNTS ===
server.tool("mounts", "Volume mount management. Actions: listMounts, createMount, updateMount, deleteMount", {
  action: z.enum(["listMounts", "createMount", "updateMount", "deleteMount"]),
  input: z.record(z.string(), z.unknown()).optional().describe("Fields: projectName, serviceName, mountPath, name, hostPath"),
}, async ({ action, input }) => call(`mounts.${action}`, input, ["createMount", "updateMount", "deleteMount"]));

// === PORTS ===
server.tool("ports", "Port exposure management. Actions: listPorts, createPort, updatePort, deletePort, deleteAllPorts", {
  action: z.enum(["listPorts", "createPort", "updatePort", "deletePort", "deleteAllPorts"]),
  input: z.record(z.string(), z.unknown()).optional().describe("Fields: projectName, serviceName, publishedPort, targetPort, protocol"),
}, async ({ action, input }) => call(`ports.${action}`, input, ["createPort", "updatePort", "deletePort", "deleteAllPorts"]));

// === MIDDLEWARES ===
server.tool("middlewares", "Traefik middleware management. Actions: listMiddlewares, createMiddleware, updateMiddleware, destroyMiddleware", {
  action: z.enum(["listMiddlewares", "createMiddleware", "updateMiddleware", "destroyMiddleware"]),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`middlewares.${action}`, input, ["createMiddleware", "updateMiddleware", "destroyMiddleware"]));

// === CLOUDFLARE TUNNEL ===
server.tool("cloudflare_tunnel", "Cloudflare Tunnel management. Actions: getConfig, setConfig, startTunnel, stopTunnel, listAccounts, listTunnels, listZones, getTunnelRules, createTunnelRule, updateTunnelRule, deleteTunnelRule", {
  action: z.enum(["getConfig", "setConfig", "startTunnel", "stopTunnel", "listAccounts", "listTunnels", "listZones", "getTunnelRules", "createTunnelRule", "updateTunnelRule", "deleteTunnelRule"]),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`cloudflareTunnel.${action}`, input, ["setConfig", "startTunnel", "stopTunnel", "createTunnelRule", "updateTunnelRule", "deleteTunnelRule"]));

// === BACKUPS ===
server.tool("backups", "Database and volume backup management. type: 'database' or 'volume'", {
  type: z.enum(["database", "volume"]),
  action: z.string().describe("database: listDatabaseBackups, createDatabaseBackup, runDatabaseBackup, restoreDatabaseBackup, updateDatabaseBackup, deleteDatabaseBackup, getServiceDatabases. volume: listVolumeBackups, listVolumeMounts, createVolumeBackup, runVolumeBackup, updateVolumeBackup, destroyVolumeBackup"),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ type, action, input }) => {
  const ns = type === "database" ? "databaseBackups" : "volumeBackups";
  return call(`${ns}.${action}`, input, ["createDatabaseBackup", "runDatabaseBackup", "restoreDatabaseBackup", "updateDatabaseBackup", "deleteDatabaseBackup", "createVolumeBackup", "runVolumeBackup", "updateVolumeBackup", "destroyVolumeBackup"]);
});

// === BACKUP PROVIDERS ===
server.tool("backup_providers", "Backup storage providers (S3, SFTP, FTP, Dropbox, Google, Local). Actions: createProvider, deleteProvider, updateProvider, disconnectProvider (dropbox/google only)", {
  provider: z.enum(["s3", "sftp", "ftp", "dropbox", "google", "local"]),
  action: z.enum(["createProvider", "deleteProvider", "updateProvider", "disconnectProvider"]),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ provider, action, input }) => call(`${provider}.${action}`, input, ["createProvider", "deleteProvider", "updateProvider", "disconnectProvider"]));

// === DOCKER BUILDERS ===
server.tool("docker_builders", "Docker builder management. Actions: listDockerBuilders, createDockerBuilder, removeDockerBuilder, stopDockerBuilder, useDockerBuilder", {
  action: z.enum(["listDockerBuilders", "createDockerBuilder", "removeDockerBuilder", "stopDockerBuilder", "useDockerBuilder"]),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`dockerBuilders.${action}`, input, ["createDockerBuilder", "removeDockerBuilder", "stopDockerBuilder", "useDockerBuilder"]));

// === NOTIFICATIONS ===
server.tool("notifications", "Notification channel management. Actions: listNotificationChannels, createNotificationChannel, updateNotificationChannel, destroyNotificationChannel, sendTestNotification", {
  action: z.enum(["listNotificationChannels", "createNotificationChannel", "updateNotificationChannel", "destroyNotificationChannel", "sendTestNotification"]),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`notifications.${action}`, input, ["createNotificationChannel", "updateNotificationChannel", "destroyNotificationChannel", "sendTestNotification"]));

// === CLUSTER ===
server.tool("cluster", "Cluster node management. Actions: listNodes, addWorkerCommand, removeNode", {
  action: z.enum(["listNodes", "addWorkerCommand", "removeNode"]),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`cluster.${action}`, input, ["addWorkerCommand", "removeNode"]));

// === TRAEFIK ===
server.tool("traefik", "Traefik proxy management. Actions: getDashboard, getEnv, setEnv, getCustomConfig, setCustomConfig, restart", {
  action: z.enum(["getDashboard", "getEnv", "setEnv", "getCustomConfig", "setCustomConfig", "restart"]),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`traefik.${action}`, input, ["setEnv", "setCustomConfig", "restart"]));

// === BRANDING ===
server.tool("branding", "Panel branding/customization. Actions: getBasicSettings, setBasicSettings, getLogoSettings, setLogoSettings, getLinksSettings, setLinksSettings, getOtherLinksSettings, getCustomCodeSettings, setCustomCodeSettings, getErrorPageSettings, setErrorPageSettings, getInterfaceSettingsPublic", {
  action: z.string().describe("Branding action"),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`branding.${action}`, input, ["setBasicSettings", "setLogoSettings", "setLinksSettings", "setCustomCodeSettings", "setErrorPageSettings"]));

// === BOX (DevBox) ===
server.tool("box", "DevBox (IDE in browser) management. Actions: inspectService, createService, destroyService, initService, startService, stopService, restartService, gitClone, runScript, runDeployScript, rebuildDockerImage, listPresets, loadPreset, refreshDeployToken, updateEnv, updateAdvanced, updateBasicAuth, updateDeployScript, updateGitConfig, updateIde, updateModules, updateNginx, updateNodejs, updatePhp, updateProcesses, updatePython, updateRedirects, updateResources, updateRuby, updateScripts", {
  action: z.string().describe("Box action name"),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`box.${action}`, input, ["createService", "destroyService", "initService", "startService", "stopService", "restartService", "gitClone", "runScript", "runDeployScript", "rebuildDockerImage", "loadPreset", "refreshDeployToken", "updateEnv", "updateAdvanced", "updateBasicAuth", "updateDeployScript", "updateGitConfig", "updateIde", "updateModules", "updateNginx", "updateNodejs", "updatePhp", "updateProcesses", "updatePython", "updateRedirects", "updateResources", "updateRuby", "updateScripts"]));

// === WORDPRESS ===
server.tool("wordpress", "WordPress site management. Actions: inspectService, createService, destroyService, startService, stopService, restartService, gitClone, runScript, rebuildDockerImage, getDatabaseServices, getPlugins, installPlugin, activatePlugin, deactivatePlugin, searchPlugin, getThemes, installTheme, activateTheme, searchTheme, getUsers, createUser, updateUser, deleteUser, getRoles, createRole, deleteRole, getOptions, createOption, updateOption, deleteOption, getProfile, getWpConfig, updateWpConfig, getMaintenanceMode, updateMaintenanceMode, flushCache, dbOptimize, mediaRegenerate, searchReplace, searchReplaceDryRun, deleteTransient, updateEnv, updateBasicAuth, updateGitConfig, updateIde, updateNginx, updatePhp, updateRedirects, updateResources, updateScripts", {
  action: z.string().describe("WordPress action name"),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`wordpress.${action}`, input, ["createService", "destroyService", "startService", "stopService", "restartService", "gitClone", "runScript", "rebuildDockerImage", "installPlugin", "activatePlugin", "deactivatePlugin", "installTheme", "activateTheme", "createUser", "updateUser", "deleteUser", "createRole", "deleteRole", "createOption", "updateOption", "deleteOption", "updateWpConfig", "updateMaintenanceMode", "flushCache", "dbOptimize", "mediaRegenerate", "searchReplace", "deleteTransient", "updateEnv", "updateBasicAuth", "updateGitConfig", "updateIde", "updateNginx", "updatePhp", "updateRedirects", "updateResources", "updateScripts"]));

// === TEMPLATES ===
server.tool("templates", "Deploy from EasyPanel one-click app templates", {
  action: z.enum(["createFromSchema"]),
  input: z.record(z.string(), z.unknown()).optional().describe("Fields: projectName, schema (template schema object)"),
}, async ({ action, input }) => call(`templates.${action}`, input, ["createFromSchema"]));

// === SERVER ===
server.tool("server", "Server-level actions. Actions: reboot", {
  action: z.enum(["reboot"]),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`server.${action}`, input, ["reboot"]));

// === GIT ===
server.tool("git", "Git key management. Actions: getPublicKey, generateKey", {
  action: z.enum(["getPublicKey", "generateKey"]),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`git.${action}`, input, ["generateKey"]));

// === ACTIONS (running tasks) ===
server.tool("actions", "View and manage running deployment actions. Actions: listActions, getAction, killAction", {
  action: z.enum(["listActions", "getAction", "killAction"]),
  input: z.record(z.string(), z.unknown()).optional(),
}, async ({ action, input }) => call(`actions.${action}`, input, ["killAction"]));

// === RAW tRPC ===
server.tool("trpc_raw", "Call any EasyPanel tRPC procedure directly (347 available). Pass full procedure name like 'namespace.action'", {
  procedure: z.string().describe("Full tRPC procedure (e.g. 'lemonLicense.activate')"),
  input: z.record(z.string(), z.unknown()).optional(),
  isMutation: z.boolean().optional().describe("true for write operations"),
}, async ({ procedure, input, isMutation }) => {
  try {
    const result = isMutation
      ? await client.mutation(procedure, input ?? {})
      : await client.query(procedure, input as any);
    return ok(result);
  } catch (e) { return err(e); }
});

const transport = new StdioServerTransport();
await server.connect(transport);
