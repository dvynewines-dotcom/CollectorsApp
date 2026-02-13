import { PrismaClient, UniverseType, LayoutType, DropStatus } from "@prisma/client";

const prisma = new PrismaClient();

type UniverseSeed = { name: string; type: UniverseType; children?: UniverseSeed[] };

const hierarchy: UniverseSeed[] = [
  {
    name: "Trading Cards",
    type: "CATEGORY",
    children: [
      { name: "Pokémon", type: "IP", children: [{ name: "Base Set", type: "SET" }, { name: "Neo Genesis", type: "SET" }] },
      { name: "Sports Cards", type: "IP", children: [{ name: "1986 Fleer Basketball", type: "SET" }, { name: "2018 Panini Prizm Basketball", type: "SET" }] }
    ]
  },
  {
    name: "Watches",
    type: "CATEGORY",
    children: [
      { name: "Rolex", type: "BRAND", children: [{ name: "Submariner", type: "LINE" }, { name: "Daytona", type: "LINE" }] },
      { name: "Seiko", type: "BRAND", children: [{ name: "SKX007", type: "LINE" }, { name: "Presage", type: "LINE" }] }
    ]
  },
  {
    name: "Designer Toys",
    type: "CATEGORY",
    children: [
      { name: "TMNT", type: "IP", children: [{ name: "Playmates 1988 Line", type: "LINE" }, { name: "NECA Modern Line", type: "LINE" }] },
      { name: "Hot Toys", type: "BRAND", children: [{ name: "Marvel Series", type: "LINE" }, { name: "Star Wars Series", type: "LINE" }] }
    ]
  }
];

const items = [
  ["Charizard 4/102 Holo", "Base Set", "Wizards of the Coast", 1999, 4500, 12000, 0.9, 0.98, { gradeTarget: "PSA 9+", print: "1st/Unlimited" }],
  ["Blastoise 2/102 Holo", "Base Set", "Wizards of the Coast", 1999, 900, 4000, 0.78, 0.85, { gradeTarget: "PSA 8+", holo: true }],
  ["Base Set Booster Pack", "Base Set", "Wizards of the Coast", 1999, 350, 1100, 0.82, 0.74, { artworkPool: 4 }],
  ["Michael Jordan #57", "1986 Fleer Basketball", "Fleer", 1986, 15000, 250000, 0.95, 0.99, { rookie: true }],
  ["Submariner 116610LN", "Submariner", "Rolex", 2010, 9000, 14000, 0.91, 0.7, { movement: "3135", bezel: "Ceramic" }],
  ["Submariner 5513 Vintage", "Submariner", "Rolex", 1972, 10000, 26000, 0.63, 0.88, { vintage: true, dial: "Meters First" }],
  ["SKX007J", "SKX007", "Seiko", 2004, 300, 700, 0.86, 0.5, { country: "Japan" }],
  ["SKX007K", "SKX007", "Seiko", 2004, 250, 600, 0.88, 0.46, { country: "Malaysia" }],
  ["Raphael (Loose)", "Playmates 1988 Line", "Playmates", 1988, 50, 180, 0.72, 0.44, { conditionFocus: "paint wear" }],
  ["Leonardo (Carded)", "Playmates 1988 Line", "Playmates", 1988, 180, 650, 0.68, 0.72, { cardState: "unpunched" }],
  ["Sewer Playset", "Playmates 1988 Line", "Playmates", 1989, 120, 500, 0.61, 0.58, { complete: true }],
  ["Iron Man Mark III", "Marvel Series", "Hot Toys", 2010, 250, 700, 0.76, 0.62, { scale: "1/6" }],
  ["Batman DX12", "Marvel Series", "Hot Toys", 2011, 300, 900, 0.71, 0.68, { line: "DX" }]
] as const;

const users = [
  "gradedking", "raw2psa", "popreport", "subdial", "toolwatchclub", "vintagecrown", "sewerlair", "figurevault", "nostalgia1989"
];

const roomRecipes: Record<string, { title: string; theme: string; layoutType: LayoutType; includes: string[] }> = {
  gradedking: { title: "Base Set Grails", theme: "Vault", layoutType: "VAULT", includes: ["Charizard 4/102 Holo", "Blastoise 2/102 Holo"] },
  toolwatchclub: { title: "Tool Watch Rotation", theme: "Shelf", layoutType: "SHELF", includes: ["Submariner 116610LN", "SKX007J"] },
  sewerlair: { title: "Sewer Lair Display", theme: "Shelf", layoutType: "SHELF", includes: ["Raphael (Loose)", "Sewer Playset"] }
};

async function createUniverseTree(node: UniverseSeed, parentId?: string, map = new Map<string, string>()) {
  const slug = node.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const universe = await prisma.universe.create({ data: { name: node.name, slug, type: node.type, parentId } });
  map.set(node.name, universe.id);
  for (const child of node.children ?? []) await createUniverseTree(child, universe.id, map);
  return map;
}

