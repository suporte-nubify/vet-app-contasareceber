import { calendarMonthRange, currentMonthKey } from "@/lib/dates";
import { loadRelatorioMensal, type ItemRelatorio } from "@/lib/relatorio";
import { formatBRL, formatDateBR } from "@/lib/utils";
import { MonthPicker } from "@/components/month-picker";
import { FileDown } from "lucide-react";

export const dynamic = "force-dynamic";

function ItemList({ items, empty }: { items: ItemRelatorio[]; empty: string }) {
  if (items.length === 0) {
    return (
      <li className="rounded-xl border border-dashed border-stone-300 bg-white/70 p-4 text-center text-sm text-stone-500">
        {empty}
      </li>
    );
  }

  return items.map((item) => (
    <li key={item.id} className="rounded-xl border border-teal-100 bg-white px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            {formatDateBR(item.data)}
          </p>
          <p className="mt-0.5 truncate text-base font-semibold text-stone-900">
            {item.nomePet}
            <span className="font-normal text-stone-500"> · {item.tutor || "Sem tutor"}</span>
          </p>
          <p className="truncate text-sm text-stone-600">{item.procedimento}</p>
          <p className="truncate text-sm text-stone-500">
            {item.estabelecimento}
            {item.formaPagamento ? ` · ${item.formaPagamento}` : ""}
          </p>
        </div>
        <p className="font-display text-lg font-semibold text-teal-900">{formatBRL(item.valor)}</p>
      </div>
    </li>
  ));
}

export default async function RelatorioPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const sp = await searchParams;
  const range = calendarMonthRange(sp.mes) ?? calendarMonthRange(currentMonthKey());
  if (!range) {
    return null;
  }
  const relatorio = await loadRelatorioMensal(range);
  const totalItens = relatorio.recebidos.length + relatorio.abertos.length;

  return (
    <main className="px-4 pt-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral-600">Clínica veterinária</p>
      <h1 className="font-display text-3xl font-semibold text-teal-950">Relatório</h1>
      <p className="mb-4 text-sm text-stone-600">
        Lançamentos de {range.label}, separados em recebidos e em aberto.
      </p>

      <MonthPicker value={range.key} />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-3">
          <p className="text-xs font-semibold text-teal-800">Recebidos</p>
          <p className="mt-1 font-display text-xl font-semibold text-teal-950">
            {formatBRL(relatorio.totais.recebidos)}
          </p>
          <p className="text-xs text-teal-800/80">{relatorio.recebidos.length} item(ns)</p>
        </div>
        <div className="rounded-2xl border border-coral-200 bg-coral-50 p-3">
          <p className="text-xs font-semibold text-coral-800">Em aberto</p>
          <p className="mt-1 font-display text-xl font-semibold text-coral-950">
            {formatBRL(relatorio.totais.abertos)}
          </p>
          <p className="text-xs text-coral-800/80">{relatorio.abertos.length} item(ns)</p>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-stone-700">
        Total do mês: {formatBRL(relatorio.totais.geral)} · {totalItens} item(ns)
      </p>

      <a
        href={`/api/relatorios/mensal?mes=${range.key}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-teal-700 px-4 text-base font-semibold text-white shadow-md shadow-teal-700/25"
      >
        <FileDown className="h-5 w-5" />
        Gerar PDF
      </a>

      <section className="mt-6">
        <h2 className="mb-2 font-display text-xl font-semibold text-teal-900">
          Recebidos ({relatorio.recebidos.length})
        </h2>
        <ul className="space-y-2">
          <ItemList items={relatorio.recebidos} empty="Nenhum item recebido neste mês." />
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 font-display text-xl font-semibold text-coral-800">
          Em aberto ({relatorio.abertos.length})
        </h2>
        <ul className="space-y-2">
          <ItemList items={relatorio.abertos} empty="Nenhum item em aberto neste mês." />
        </ul>
      </section>
    </main>
  );
}
