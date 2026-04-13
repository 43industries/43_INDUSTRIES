import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const nextPath = path.join(process.cwd(), ".next");
const nextLockPath = path.join(nextPath, "lock");

if (existsSync(nextLockPath)) {
  rmSync(nextLockPath, { force: true });
  console.log("Removed stale .next lock file.");
}

if (existsSync(nextPath)) {
  try {
    rmSync(nextPath, { recursive: true, force: true });
    console.log("Removed stale .next build artifacts.");
  } catch (error) {
    console.warn("Could not fully remove .next. Continuing build cleanup.", error);
  }
}

const MAX_ATTEMPTS = 4;
const RETRY_DELAY_MS = 1500;

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
  try {
    execSync("npx prisma generate", { stdio: "inherit" });
    break;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isLastAttempt = attempt === MAX_ATTEMPTS;
    const isBusyLock = /EBUSY|resource busy or locked/i.test(message);

    if (!isBusyLock || isLastAttempt) {
      throw error;
    }

    console.warn(
      `Prisma generate hit a transient file lock (attempt ${attempt}/${MAX_ATTEMPTS}). Retrying...`,
    );
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, RETRY_DELAY_MS);
  }
}
