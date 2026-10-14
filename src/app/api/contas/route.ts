import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const where: Prisma.ContaReceberWhereInput = {};

  const tutorId = searchParams.get("tutorId");
  const procedimentoId = searchParams.get("procedimentoId");
  const estabelecimentoId = searchParams.get("estabelecimentoId");
  const formaPagamentoId = searchParams.get("formaPagamentoId");
  const status = searchParams.get("status");
  const q = searchParams.get("q");
  const de = searchParams.get("de");
  const ate = searchParams.get("ate");

  if (tutorId) where.tutorId = tutorId;
  if (procedimentoId) where.procedimentoId = procedimentoId;
  if (estabelecimentoId) where.estabelecimentoId = estabelecimentoId;
  if (formaPagamentoId) where.formaPagamentoId = formaPagamentoId;
  if (status === "recebido") where.recebido = true;
  if (status === "aberto") where.recebido = false;
  if (de || ate) {
    where.data = {};
    if (de) where.data.gte = new Date(de);
    if (ate) where.data.lte = new Date(ate);
  }
  if (q) {
    where.OR = [
      { nomePet: { contains: q } },
      { observacoes: { contains: q } },
      { tutor: { nome: { contains: q } } },
      { procedimento: { nome: { contains: q } } },
      { estabelecimento: { nome: { contains: q } } },
    ];
  }

  const contas = await prisma.contaReceber.findMany({
    where,
    include: {
      tutor: true,
      procedimento: true,
      estabelecimento: true,
      formaPagamento: true,
    },
    orderBy: [{ data: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(contas);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const data = new Date(body.data);
  const nomePet = String(body.nomePet || "").trim();
  const valor = Number(body.valor);
  const procedimentoId = body.procedimentoId as string;
  const estabelecimentoId = body.estabelecimentoId as string;
  const tutorId = body.tutorId || null;
  const formaPagamentoId = body.formaPagamentoId || null;
  const recebido = Boolean(body.recebido);
  const observacoes = body.observacoes ? String(body.observacoes) : null;

  if (!nomePet || !procedimentoId || !estabelecimentoId || Number.isNaN(valor) || !body.data) {
    return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
  }

  const conta = await prisma.contaReceber.create({
    data: {
      data,
      nomePet,
      valor,
      procedimentoId,
      estabelecimentoId,
      tutorId,
      formaPagamentoId,
      recebido,
      recebidoEm: recebido ? new Date() : null,
      observacoes,
    },
    include: {
      tutor: true,
      procedimento: true,
      estabelecimento: true,
      formaPagamento: true,
    },
  });

  return NextResponse.json(conta, { status: 201 });
}
