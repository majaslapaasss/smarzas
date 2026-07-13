// Copies the built storefront into the API server's dist folder so a single
// Node process can serve both the API and the frontend in production.
// Run after `pnpm -r run build` (see the root `build:deploy` script).
import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientBuild = path.join(root, "artifacts", "scent-outlet", "dist", "public");
const serverPublic = path.join(root, "artifacts", "api-server", "dist", "public", "app");

if (!existsSync(clientBuild)) {
  console.error(`Storefront build not found at ${clientBuild}. Run the build first.`);
  process.exit(1);
}

rmSync(serverPublic, { recursive: true, force: true });
cpSync(clientBuild, serverPublic, { recursive: true });
console.log(`Copied storefront build to ${serverPublic}`);
