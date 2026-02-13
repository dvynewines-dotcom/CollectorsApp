# VaultVerse

VaultVerse is a full-stack collectibles discovery and social showcasing platform built with Next.js App Router, Prisma, PostgreSQL, and Tailwind.

## Stack

- Next.js 14 + TypeScript
- Tailwind CSS (dark-first)
- Prisma ORM + PostgreSQL
- NextAuth (Email + optional GitHub OAuth)
- Framer Motion micro-interactions
- S3-compatible media strategy (local fallback paths in MVP)

## Features Included

- Authentication foundation with NextAuth route.
- Universe hierarchy (`CATEGORY`, `IP`, `LINE`, `SET`, `BRAND`) with drill-down Explore UI.
- Catalog items with JSON attributes/identifiers and valuation scores.
- Owned instances + wantlist vault views.
- Room model + room display route.
- Social posts with attachments and feed.
- Radar drop submissions + admin queue surface.
- Full Prisma schema for all requested models.
- Seed script with required hierarchy, items, users, rooms, posts, follows, and drops.

## Routes

- `/`
- `/explore`
- `/u/[handle]`
- `/universe/[id]`
- `/item/[id]`
- `/vault`
- `/room/[id]`
- `/rooms/new`
- `/radar`
- `/submit/drop`
- `/admin`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vaultverse"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="change-me"
   EMAIL_SERVER="smtp://user:pass@mailhog:1025"
   EMAIL_FROM="VaultVerse <noreply@vaultverse.dev>"
   GITHUB_ID=""
   GITHUB_SECRET=""
   ```
3. Generate Prisma client and run migrations:
   ```bash
   npm run prisma:generate
   npx prisma migrate dev --name init
   ```
4. Seed data:
   ```bash
   npm run db:seed
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

## Seeded Data Snapshot

- 3 top-level categories: Trading Cards, Watches, Designer Toys.
- Full nested universe hierarchy as requested.
- 13 canonical items with release year, manufacturer, attributes JSON, identifiers JSON, mock value range, liquidity score, rarity score.
- 9 seeded users (`@gradedking` ... `@nostalgia1989`) each with:
  - 8–15 owned instances (10 in seed)
  - 1 room
  - 2 posts
  - followed relevant universe
- Named showcase rooms included:
  - **Base Set Grails** (`@gradedking`)
  - **Tool Watch Rotation** (`@toolwatchclub`)
  - **Sewer Lair Display** (`@sewerlair`)
