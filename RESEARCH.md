# EasyPanel API Research

## Test Server
- IP: 45.145.168.205
- Port: 3000
- Login: test@easypanel.dev / TestPanel123!
- SSH: root (key: ~/.ssh/easypanel_test)
- EasyPanel v2.26.3

## API Architecture
- **Protocol:** tRPC over HTTP
- **Base URL:** `http://<host>:3000/api/trpc/`
- **Auth:** Cookie-based session (set via auth.login)
- **Queries:** GET `/api/trpc/<router>.<procedure>?input={json:{...}}`
- **Mutations:** POST `/api/trpc/<router>.<procedure>` with JSON body

## Routers (34 namespaces)
actions, app, auth, box, branding, certificates, cloudflareTunnel, 
cluster, common, compose, databaseBackups, dockerBuilders, domains, 
dropbox, ftp, git, google, lemonLicense, local, mariadb, middlewares, 
mongo, monitor, mounts, mysql, notifications, portalLicense, ports, 
postgres, projects, redis, server, settings, setup, sftp, traefik, 
twoFactor, update, users, volumeBackups, wordpress

## Total Endpoints: 341
- Queries: ~100
- Mutations: ~241

## Key Endpoints for MCP
### Must-have (Phase 1)
- projects.* (CRUD + inspect)
- app.* (deploy, start/stop, inspect, env)
- domains.* (CRUD)
- settings.* (server config)
- monitor.* (stats)
- auth.login

### Nice-to-have (Phase 2)
- postgres/mysql/mongo/mariadb/redis.* (databases)
- compose.* (docker compose services)
- certificates.* 
- mounts.*
- ports.*
- notifications.*

### Phase 3
- box.* (dev environments)
- wordpress.* (WP management)
- cloudflareTunnel.*
- volumeBackups/databaseBackups.*
