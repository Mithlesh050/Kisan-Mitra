
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lightbulb, BarChart3, MapPin, Settings, GraduationCap, Truck, TrendingUp, ScrollText, ShoppingCart, Camera, type LucideIcon } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
}

const navItemsConfig: NavItem[] = [
  { href: '/', labelKey: 'navHome', icon: Home },
  { href: '/prices', labelKey: 'navPrices', icon: TrendingUp },
  { href: '/recommendations', labelKey: 'navAiAdvisor', icon: Lightbulb },
  { href: '/disease-detection', labelKey: 'navDiseaseDetection', icon: Camera },
  { href: '/dashboard', labelKey: 'navDashboard', icon: BarChart3 },
  { href: '/locator', labelKey: 'navMandis', icon: MapPin },
  { href: '/transport-estimator', labelKey: 'navTransportEstimator', icon: Truck },
  { href: '/marketplace', labelKey: 'navMarketplace', icon: ShoppingCart },
  { href: '/schemes', labelKey: 'navGovtSchemes', icon: ScrollText },
  { href: '/education', labelKey: 'navEducation', icon: GraduationCap },
  // Settings will be ordered to be last
];

export function SidebarNavigation() {
  const pathname = usePathname();
  const { translate } = useLanguage();

  const orderedNavItems = [
    ...navItemsConfig.filter(item => item.labelKey !== 'Settings'), // All items except Settings
    { href: '/settings', labelKey: 'Settings', icon: Settings } // Add Settings at the end
  ].filter(Boolean) as NavItem[];

  return (
    <SidebarMenu>
      {orderedNavItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} legacyBehavior passHref>
            <SidebarMenuButton
              asChild
              className={cn(
                "justify-start",
                pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
              )}
              tooltip={{ content: translate(item.labelKey), className: "bg-card text-card-foreground border-border" }}
              isActive={pathname === item.href}
            >
              <a>
                <item.icon className="h-5 w-5" />
                <span>{translate(item.labelKey)}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
