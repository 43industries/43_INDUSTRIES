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
  const extraMembers = await Promise.all(
    [
      ["seed-member-01", "Agent Nova"],
      ["seed-member-02", "Agent Rift"],
      ["seed-member-03", "Agent Prism"],
      ["seed-member-04", "Agent Flux"],
      ["seed-member-05", "Agent Helix"],
      ["seed-member-06", "Agent Quill"],
      ["seed-member-07", "Agent Blaze"],
      ["seed-member-08", "Agent Rune"],
      ["seed-member-09", "Agent Axis"],
      ["seed-member-10", "Agent Cipher"],
      ["seed-member-11", "Agent Drift"],
      ["seed-member-12", "Agent Pulse"],
    ].map(([clerkId, name]) => upsertUser(clerkId, name)),
  );
  const allMembers = [founder, chiefA, chiefB, chiefC, elder, member, ...extraMembers];

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
      description: "Society momentum engine for narrative, engagement, and retention loops.",
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
    for (const [index, user] of extraMembers.entries()) {
      if (index % 3 === clans.length - 1 || index % 2 === 0) {
        await prisma.clanMembership.upsert({
          where: { userId_clanId: { userId: user.id, clanId: clan.id } },
          update: { role: "MEMBER", status: "ACTIVE" },
          create: { userId: user.id, clanId: clan.id, role: "MEMBER", status: "ACTIVE" },
        });
      }
    }

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
      for (const [index, user] of extraMembers.entries()) {
        if (index % 2 === 0) {
          await prisma.subClanMembership.upsert({
            where: { userId_subClanId: { userId: user.id, subClanId: subClan.id } },
            update: { role: "MEMBER" },
            create: { userId: user.id, subClanId: subClan.id, role: "MEMBER" },
          });
        }
      }
    }

    const threadSeeds = [
      {
        title: `${clan.name} Mission Brief: Week 1`,
        body: "Post your measurable objective for this week and link the exact system you will improve.",
      },
      {
        title: `${clan.name} Intel Drop`,
        body: "Share one practical insight from the field and one action your sub-clan can execute in 72 hours.",
      },
      {
        title: `${clan.name} After Action Review`,
        body: "Report one win, one blocker, and one process correction so the rest of the clan can compound it.",
      },
    ] as const;

    const threadAuthors = [seed.chiefId, elder.id, member.id];
    for (const [idx, threadSeed] of threadSeeds.entries()) {
      const post = await prisma.post.upsert({
        where: { id: `seed-post-${clan.slug}-${idx + 1}` },
        update: {
          title: threadSeed.title,
          body: threadSeed.body,
          clanId: clan.id,
        },
        create: {
          id: `seed-post-${clan.slug}-${idx + 1}`,
          title: threadSeed.title,
          body: threadSeed.body,
          authorId: threadAuthors[idx] ?? member.id,
          clanId: clan.id,
        },
      });

      const commentAuthors = [
        extraMembers[(idx * 2) % extraMembers.length]?.id,
        extraMembers[(idx * 2 + 1) % extraMembers.length]?.id,
        elder.id,
      ].filter(Boolean) as string[];

      for (const [commentIndex, authorId] of commentAuthors.entries()) {
        await prisma.comment.upsert({
          where: { id: `seed-comment-${clan.slug}-${idx + 1}-${commentIndex + 1}` },
          update: {
            body: "Confirmed. Shipping a concrete update with proof by next sync window.",
          },
          create: {
            id: `seed-comment-${clan.slug}-${idx + 1}-${commentIndex + 1}`,
            body: "Confirmed. Shipping a concrete update with proof by next sync window.",
            postId: post.id,
            authorId,
          },
        });
      }
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

  const tagLabels = ["operations", "systems", "growth", "governance", "society", "analytics"];
  for (const label of tagLabels) {
    await prisma.tag.upsert({
      where: { label },
      update: {},
      create: { label },
    });
  }

  const librarySeeds = [
    {
      slug: "signal-driven-operations-loop",
      title: "Signal Driven Operations Loop",
      summary: "A practical model for converting weak signals into high-confidence weekly execution.",
      bodyPath: "content/library/signal-driven-operations-loop.mdx",
      tags: ["operations", "systems", "analytics"],
      clanSlug: "neon-vanguard",
    },
    {
      slug: "faction-governance-handbook",
      title: "Faction Governance Handbook",
      summary: "Rules for hybrid leadership, election cadence, and conflict handling in high-growth clans.",
      bodyPath: "content/library/faction-governance-handbook.mdx",
      tags: ["governance", "society", "systems"],
      clanSlug: "atlas-syndicate",
    },
    {
      slug: "retention-by-shared-missions",
      title: "Retention by Shared Missions",
      summary: "How weekly missions and role clarity improve contribution quality and week-1 retention.",
      bodyPath: "content/library/retention-by-shared-missions.mdx",
      tags: ["growth", "society", "analytics"],
      clanSlug: "pulse-collective",
    },
  ] as const;

  for (const [index, entry] of librarySeeds.entries()) {
    const libraryEntry = await prisma.libraryEntry.upsert({
      where: { slug: entry.slug },
      update: {
        title: entry.title,
        summary: entry.summary,
        bodyPath: entry.bodyPath,
        publishedAt: new Date("2026-04-12T00:00:00.000Z"),
      },
      create: {
        title: entry.title,
        slug: entry.slug,
        summary: entry.summary,
        bodyPath: entry.bodyPath,
        publishedAt: new Date("2026-04-12T00:00:00.000Z"),
      },
    });

    const tagConnections = await Promise.all(
      entry.tags.map(async (label) => {
        const tag = await prisma.tag.findUniqueOrThrow({ where: { label } });
        return { id: tag.id };
      }),
    );

    await prisma.libraryEntry.update({
      where: { id: libraryEntry.id },
      data: { tags: { set: tagConnections } },
    });

    const clan = clans.find((candidate) => candidate.slug === entry.clanSlug);
    if (!clan) continue;

    const discussPost = await prisma.post.upsert({
      where: { id: `seed-library-discuss-${entry.slug}` },
      update: {
        clanId: clan.id,
        title: `Discuss: ${entry.title}`,
        body: `Library entry published: /library/${entry.slug}\n\nQuestion: What one tactic from this entry should our clan apply this week?`,
      },
      create: {
        id: `seed-library-discuss-${entry.slug}`,
        clanId: clan.id,
        title: `Discuss: ${entry.title}`,
        body: `Library entry published: /library/${entry.slug}\n\nQuestion: What one tactic from this entry should our clan apply this week?`,
        authorId: [chiefA.id, chiefB.id, chiefC.id][index] ?? elder.id,
      },
    });

    await prisma.comment.upsert({
      where: { id: `seed-library-comment-${entry.slug}-1` },
      update: {
        body: "Action selected: we will pilot this in one squad and share metrics in 7 days.",
      },
      create: {
        id: `seed-library-comment-${entry.slug}-1`,
        body: "Action selected: we will pilot this in one squad and share metrics in 7 days.",
        postId: discussPost.id,
        authorId: elder.id,
      },
    });
  }

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

  for (const [index, user] of allMembers.entries()) {
    const points = 220 + index * 55;
    await prisma.profileProgress.upsert({
      where: { userId: user.id },
      update: {
        points,
        xp: points,
        reputation: Math.floor(points / 4),
        seasonScore: Math.floor(points / 2),
        level: Math.max(1, Math.floor(points / 250) + 1),
        title: points > 700 ? "Vanguard" : points > 400 ? "Operative" : "Recruit",
        lastEventAt: new Date(),
      },
      create: {
        userId: user.id,
        points,
        xp: points,
        reputation: Math.floor(points / 4),
        seasonScore: Math.floor(points / 2),
        level: Math.max(1, Math.floor(points / 250) + 1),
        title: points > 700 ? "Vanguard" : points > 400 ? "Operative" : "Recruit",
        lastEventAt: new Date(),
      },
    });
  }

  console.log(
    "Seeded clans, sub-clans, members, posts, comments, library entries, season, challenges, election, and progression.",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
