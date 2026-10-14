import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { monthBounds } from "@/lib/dates";
import { formatBRL } from "@/lib/utils";
import { PawPrint } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/logout-button";
import { VetMark } from "@/components/vet-mark";

export const dynamic = "force-dynamic";

async function sumWhere(where: Parameters<typeof prisma.contaReceber.aggregate>[0]["where"]) {
  const agg = await prisma.contaReceber.aggregate({
    where,
    _sum: { valor: true },
    _count: true,
  });
  return { total: agg._sum.valor ?? 0, count: agg._count };
}

export default async function DashboardPage() {
  const { m0, m1, mMinus3 } = monthBounds();

  const [recebido3m, inadimplentes, mesCorrente, abertas] = await Promise.all([
    sumWhere({
      recebido: true,
      recebidoEm: { gte: mMinus3, lt: m1 },
    }),
    sumWhere({
      recebido: false,
      data: { lt: m0 },
    }),
    sumWhere({
      recebido: false,
      data: { gte: m0, lt: m1 },
    }),
    prisma.contaReceber.count({ where: { recebido: false } }),
  ]);

  return (
    <main className="px-4 pt-6">
      <header className="mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <VetMark />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral-600">
                Clínica veterinária
              </p>
              <h1 className="font-display text-2xl font-semibold leading-tight text-teal-950">
                Contas a Receber
              </h1>
            </div>
          </div>
          <LogoutButton />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm text-stone-600">Resumo dos recebimentos da clínica</p>
          <Link href="/senha" className="shrink-0 text-sm font-semibold text-teal-800">
            Alterar senha
          </Link>
        </div>
      </header>

      <div className="space-y-3">
        <Card className="relative overflow-hidden border-teal-300 bg-gradient-to-br from-teal-200 via-teal-300 to-emerald-300 text-teal-950 shadow-md shadow-teal-400/30">
          <PawPrint className="pointer-events-none absolute -bottom-5 -right-3 h-28 w-28 text-teal-700/15" />
          <CardHeader>
            <CardTitle className="text-teal-900">Valor recebido — últimos 3 meses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-semibold tracking-tight">
              {formatBRL(recebido3m.total)}
            </p>
            <p className="mt-1 text-sm text-teal-900/80">{recebido3m.count} lançamento(s)</p>
          </CardContent>
        </Card>

        <Card className="border-coral-200 bg-gradient-to-br from-coral-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-coral-800">Valores inadimplentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-semibold text-coral-950">
              {formatBRL(inadimplentes.total)}
            </p>
            <p className="mt-1 text-sm text-coral-800/80">
              Não recebidos com data em meses anteriores · {inadimplentes.count} item(ns)
            </p>
          </CardContent>
        </Card>

        <Card className="border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="text-sky-800">A receber no mês corrente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-semibold text-sky-950">
              {formatBRL(mesCorrente.total)}
            </p>
            <p className="mt-1 text-sm text-sky-800/80">
              Em aberto neste mês · {mesCorrente.count} item(ns)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          href="/contas/nova"
          className="flex min-h-14 items-center justify-center rounded-2xl bg-teal-700 px-3 text-center text-sm font-semibold text-white shadow-md shadow-teal-700/25"
        >
          Nova conta
        </Link>
        <Link
          href="/contas?status=aberto"
          className="flex min-h-14 items-center justify-center rounded-2xl border border-coral-200 bg-white px-3 text-center text-sm font-semibold leading-tight text-coral-800"
        >
          Ver em aberto ({abertas})
        </Link>
        <Link
          href="/relatorio"
          className="col-span-2 flex min-h-14 items-center justify-center rounded-2xl border border-teal-200 bg-white px-3 text-center text-sm font-semibold text-teal-900"
        >
          Relatório do mês
        </Link>
      </div>
    </main>
  );
}
