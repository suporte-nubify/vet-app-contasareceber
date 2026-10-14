"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ContaRecebidoToggle({ id, recebido }: { id: string; recebido: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(`/api/contas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recebido: !recebido }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant={recebido ? "outline" : "default"}
      className="flex-1"
      disabled={busy}
      onClick={toggle}
    >
      {busy ? "…" : recebido ? "Desmarcar" : "Marcar recebido"}
    </Button>
  );
}
