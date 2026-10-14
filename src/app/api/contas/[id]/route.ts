import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;

  const conta = await prisma.contaReceber.findUnique({
    where: { id },
    include: {
      tutor: true,
      procedimento: true,
      estabelecimento: true,
      formaPagamento: true,
    },
  });
  if (!conta) return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
  return NextResponse.json(conta);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  const current = await prisma.contaReceber.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Não encontrada" }, { status: 404 });

  let recebido = current.recebido;
  let recebidoEm = current.recebidoEm;

  if (typeof body.recebido === "boolean") {
    recebido = body.recebido;
    if (recebido && !current.recebido) {
      recebidoEm = new Date();
    } else if (!recebido) {
      recebidoEm = null;
    }
  }

  const conta = await prisma.contaReceber.update({
    where: { id },
    data: {
      data: body.data ? new Date(body.data) : undefined,
      nomePet: body.nomePet != null ? String(body.nomePet).trim() : undefined,
      valor: body.valor != null ? Number(body.valor) : undefined,
      procedimentoId: body.procedimentoId || undefined,
      estabelecimentoId: body.estabelecimentoId || undefined,
      tutorId: body.tutorId === "" ? null : body.tutorId ?? undefined,
      formaPagamentoId:
        body.formaPagamentoId === "" ? null : body.formaPagamentoId ?? undefined,
      observacoes:
        body.observacoes === undefined
          ? undefined
          : body.observacoes
            ? String(body.observacoes)
            : null,
      recebido,
      recebidoEm,
    },
    include: {
      tutor: true,
      procedimento: true,
      estabelecimento: true,
      formaPagamento: true,
    },
  });

  return NextResponse.json(conta);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await params;
  await prisma.contaReceber.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
