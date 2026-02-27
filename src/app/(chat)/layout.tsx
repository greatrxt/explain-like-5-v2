import { cookies } from "next/headers";

import { auth } from "@/auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SessionProvider } from "@/components/layout/session-context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const sidebarOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <AppSidebar user={session?.user} />
      <SessionProvider session={session}>
        <SidebarInset>{children}</SidebarInset>
      </SessionProvider>
    </SidebarProvider>
  );
}
