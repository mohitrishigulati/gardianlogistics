import { execSync } from "node:child_process";

execSync("npx prisma generate", { stdio: "inherit" });

if (process.env.DATABASE_URL) {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} else {
  console.warn("DATABASE_URL not set — skipping prisma migrate deploy");
}

execSync("npx next build", { stdio: "inherit" });
