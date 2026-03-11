import { prisma } from "@/lib/db";

async function main() {
  await prisma.post.createMany({
    data: [
      { title: "Hello Prisma" },
      { title: "Prisma + Next.js is easy" },
      { title: "Postgres for quick demos" },
    ],
  });

  console.log(`[seed] Data seeded successfully✅`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
