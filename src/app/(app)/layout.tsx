import { BottomNav } from "@/components/bottom-nav";
import { requireSession } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireSession();

  return (
    <div className="mx-auto min-h-dvh max-w-lg pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
