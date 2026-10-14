"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DeleteContaButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("Excluir esta conta a receber?")) return;
    setBusy(true);
    await fetch(`/api/contas/${id}`, { method: "DELETE" });
    router.push("/contas");
    router.refresh();
  }

  return (
    <Button type="button" variant="danger" className="w-full" disabled={busy} onClick={onDelete}>
      {busy ? "Excluindo…" : "Excluir conta"}
    </Button>
  );
}
