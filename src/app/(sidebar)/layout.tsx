import AppSidebar from '@/components/sidebar/app-sidebar';
import { SiteHeader } from '@/components/sidebar/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SessionProvider } from 'next-auth/react';

export default function SidebarLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="m-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
