import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const tipos = ["tutores", "procedimentos", "estabelecimentos", "formas-pagamento"] as const;
type Tipo = (typeof tipos)[number];

function isTipo(v: string): v is Tipo {
  return (tipos as readonly string[]).includes(v);
}

async function list(tipo: Tipo) {
  switch (tipo) {
    case "tutores":
      return prisma.tutor.findMany({ orderBy: { nome: "asc" } });
    case "procedimentos":
      return prisma.procedimento.findMany({ orderBy: { nome: "asc" } });
    case "estabelecimentos":
      return prisma.estabelecimento.findMany({ orderBy: { nome: "asc" } });
    case "formas-pagamento":
      return prisma.formaPagamento.findMany({ orderBy: { nome: "asc" } });
  }
}

async function create(tipo: Tipo, nome: string) {
  switch (tipo) {
    case "tutores":
      return prisma.tutor.create({ data: { nome } });
    case "procedimentos":
      return prisma.procedimento.create({ data: { nome } });
    case "estabelecimentos":
      return prisma.estabelecimento.create({ data: { nome } });
    case "formas-pagamento":
      return prisma.formaPagamento.create({ data: { nome } });
  }
}

async function findByNome(tipo: Tipo, nome: string) {
  switch (tipo) {
    case "tutores":
      return prisma.tutor.findUnique({ where: { nome } });
    case "procedimentos":
      return prisma.procedimento.findUnique({ where: { nome } });
    case "estabelecimentos":
      return prisma.estabelecimento.findUnique({ where: { nome } });
    case "formas-pagamento":
      return prisma.formaPagamento.findUnique({ where: { nome } });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tipo: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { tipo } = await params;
  if (!isTipo(tipo)) return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });

  return NextResponse.json(await list(tipo));
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tipo: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { tipo } = await params;
  if (!isTipo(tipo)) return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });

  const body = await req.json();
  const nome = String(body.nome || "").trim();
  if (!nome) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });

  try {
    const created = await create(tipo, nome);
    return NextResponse.json(created, { status: 201 });
  } catch {
    const existing = await findByNome(tipo, nome);
    if (existing) return NextResponse.json(existing);
    return NextResponse.json({ error: "Já existe um cadastro com esse nome." }, { status: 409 });
  }
}