async function main() {
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.postAttachment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.roomItem.deleteMany();
  await prisma.room.deleteMany();
  await prisma.wantlist.deleteMany();
  await prisma.ownedInstance.deleteMany();
  await prisma.itemUniverse.deleteMany();
  await prisma.item.deleteMany();
  await prisma.followUniverse.deleteMany();
  await prisma.followUser.deleteMany();
  await prisma.drop.deleteMany();
  await prisma.report.deleteMany();
  await prisma.user.deleteMany();
  await prisma.universe.deleteMany();

  const universeMap = new Map<string, string>();
  for (const root of hierarchy) {
    const scoped = await createUniverseTree(root, undefined, universeMap);
    scoped.forEach((v, k) => universeMap.set(k, v));
  }

  const itemIdByTitle = new Map<string, string>();
  for (const [title, universeName, manufacturer, releaseYear, low, high, liquidity, rarity, attrs] of items) {
    const item = await prisma.item.create({
      data: {
        title,
        description: `${title} in the ${universeName} universe.`,
        images: ["/placeholder/item.jpg"],
        manufacturer,
        releaseYear,
        estimatedValueLow: low,
        estimatedValueHigh: high,
        liquidityScore: liquidity,
        rarityScore: rarity,
        attributes: attrs,
        identifiers: { catalogRef: title.replace(/\s+/g, "-").toUpperCase() }
      }
    });
    itemIdByTitle.set(title, item.id);
    await prisma.itemUniverse.create({ data: { itemId: item.id, universeId: universeMap.get(universeName)! } });
  }

  const createdUsers = [] as { id: string; handle: string }[];
  for (const handle of users) {
    const user = await prisma.user.create({
      data: {
        handle,
        name: handle,
        email: `${handle}@vaultverse.dev`,
        bio: `Collector in ${handle.includes("watch") || handle.includes("dial") || handle.includes("crown") ? "watches" : handle.includes("lair") || handle.includes("figure") || handle.includes("nostalgia") ? "designer toys" : "trading cards"}.`,
        avatar: "/placeholder/avatar.jpg",
        banner: "/placeholder/banner.jpg"
      }
    });
    createdUsers.push({ id: user.id, handle: user.handle });

    const domainUniverse = handle.includes("watch") || handle.includes("dial") || handle.includes("crown") ? "Watches" : handle.includes("lair") || handle.includes("figure") || handle.includes("nostalgia") ? "Designer Toys" : "Trading Cards";
    await prisma.followUniverse.create({ data: { userId: user.id, universeId: universeMap.get(domainUniverse)! } });
  }

  for (const user of createdUsers) {
    const ownedTitles = Array.from(itemIdByTitle.keys()).sort(() => 0.5 - Math.random()).slice(0, 10);
    const ownedIds: string[] = [];
    for (const title of ownedTitles) {
      const owned = await prisma.ownedInstance.create({
        data: {
          userId: user.id,
          itemId: itemIdByTitle.get(title)!,
          condition: Math.random() > 0.5 ? "Excellent" : "Very Good",
          gradingCompany: "PSA",
          grade: ["7", "8", "9"][Math.floor(Math.random() * 3)],
          purchasePrice: Math.floor(100 + Math.random() * 1000),
          notes: `Owned by @${user.handle}`,
          photos: ["/placeholder/owned.jpg"]
        }
      });
      ownedIds.push(owned.id);
    }

    const wishTitles = Array.from(itemIdByTitle.keys()).sort(() => 0.5 - Math.random()).slice(0, 3);
    for (const title of wishTitles) {
      await prisma.wantlist.create({ data: { userId: user.id, itemId: itemIdByTitle.get(title)!, note: "Future pickup" } });
    }

    const recipe = roomRecipes[user.handle] ?? { title: `${user.handle}'s Vault`, theme: "Vault", layoutType: "VAULT" as LayoutType, includes: ownedTitles.slice(0, 2) };
    const room = await prisma.room.create({
      data: {
        userId: user.id,
        title: recipe.title,
        theme: recipe.theme,
        layoutType: recipe.layoutType,
        backgroundStyle: "Midnight steel"
      }
    });

    for (const [index, title] of recipe.includes.entries()) {
      const owned = await prisma.ownedInstance.findFirst({ where: { userId: user.id, itemId: itemIdByTitle.get(title)! } });
      if (owned) await prisma.roomItem.create({ data: { roomId: room.id, ownedInstanceId: owned.id, position: index + 1 } });
    }

    for (let i = 0; i < 2; i++) {
      await prisma.post.create({
        data: {
          userId: user.id,
          text: i === 0 ? `Weekly vault update from @${user.handle}` : `Market watch: still hunting upgrades in my universe.`,
          attachments: {
            create: {
              itemId: itemIdByTitle.get(ownedTitles[i])!,
              universeId: universeMap.get(handle.includes("watch") || handle.includes("dial") || handle.includes("crown") ? "Watches" : handle.includes("lair") || handle.includes("figure") || handle.includes("nostalgia") ? "Designer Toys" : "Trading Cards")!
            }
          }
        }
      });
    }
  }

  const firstUser = createdUsers[0];
  for (const u of createdUsers.slice(1, 5)) await prisma.followUser.create({ data: { followerId: u.id, followingId: firstUser.id } });

  await prisma.drop.createMany({
    data: [
      { title: "Base Set Reprint Rumor Panel", universeId: universeMap.get("Base Set")!, date: new Date("2026-06-18"), link: "https://vaultverse.dev/drops/base", description: "Community panel and print pop report.", status: DropStatus.APPROVED, submitterId: firstUser.id },
      { title: "Rolex Submariner Boutique Event", universeId: universeMap.get("Submariner")!, date: new Date("2026-05-12"), link: "https://vaultverse.dev/drops/sub", description: "Allocation drop watchlist.", status: DropStatus.PENDING, submitterId: createdUsers[4].id },
      { title: "TMNT Legacy Release", universeId: universeMap.get("Playmates 1988 Line")!, date: new Date("2026-07-20"), link: "https://vaultverse.dev/drops/tmnt", description: "Anniversary drop details.", status: DropStatus.APPROVED, submitterId: createdUsers[6].id }
    ]
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
