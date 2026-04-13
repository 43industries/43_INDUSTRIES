import { z } from "zod";

const baseEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
});

const rewardsEnvSchema = z.object({
  XRPL_NODE: z.string().min(1),
  DISTRIBUTOR_ADDRESS: z.string().min(1),
  DISTRIBUTOR_SECRET: z.string().min(1),
  ISSUER_ADDRESS: z.string().min(1),
  CURRENCY_CODE: z.string().min(1),
});

function formatIssues(issues: z.ZodIssue[]) {
  return issues.map((issue) => issue.path.join(".")).filter(Boolean);
}

export function validateBaseEnv() {
  const parsed = baseEnvSchema.safeParse(process.env);
  return {
    ok: parsed.success,
    missing: parsed.success ? [] : formatIssues(parsed.error.issues),
  };
}

export function validateRewardsEnv() {
  const parsed = rewardsEnvSchema.safeParse(process.env);
  return {
    ok: parsed.success,
    missing: parsed.success ? [] : formatIssues(parsed.error.issues),
  };
}
