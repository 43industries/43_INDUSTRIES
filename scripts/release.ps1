param(
  [switch]$SkipChecks,
  [switch]$SkipDeploy
)

$ErrorActionPreference = "Stop"

function Step($Message) {
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function EnsureCommand($Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command '$Name' not found in PATH."
  }
}

EnsureCommand "npm"
EnsureCommand "vercel"

if (-not $SkipChecks) {
  Step "Install dependencies"
  npm install
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

  Step "Generate Prisma client"
  npm run prisma:generate
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

  Step "Lint"
  npm run lint
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

  Step "Typecheck"
  npm run typecheck
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

  Step "Tests"
  npm run test
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

  Step "Build"
  npm run build
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

if ($SkipDeploy) {
  Step "Deploy skipped"
  exit 0
}

Step "Deploying to Vercel production"
vercel --prod
exit $LASTEXITCODE
