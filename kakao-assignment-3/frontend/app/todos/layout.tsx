import AppShell from "@/components/app-shell";

export default function TodosLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
