import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const username = session?.user?.name;
  if (!username) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const atual = String(body.atual || "");
  const nova = String(body.nova || "");
  const confirmacao = String(body.confirmacao || "");

  if (!atual || !nova) {
    return NextResponse.json({ error: "Informe a senha atual e a nova senha." }, { status: 400 });
  }
  if (nova.length < 6) {
    return NextResponse.json({ error: "A nova senha precisa ter pelo menos 6 caracteres." }, { status: 400 });
  }
  if (nova !== confirmacao) {
    return NextResponse.json({ error: "A confirmação não confere com a nova senha." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

  const ok = await bcrypt.compare(atual, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });

  const passwordHash = await bcrypt.hash(nova, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
}
