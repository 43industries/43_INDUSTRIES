export const onboardingSteps = [
  {
    id: "profile",
    title: "Complete profile basics",
    detail: "Add your role, focus area, and what you're building so members can help faster.",
    points: 40,
  },
  {
    id: "intro",
    title: "Post an intro thread",
    detail: "Share your project context plus one concrete challenge you want feedback on.",
    points: 60,
  },
  {
    id: "library-reflection",
    title: "Add one library reflection",
    detail: "Comment on a research entry with a practical takeaway and next action.",
    points: 50,
  },
  {
    id: "challenge",
    title: "Join the weekly challenge",
    detail: "Submit one measurable improvement tied to this week's prompt and community norms.",
    points: 80,
  },
] as const;

export const weeklyChallenges = [
  {
    id: "signal-sprint",
    title: "Signal Sprint",
    prompt: "Find one operational bottleneck and propose a measurable fix.",
    reward: 120,
  },
  {
    id: "thread-builder",
    title: "Thread Builder",
    prompt: "Post a practical framework and get two substantive replies.",
    reward: 90,
  },
  {
    id: "knowledge-loop",
    title: "Knowledge Loop",
    prompt: "Connect a library insight to an active community discussion.",
    reward: 70,
  },
] as const;

export const onboardingPointsById = Object.fromEntries(
  onboardingSteps.map((step) => [step.id, step.points]),
) as Record<string, number>;

export const challengeRewardsById = Object.fromEntries(
  weeklyChallenges.map((challenge) => [challenge.id, challenge.reward]),
) as Record<string, number>;

export const leaderboardSeed = [
  { id: "alpha-forge", name: "Alpha Forge", points: 1420, streak: 8 },
  { id: "ops-collective", name: "Ops Collective", points: 1290, streak: 6 },
  { id: "grid-systems", name: "Grid Systems", points: 1175, streak: 5 },
  { id: "delta-labs", name: "Delta Labs", points: 1040, streak: 4 },
] as const;
