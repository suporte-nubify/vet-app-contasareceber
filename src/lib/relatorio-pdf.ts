import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { formatBRL, formatDateBR } from "@/lib/utils";
import type { MonthRange } from "@/lib/dates";
import type { ItemRelatorio, RelatorioMensal } from "@/lib/relatorio";

const PAGE_W = 841.89;
const PAGE_H = 595.28;
const MARGIN_X = 32;
const MARGIN_BOTTOM = 32;

const teal = rgb(0.043, 0.525, 0.376);
const coral = rgb(0.745, 0.071, 0.333);
const ink = rgb(0.078, 0.188, 0.157);
const muted = rgb(0.38, 0.42, 0.4);
const rule = rgb(0.78, 0.9, 0.84);
const headerBg = rgb(0.91, 0.97, 0.94);
const zebra = rgb(0.96, 0.99, 0.975);
const zebraOpen = rgb(1, 0.96, 0.966);

type Col = {
  label: string;
  w: number;
  align?: "right";
  value: (item: ItemRelatorio) => string;
};

const CONTENT_W = PAGE_W - MARGIN_X * 2;

const columns: Col[] = [
  { label: "Data", w: 62, value: (item) => formatDateBR(item.data) },
  { label: "Pet", w: 100, value: (item) => item.nomePet },
  { label: "Tutor", w: 100, value: (item) => item.tutor || "-" },
  { label: "Procedimento", w: 190, value: (item) => item.procedimento },
  { label: "Estabelecimento", w: 145, value: (item) => item.estabelecimento },
  { label: "Pagamento", w: 90, value: (item) => item.formaPagamento || "-" },
  { label: "Valor", w: 78, align: "right", value: (item) => formatBRL(item.valor) },
];

function pdfText(value: string, font?: PDFFont) {
  const cleaned = value.replace(/[\u00A0\u202F]/g, " ").normalize("NFC");
  if (!font) return cleaned;
  let out = "";
  for (const char of cleaned) {
    try {
      font.encodeText(char);
      out += char;
    } catch {
      out += "?";
    }
  }
  return out;
}

function fit(font: PDFFont, value: string, size: number, maxWidth: number) {
  const text = pdfText(value, font);
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
  let cut = text;
  while (cut.length > 1 && font.widthOfTextAtSize(`${cut}...`, size) > maxWidth) {
    cut = cut.slice(0, -1);
  }
  return `${cut}...`;
}

type Draw = {
  doc: PDFDocument;
  page: PDFPage;
  font: PDFFont;
  bold: PDFFont;
  y: number;
  pageNum: number;
  label: string;
};

function newPage(ctx: Draw) {
  ctx.page = ctx.doc.addPage([PAGE_W, PAGE_H]);
  ctx.pageNum += 1;
  drawChrome(ctx);
}

function drawChrome(ctx: Draw) {
  const { page, font, bold } = ctx;
  page.drawRectangle({ x: 0, y: PAGE_H - 8, width: PAGE_W * 0.64, height: 8, color: teal });
  page.drawRectangle({
    x: PAGE_W * 0.64,
    y: PAGE_H - 8,
    width: PAGE_W * 0.36,
    height: 8,
    color: coral,
  });

  page.drawText(pdfText("CLÍNICA VETERINÁRIA"), {
    x: MARGIN_X,
    y: PAGE_H - 26,
    size: 8,
    font: bold,
    color: coral,
  });
  page.drawText(pdfText(`Relatório mensal - ${ctx.label}`), {
    x: MARGIN_X,
    y: PAGE_H - 44,
    size: 16,
    font: bold,
    color: ink,
  });
  page.drawText("Contas a receber", {
    x: MARGIN_X,
    y: PAGE_H - 60,
    size: 9,
    font,
    color: muted,
  });

  page.drawLine({
    start: { x: MARGIN_X, y: 22 },
    end: { x: PAGE_W - MARGIN_X, y: 22 },
    thickness: 0.6,
    color: rule,
  });
  const footer = `Gerado em ${formatDateBR(new Date())}  ·  Página ${ctx.pageNum}`;
  page.drawText(pdfText(footer), {
    x: MARGIN_X,
    y: 10,
    size: 8,
    font,
    color: muted,
  });

  ctx.y = PAGE_H - 78;
}

