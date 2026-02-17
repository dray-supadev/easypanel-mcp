# EasyPanel API Schemas

## Auth
- **POST** `auth.login` — `{json:{email,password}}` → `{token: string}`
- **Bearer Token** — `Authorization: Bearer <token>` header

## Response Format
tRPC + superjson:
```json
{"result":{"data":{"json": <actual_data>, "meta": {...}}}}
```
Error:
```json
{"error":{"json":{"message":"...","code":-32001,"data":{"code":"UNAUTHORIZED","httpStatus":401,"path":"...","zodErrors":null}}}}
```

## Queries (GET)
- No input: `GET /api/trpc/<router>.<procedure>`
- With input: `GET /api/trpc/<router>.<procedure>?input=<url-encoded-json>`
  - Input format: `{"json":{...}}`

## Mutations (POST)
- `POST /api/trpc/<router>.<procedure>` with body `{"json":{...}}`

## Tested Schemas

### projects.listProjects
- Input: none
- Output: `[{name: string, createdAt: Date}]`

### projects.inspectProject
- Input: `{projectName: string}`
- Output: `{project: {name, createdAt}, services: []}`

### monitor.getSystemStats
- Input: none
- Output: `{uptime, memInfo: {totalMemMb, usedMemMb, freeMemMb, usedMemPercentage, freeMemPercentage}, diskInfo: {totalGb, usedGb, freeGb, usedPercentage, freePercentage}, cpuInfo: {usedPercentage, count, loadavg}, network: {inputMb, outputMb}}`

### settings.getServerIp
- Input: none
- Output: string (IP)
