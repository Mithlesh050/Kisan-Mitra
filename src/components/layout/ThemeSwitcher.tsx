
"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Contrast, Laptop, Mountain } from "lucide-react"; // Added Mountain for Desert
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const { setTheme, theme, themes, resolvedTheme } = useTheme();
  const { translate } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or null until mounted to avoid hydration mismatch
    return <div className="h-9 w-9" />; // Placeholder for button size
  }

  const availableThemes = [
    { value: "light", labelKey: "lightTheme", icon: Sun },
    { value: "dark", labelKey: "darkTheme", icon: Moon },
    { value: "oceanic", labelKey: "oceanicTheme", icon: Contrast },
    { value: "desert", labelKey: "desertTheme", icon: Mountain }, // Added Desert theme
    { value: "system", labelKey: "systemTheme", icon: Laptop },
  ];
  
  const CurrentIcon = availableThemes.find(t => t.value === theme)?.icon || (resolvedTheme === 'dark' ? Moon : Sun) ;


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={translate('theme')}>
          <CurrentIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableThemes.map((t) => (
          <DropdownMenuItem key={t.value} onClick={() => setTheme(t.value)}>
            <t.icon className="mr-2 h-4 w-4" />
            {translate(t.labelKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
