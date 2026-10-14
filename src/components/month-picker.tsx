"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MonthPicker({ value }: { value: string }) {
  const router = useRouter();

  return (
    <div>
      <Label htmlFor="mes">Mês</Label>
      <Input
        id="mes"
        type="month"
        value={value}
        onChange={(e) => {
          const mes = e.target.value;
          if (mes) router.push(`/relatorio?mes=${mes}`);
        }}
      />
    </div>
  );
}
