import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const tipos = ["tutores", "procedimentos", "estabelecimentos", "formas-pagamento"] as const;
type Tipo = (typeof tipos)[number];

function isTipo(v: string): v is Tipo {
  return (tipos as readonly string[]).includes(v);
}

async function updateNome(tipo: Tipo, id: string, nome: string) {
  switch (tipo) {
    case "tutores":
      return prisma.tutor.update({ where: { id }, data: { nome } });
    case "procedimentos":
      return prisma.procedimento.update({ where: { id }, data: { nome } });
    case "estabelecimentos":
      return prisma.estabelecimento.update({ where: { id }, data: { nome } });
    case "formas-pagamento":
      return prisma.formaPagamento.update({ where: { id }, data: { nome } });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ tipo: string; id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { tipo, id } = await params;
  if (!isTipo(tipo)) return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });

  const body = await req.json();
  const nome = String(body.nome || "").trim();
  if (!nome) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });

  try {
    const updated = await updateNome(tipo, id, nome);
    return NextResponse.json(updated);
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code === "P2002") {
      return NextResponse.json({ error: "Já existe um cadastro com esse nome." }, { status: 409 });
    }
    if (code === "P2025") {
      return NextResponse.json({ error: "Cadastro não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ error: "Não foi possível salvar." }, { status: 500 });
  }
}
