import { z } from "zod";

export const ps = {
  projectName: z.string().describe("Project name"),
  serviceName: z.string().describe("Service name"),
};

export function ok(r: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(r, null, 2) }] };
}
