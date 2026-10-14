import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

type SeedRow = {
  data: string;
  tutor: string | null;
  pet: string | null;
  procedimento: string | null;
  total: number | null;
  estabelecimento: string | null;
  pagamento: string | null;
  conferido: boolean;
};

async function upsertNome(
  model: "tutor" | "procedimento" | "estabelecimento" | "formaPagamento",
  nome: string
) {
  const clean = nome.trim();
  if (model === "tutor") {
    return prisma.tutor.upsert({
      where: { nome: clean },
      update: {},
      create: { nome: clean },
    });
  }
  if (model === "procedimento") {
    return prisma.procedimento.upsert({
      where: { nome: clean },
      update: {},
      create: { nome: clean },
    });
  }
  if (model === "estabelecimento") {
    return prisma.estabelecimento.upsert({
      where: { nome: clean },
      update: {},
      create: { nome: clean },
    });
  }
  return prisma.formaPagamento.upsert({
    where: { nome: clean },
    update: {},
    create: { nome: clean },
  });
}

async function upsertUser(username: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });
}

async function createUserIfMissing(username: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) return;
  await upsertUser(username, password);
}

async function main() {
  await upsertUser(process.env.AUTH_DEMO_USER || "admin", process.env.AUTH_DEMO_PASSWORD || "admin");
  await createUserIfMissing("Jamile", "#Vet@2026");

  const seedPath = path.join(__dirname, "seed-data.json");
  const rows = JSON.parse(fs.readFileSync(seedPath, "utf8")) as SeedRow[];

  const tutores = new Set<string>();
  const procedimentos = new Set<string>();
  const estabelecimentos = new Set<string>();
  const formas = new Set<string>();

  for (const row of rows) {
    if (row.tutor?.trim()) tutores.add(row.tutor.trim());
    if (row.procedimento?.trim()) procedimentos.add(row.procedimento.trim());
    if (row.estabelecimento?.trim()) estabelecimentos.add(row.estabelecimento.trim());
    if (row.pagamento?.trim()) formas.add(row.pagamento.trim());
  }

  for (const nome of tutores) await upsertNome("tutor", nome);
  for (const nome of procedimentos) await upsertNome("procedimento", nome);
  for (const nome of estabelecimentos) await upsertNome("estabelecimento", nome);
  for (const nome of formas) await upsertNome("formaPagamento", nome);

  console.log(
    `Seed de cadastros concluído (${tutores.size} tutores, ${procedimentos.size} procedimentos, ${estabelecimentos.size} estabelecimentos, ${formas.size} formas de pagamento). Nenhum lançamento foi criado.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
