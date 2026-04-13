import { existsSync, unlinkSync } from "node:fs";
import path from "node:path";

const lockPath = path.join(process.cwd(), ".next", "lock");

if (existsSync(lockPath)) {
  unlinkSync(lockPath);
  console.log("Removed stale .next lock file.");
}
