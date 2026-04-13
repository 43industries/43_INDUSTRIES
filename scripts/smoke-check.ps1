param(
  [switch]$SkipDevServer
)

$ErrorActionPreference = "Stop"

function Step($Message) {
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function WarnMsg($Message) {
  Write-Host "WARN: $Message" -ForegroundColor Yellow
}

function CheckCommand($CommandName) {
  $command = Get-Command $CommandName -ErrorAction SilentlyContinue
  if (-not $command) {
    throw "Required command '$CommandName' not found in PATH."
  }
}

Step "Environment sanity"

CheckCommand "npm"

$requiredVars = @(
  "DATABASE_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY"
)

$missing = @()
foreach ($varName in $requiredVars) {
  if (-not (Get-Item "Env:$varName" -ErrorAction SilentlyContinue)) {
    $missing += $varName
  }
}

if ($missing.Count -gt 0) {
  WarnMsg "Missing environment variables: $($missing -join ', ')"
  WarnMsg "Continue if you expect these to come from .env.local at runtime."
} else {
  Write-Host "All required environment variables are present." -ForegroundColor Green
}

$rewardsVars = @(
  "XRPL_NODE",
  "DISTRIBUTOR_ADDRESS",
  "DISTRIBUTOR_SECRET",
  "ISSUER_ADDRESS",
  "CURRENCY_CODE"
)

$missingRewards = @()
foreach ($varName in $rewardsVars) {
  if (-not (Get-Item "Env:$varName" -ErrorAction SilentlyContinue)) {
    $missingRewards += $varName
  }
}

if ($missingRewards.Count -gt 0) {
  WarnMsg "Rewards API env missing: $($missingRewards -join ', ')"
  WarnMsg "Rewards routes may fail until these are configured."
} else {
  Write-Host "Rewards API env variables are present." -ForegroundColor Green
}

Step "Prisma generate"
npm run prisma:generate

Step "Prisma migrate deploy"
npm run prisma:migrate:deploy

Step "Prisma seed"
npm run prisma:seed

Step "Lint"
npm run lint

Step "Typecheck"
npm run typecheck

Step "Tests"
npm run test

Step "Build"
npm run build

if (-not $SkipDevServer) {
  Step "Start dev server"
  Write-Host "Starting dev server in this terminal. Press Ctrl+C to stop." -ForegroundColor Gray
  npm run dev
} else {
  Step "Dev server start skipped"
}

Step "Manual verification checklist"
Write-Host @"
- Join/login flow lands on /dashboard
- Onboarding toggles persist after refresh
- Weekly challenges persist for current week
- Create thread + comment in /society and verify persistence
- Leaderboard updates from progression points
- Rewards endpoints return expected payloads:
  - /api/rewards/actions
  - /api/rewards/wallet/{address}/trustline
- Sign out and verify protected routes block or redirect
- Too-short thread/comment shows validation errors
"@
