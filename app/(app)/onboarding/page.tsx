import Link from "next/link";
import { OnboardingChecklist } from "@/components/onboarding-checklist";
import { requireSocietyUser } from "@/lib/society-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await requireSocietyUser();
  const onboarding = await prisma.onboardingCompletion.findMany({
    where: { userId: user.id },
    select: { stepId: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Onboarding</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Start strong in 43 Industries</h1>
      <p className="mt-4 max-w-2xl text-zinc-400">
        Complete your first guided actions to unlock reputation, learn society norms, and
        build visible momentum in your profile.
      </p>
      <div className="mt-8">
        <OnboardingChecklist initialCompleted={onboarding.map((row) => row.stepId)} />
      </div>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex text-sm font-medium text-yellow-300 hover:text-yellow-200"
      >
        ← Back to dashboard
      </Link>
    </div>
  );
}
