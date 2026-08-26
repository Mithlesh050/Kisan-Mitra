
"use client"; 
import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarRail,
} from '@/components/ui/sidebar';
import { AppHeader } from './AppHeader';
import { SidebarNavigation } from './SidebarNavigation';
import { AppFooter } from './AppFooter'; // Import the new footer
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const { translate } = useLanguage();
  
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r border-sidebar-border">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground group">
            <Leaf className="h-7 w-7 text-sidebar-primary transition-transform duration-300 ease-in-out group-hover:rotate-[360deg] group-hover:scale-110" />
            <span className="group-data-[collapsible=icon]:hidden transition-all duration-300 group-hover:text-sidebar-primary group-hover:tracking-wide">{translate('appName')}</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNavigation />
        </SidebarContent>
        <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
          {/* Ensured text is small and uses a muted sidebar foreground color for a modern look */}
          <p className="text-xs text-sidebar-foreground/70">{translate('copyright')}</p>
        </SidebarFooter>
         <SidebarRail />
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen"> {/* Ensure SidebarInset fills the screen height */}
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
        <AppFooter /> {/* Add the new AppFooter here */}
      </SidebarInset>
    </SidebarProvider>
  );
}
