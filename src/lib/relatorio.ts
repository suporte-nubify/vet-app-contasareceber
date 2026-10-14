import { prisma } from "@/lib/prisma";
import type { MonthRange } from "@/lib/dates";

export type ItemRelatorio = {
  id: string;
  data: Date;
  nomePet: string;
  tutor: string | null;
  procedimento: string;
  estabelecimento: string;
  formaPagamento: string | null;
  valor: number;
  recebido: boolean;
};

export type RelatorioMensal = {
  recebidos: ItemRelatorio[];
  abertos: ItemRelatorio[];
  totais: {
    recebidos: number;
    abertos: number;
    geral: number;
  };
};

export async function loadRelatorioMensal(range: MonthRange): Promise<RelatorioMensal> {
  const rows = await prisma.contaReceber.findMany({
    where: { data: { gte: range.start, lt: range.end } },
    include: {
      tutor: true,
      procedimento: true,
      estabelecimento: true,
      formaPagamento: true,
    },
    orderBy: [{ data: "asc" }, { nomePet: "asc" }],
  });

  const items: ItemRelatorio[] = rows.map((row) => ({
    id: row.id,
    data: row.data,
    nomePet: row.nomePet,
    tutor: row.tutor?.nome ?? null,
    procedimento: row.procedimento.nome,
    estabelecimento: row.estabelecimento.nome,
    formaPagamento: row.formaPagamento?.nome ?? null,
    valor: row.valor,
    recebido: row.recebido,
  }));

  const recebidos = items.filter((item) => item.recebido);
  const abertos = items.filter((item) => !item.recebido);
  const sum = (list: ItemRelatorio[]) => list.reduce((acc, item) => acc + item.valor, 0);

  return {
    recebidos,
    abertos,
    totais: {
      recebidos: sum(recebidos),
      abertos: sum(abertos),
      geral: sum(items),
    },
  };
}
