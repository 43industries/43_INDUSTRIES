import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function upsertUser(clerkId: string, name: string) {
  return prisma.user.upsert({
    where: { clerkId },
    update: { name },
    create: { clerkId, name },
  });
}

async function main() {
  const founder = await upsertUser("seed-founder", "Founder Prime");
  const chiefA = await upsertUser("seed-chief-alpha", "Chief Nyx");
  const chiefB = await upsertUser("seed-chief-beta", "Chief Orion");
  const chiefC = await upsertUser("seed-chief-gamma", "Chief Vega");
  const elder = await upsertUser("seed-elder", "Elder Sol");
  const member = await upsertUser("seed-member", "Recruit Echo");

  const clanSeeds = [
    {
      name: "Neon Vanguard",
      slug: "neon-vanguard",
      description: "High-tempo operators for strategy, systems, and live challenge pushes.",
      manifesto: "Speed with discipline. Win with signal.",
      rules: "Bring evidence, ship weekly, respect the chain.",
      chiefId: chiefA.id,
      subClans: [
        { name: "Signal Hunters", slug: "signal-hunters", purpose: "Intel and pattern scouting." },
        { name: "Ops Circuit", slug: "ops-circuit", purpose: "Execution systems and operational fixes." },
      ],
    },
    {
      name: "Atlas Syndicate",
      slug: "atlas-syndicate",
      description: "Builders focused on scalable frameworks, alliances, and faction growth.",
      manifesto: "Build durable leverage.",
      rules: "No noise, only useful output.",
      chiefId: chiefB.id,
      subClans: [
        { name: "Forge Cell", slug: "forge-cell", purpose: "Framework and template creation." },
        { name: "Alliance Desk", slug: "alliance-desk", purpose: "Partnerships and diplomacy." },
      ],
    },
    {
      name: "Pulse Collective",
      slug: "pulse-collective",
      description: "Community momentum engine for narrative, engagement, and retention loops.",
      manifesto: "Culture compounds.",
      rules: "Contribute with clarity and intent.",
      chiefId: chiefC.id,
      subClans: [
        { name: "Lore Engine", slug: "lore-engine", purpose: "World narrative and faction chronicles." },
        { name: "Retention Lab", slug: "retention-lab", purpose: "Challenge design and onboarding loops." },
      ],
    },
  ] as const;

  const clans = [];
  for (const seed of clanSeeds) {
    const clan = await prisma.clan.upsert({
      where: { slug: seed.slug },
      update: {
        description: seed.description,
        manifesto: seed.manifesto,
        rules: seed.rules,
      },
      create: {
        name: seed.name,
        slug: seed.slug,
        description: seed.description,
        manifesto: seed.manifesto,
        rules: seed.rules,
        createdById: founder.id,
        visibility: "PUBLIC",
      },
    });
    clans.push(clan);

    await prisma.clanMembership.upsert({
      where: { userId_clanId: { userId: founder.id, clanId: clan.id } },
      update: { role: "FOUNDER", status: "ACTIVE" },
      create: { userId: founder.id, clanId: clan.id, role: "FOUNDER", status: "ACTIVE" },
    });
    await prisma.clanMembership.upsert({
      where: { userId_clanId: { userId: seed.chiefId, clanId: clan.id } },
      update: { role: "CHIEF", status: "ACTIVE" },
      create: { userId: seed.chiefId, clanId: clan.id, role: "CHIEF", status: "ACTIVE" },
    });
    await prisma.clanMembership.upsert({
      where: { userId_clanId: { userId: elder.id, clanId: clan.id } },
      update: { role: "ELDER", status: "ACTIVE" },
      create: { userId: elder.id, clanId: clan.id, role: "ELDER", status: "ACTIVE" },
    });
    await prisma.clanMembership.upsert({
      where: { userId_clanId: { userId: member.id, clanId: clan.id } },
      update: { role: "MEMBER", status: "ACTIVE" },
      create: { userId: member.id, clanId: clan.id, role: "MEMBER", status: "ACTIVE" },
    });

    await prisma.leadershipTerm.createMany({
      data: [
        {
          clanId: clan.id,
          userId: founder.id,
          role: "FOUNDER",
          startsAt: new Date("2026-01-01T00:00:00.000Z"),
          source: "APPOINTMENT",
        },
        {
          clanId: clan.id,
          userId: seed.chiefId,
          role: "CHIEF",
          startsAt: new Date("2026-02-01T00:00:00.000Z"),
          source: "APPOINTMENT",
        },
      ],
      skipDuplicates: true,
    });

    for (const sub of seed.subClans) {
      const subClan = await prisma.subClan.upsert({
        where: { clanId_slug: { clanId: clan.id, slug: sub.slug } },
        update: { name: sub.name, purpose: sub.purpose },
        create: { clanId: clan.id, name: sub.name, slug: sub.slug, purpose: sub.purpose },
      });

      await prisma.subClanMembership.upsert({
        where: { userId_subClanId: { userId: seed.chiefId, subClanId: subClan.id } },
        update: { role: "CHIEF_DELEGATE" },
        create: { userId: seed.chiefId, subClanId: subClan.id, role: "CHIEF_DELEGATE" },
      });
      await prisma.subClanMembership.upsert({
        where: { userId_subClanId: { userId: elder.id, subClanId: subClan.id } },
        update: { role: "LEAD" },
        create: { userId: elder.id, subClanId: subClan.id, role: "LEAD" },
      });
      await prisma.subClanMembership.upsert({
        where: { userId_subClanId: { userId: member.id, subClanId: subClan.id } },
        update: { role: "MEMBER" },
        create: { userId: member.id, subClanId: subClan.id, role: "MEMBER" },
      });
    }
  }

  const season = await prisma.season.upsert({
    where: { id: "seed-season-s1" },
    update: { name: "Season 01: Dawn Protocol", status: "ACTIVE" },
    create: {
      id: "seed-season-s1",
      name: "Season 01: Dawn Protocol",
      status: "ACTIVE",
      startsAt: new Date("2026-04-01T00:00:00.000Z"),
      endsAt: new Date("2026-06-30T23:59:59.000Z"),
    },
  });

  for (const clan of clans) {
    await prisma.clanChallenge.upsert({
      where: { id: `seed-challenge-${clan.slug}` },
      update: {
        title: `${clan.name} Weekly Mission`,
        rules: "Ship one measurable improvement and publish proof in the clan feed.",
        points: 120,
      },
      create: {
        id: `seed-challenge-${clan.slug}`,
        seasonId: season.id,
        clanId: clan.id,
        title: `${clan.name} Weekly Mission`,
        rules: "Ship one measurable improvement and publish proof in the clan feed.",
        points: 120,
      },
    });
  }

  const electionClan = clans[0];
  const election = await prisma.election.upsert({
    where: { id: "seed-election-neon-vanguard" },
    update: {
      status: "OPEN",
      startsAt: new Date("2026-04-10T00:00:00.000Z"),
      endsAt: new Date("2026-04-24T00:00:00.000Z"),
      termMonths: 3,
    },
    create: {
      id: "seed-election-neon-vanguard",
      clanId: electionClan.id,
      createdById: founder.id,
      status: "OPEN",
      startsAt: new Date("2026-04-10T00:00:00.000Z"),
      endsAt: new Date("2026-04-24T00:00:00.000Z"),
      termMonths: 3,
    },
  });

  await prisma.electionCandidate.upsert({
    where: { electionId_userId: { electionId: election.id, userId: chiefA.id } },
    update: {},
    create: { electionId: election.id, userId: chiefA.id },
  });
  await prisma.electionCandidate.upsert({
    where: { electionId_userId: { electionId: election.id, userId: elder.id } },
    update: {},
    create: { electionId: election.id, userId: elder.id },
  });

  await prisma.electionVote.upsert({
    where: { electionId_voterId: { electionId: election.id, voterId: member.id } },
    update: { candidateId: chiefA.id },
    create: { electionId: election.id, voterId: member.id, candidateId: chiefA.id },
  });

  console.log("Seeded clans, sub-clans, season, challenges, and election.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
