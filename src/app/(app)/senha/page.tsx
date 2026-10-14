import Link from "next/link";
import { SenhaForm } from "@/components/senha-form";

export const dynamic = "force-dynamic";

export default function SenhaPage() {
  return (
    <main className="px-4 pt-6">
      <Link href="/" className="text-sm font-semibold text-teal-800">
        ← Voltar
      </Link>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-coral-600">
        Clínica veterinária
      </p>
      <h1 className="font-display text-3xl font-semibold text-teal-950">Alterar senha</h1>
      <p className="mb-5 text-sm text-stone-600">A nova senha vale no próximo acesso.</p>
      <SenhaForm />
    </main>
  );
}
