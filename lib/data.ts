import { prisma } from "@/lib/prisma";

export const getExploreUniverses = async () => {
  return prisma.universe.findMany({
    where: { parentId: null },
    include: { children: { include: { children: true } } },
    orderBy: { name: "asc" }
  });
};

export const getHomeFeed = async () =>
  prisma.post.findMany({
    include: { user: true, attachments: { include: { universe: true, item: true } }, likes: true, comments: true },
    orderBy: { createdAt: "desc" },
    take: 12
  });
