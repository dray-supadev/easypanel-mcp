import http from "node:http";
import https from "node:https";

export class EasyPanelClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.token = token ?? null;
  }

  async login(email: string, password: string): Promise<string> {
    const result = await this.mutation("auth.login", { email, password });
    this.token = result.token as string;
    return this.token;
  }

  async query(procedure: string, input?: Record<string, unknown>): Promise<unknown> {
    let url = `${this.baseUrl}/api/trpc/${procedure}`;
    if (input) {
      url += `?input=${encodeURIComponent(JSON.stringify({ json: input }))}`;
    }
    return this.request("GET", url);
  }

  async mutation(procedure: string, input: Record<string, unknown>): Promise<any> {
    const url = `${this.baseUrl}/api/trpc/${procedure}`;
    return this.request("POST", url, { json: input });
  }

  private request(method: string, url: string, body?: unknown): Promise<any> {
    return new Promise((resolve, reject) => {
      const parsed = new URL(url);
      const mod = parsed.protocol === "https:" ? https : http;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (this.token) {
        headers["Authorization"] = `Bearer ${this.token}`;
      }
      const bodyStr = body ? JSON.stringify(body) : undefined;
      if (bodyStr) headers["Content-Length"] = Buffer.byteLength(bodyStr).toString();

      const req = mod.request(parsed, { method, headers }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json.error) {
              const msg = json.error?.json?.message ?? json.error?.message ?? JSON.stringify(json.error);
              reject(new Error(`tRPC error: ${msg}`));
            } else if (json.result?.data?.json !== undefined) {
              resolve(json.result.data.json);
            } else {
              resolve(json);
            }
          } catch {
            reject(new Error(`Invalid response: ${data.slice(0, 500)}`));
          }
        });
      });
      req.on("error", reject);
      if (bodyStr) req.write(bodyStr);
      req.end();
    });
  }
}
