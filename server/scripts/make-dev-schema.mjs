/**
 * Derives prisma/dev.prisma (SQLite, for local development with no database
 * account) from prisma/schema.prisma (PostgreSQL, the production schema).
 *
 * Generated — never edit prisma/dev.prisma by hand. Prisma will not accept a
 * provider from an env var, so the local variant has to be produced instead of
 * configured, and deriving it keeps the two from drifting apart.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const prismaDir = join(dirname(fileURLToPath(import.meta.url)), "..", "prisma");
const source = readFileSync(join(prismaDir, "schema.prisma"), "utf8");

const devSchema = source
  .replace(/provider\s*=\s*"postgresql"/, 'provider  = "sqlite"')
  // SQLite has no shadow/direct connection concept.
  .replace(/^\s*directUrl\s*=.*$\n/m, "")
  // SQLite has no enum type, so Role collapses to the string it stores.
  .replace(/^enum Role \{[\s\S]*?^\}\n\n?/m, "")
  .replace(/^(\s*role\s+)Role(\s*)$/m, "$1String$2");

writeFileSync(
  join(prismaDir, "dev.prisma"),
  `// GENERATED FROM schema.prisma — do not edit. Run: npm run dev:local\n${devSchema}`
);

console.log("Wrote prisma/dev.prisma (SQLite) from schema.prisma");