function drawSummary(ctx: Draw, relatorio: RelatorioMensal) {
  const boxes = [
    {
      title: "Recebidos",
      value: formatBRL(relatorio.totais.recebidos),
      detail: `${relatorio.recebidos.length} item(ns)`,
      color: teal,
    },
    {
      title: "Em aberto",
      value: formatBRL(relatorio.totais.abertos),
      detail: `${relatorio.abertos.length} item(ns)`,
      color: coral,
    },
    {
      title: "Total do mês",
      value: formatBRL(relatorio.totais.geral),
      detail: `${relatorio.recebidos.length + relatorio.abertos.length} item(ns)`,
      color: ink,
    },
  ];
  const gap = 10;
  const boxW = (CONTENT_W - gap * 2) / 3;
  const boxH = 48;
  const top = ctx.y;

  boxes.forEach((box, index) => {
    const x = MARGIN_X + index * (boxW + gap);
    ctx.page.drawRectangle({
      x,
      y: top - boxH,
      width: boxW,
      height: boxH,
      borderColor: rule,
      borderWidth: 1,
      color: rgb(1, 1, 1),
    });
    ctx.page.drawText(box.title, { x: x + 10, y: top - 16, size: 8, font: ctx.bold, color: box.color });
    ctx.page.drawText(pdfText(box.value), {
      x: x + 10,
      y: top - 32,
      size: 12,
      font: ctx.bold,
      color: ink,
    });
    ctx.page.drawText(box.detail, { x: x + 10, y: top - 44, size: 8, font: ctx.font, color: muted });
  });

  ctx.y = top - boxH - 18;
}

function drawTableHeader(ctx: Draw) {
  const h = 16;
  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: ctx.y - h + 4,
    width: CONTENT_W,
    height: h,
    color: headerBg,
  });
  let x = MARGIN_X + 4;
  for (const col of columns) {
    const label = col.label;
    const size = 8;
    const textX =
      col.align === "right" ? x + col.w - 8 - ctx.bold.widthOfTextAtSize(label, size) : x;
    ctx.page.drawText(label, { x: textX, y: ctx.y - 8, size, font: ctx.bold, color: ink });
    x += col.w;
  }
  ctx.y -= h;
}

function drawRow(ctx: Draw, item: ItemRelatorio, stripe: boolean, open: boolean) {
  const h = 15;
  if (stripe) {
    ctx.page.drawRectangle({
      x: MARGIN_X,
      y: ctx.y - h + 4,
      width: CONTENT_W,
      height: h,
      color: open ? zebraOpen : zebra,
    });
  }
  let x = MARGIN_X + 4;
  for (const col of columns) {
    const size = 8;
    const text = fit(ctx.font, col.value(item), size, col.w - 8);
    const textX = col.align === "right" ? x + col.w - 8 - ctx.font.widthOfTextAtSize(text, size) : x;
    ctx.page.drawText(text, { x: textX, y: ctx.y - 7, size, font: ctx.font, color: ink });
    x += col.w;
  }
  ctx.y -= h;
}

function ensure(ctx: Draw, needed: number, repeatHeader: boolean) {
  if (ctx.y - needed >= MARGIN_BOTTOM) return;
  newPage(ctx);
  if (repeatHeader) drawTableHeader(ctx);
}

function drawSection(ctx: Draw, title: string, items: ItemRelatorio[], color: typeof teal, open: boolean) {
  ensure(ctx, 52, false);
  ctx.page.drawText(title, { x: MARGIN_X, y: ctx.y - 12, size: 11, font: ctx.bold, color });
  const meta = `${items.length} item(ns)  ·  ${pdfText(formatBRL(items.reduce((acc, item) => acc + item.valor, 0)))}`;
  const metaW = ctx.font.widthOfTextAtSize(meta, 8);
  ctx.page.drawText(meta, {
    x: PAGE_W - MARGIN_X - metaW,
    y: ctx.y - 11,
    size: 8,
    font: ctx.font,
    color: muted,
  });
  ctx.y -= 20;
  drawTableHeader(ctx);

  if (items.length === 0) {
    ensure(ctx, 18, true);
    ctx.page.drawText(pdfText("Nenhum lançamento neste mês."), {
      x: MARGIN_X + 4,
      y: ctx.y - 8,
      size: 8,
      font: ctx.font,
      color: muted,
    });
    ctx.y -= 22;
    return;
  }

  items.forEach((item, index) => {
    ensure(ctx, 15, true);
    drawRow(ctx, item, index % 2 === 1, open);
  });
  ctx.y -= 14;
}

export async function buildRelatorioPdf(range: MonthRange, relatorio: RelatorioMensal) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const ctx: Draw = {
    doc,
    page: doc.addPage([PAGE_W, PAGE_H]),
    font,
    bold,
    y: 0,
    pageNum: 1,
    label: range.label,
  };

  drawChrome(ctx);
  drawSummary(ctx, relatorio);
  drawSection(ctx, "Recebidos", relatorio.recebidos, teal, false);
  drawSection(ctx, "Em aberto", relatorio.abertos, coral, true);

  doc.setTitle(pdfText(`Relatório ${range.label}`));
  doc.setAuthor("Contas a Receber");
  return doc.save();
}
