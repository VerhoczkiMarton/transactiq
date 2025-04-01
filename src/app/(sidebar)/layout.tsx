import Navbar from '@/components/navbar';
import { SessionProvider } from 'next-auth/react';

export default function SidebarLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <Navbar />
      {children}
    </SessionProvider>
  );
}
