import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calendarMonthRange, currentMonthKey } from "@/lib/dates";
import { loadRelatorioMensal } from "@/lib/relatorio";
import { buildRelatorioPdf } from "@/lib/relatorio-pdf";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const mes = new URL(req.url).searchParams.get("mes") || currentMonthKey();
  const range = calendarMonthRange(mes);
  if (!range) return NextResponse.json({ error: "Mês inválido." }, { status: 400 });

  const relatorio = await loadRelatorioMensal(range);
  const pdf = await buildRelatorioPdf(range, relatorio);
  const body = new Uint8Array(pdf);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="relatorio-${range.key}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
