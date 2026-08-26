
"use client"

import type { CropPriceTrend } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";


interface CropPriceChartProps {
  data: CropPriceTrend | null;
  isLoading: boolean;
}

export function CropPriceChart({ data, isLoading }: CropPriceChartProps) {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const [chartColors, setChartColors] = useState<string[]>([]);
  const [chartConfig, setChartConfig] = useState<any>({});

  useEffect(() => {
    // Ensure this runs only on the client after mount
    const getClientChartColor = (index: number) => {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue(`--chart-${index + 1}`).trim();
    };

    if (data?.trends.length) {
      const colors = data.trends.map((_, i) => getClientChartColor(i % 5));
      setChartColors(colors);

      const newChartConfig = data.trends.reduce((config, trend, index) => {
        config[trend.state] = {
          label: trend.state,
          color: colors[index] || getClientChartColor(index % 5),
        };
        return config;
      }, {} as any);
      setChartConfig(newChartConfig);
    }
  }, [theme, data]);


  if (isLoading) {
    return (
      <Card className="shadow-lg bg-card">
        <CardHeader>
          <CardTitle>{translate('chartLoadingPriceTrends')}</CardTitle>
          <CardDescription>{translate('chartFetchingHistoricalData')}</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <div className="h-full w-full bg-muted animate-pulse rounded-md" />
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.trends || data.trends.length === 0) {
    return (
      <Card className="shadow-lg bg-card">
        <CardHeader>
          <CardTitle>{translate('chartNoPriceDataAvailable')}</CardTitle>
          <CardDescription>
            {translate('chartCouldNotLoadTrends', { cropName: data?.cropName || translate('selectPlaceholder') })}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">{translate('chartTryAnotherCrop')}</p>
        </CardContent>
      </Card>
    );
  }
  
  const chartData = data.trends.length > 0 ? data.trends[0].data.map((_, i) => {
    const entry: { [key: string]: string | number } = { date: data.trends[0].data[i].date };
    data.trends.forEach(trend => {
      entry[trend.state] = trend.data[i]?.price || 0;
    });
    return entry;
  }) : [];


  return (
    <Card className="shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">
          {translate('chartPriceTrendsTitle', { cropName: data.cropName })}
        </CardTitle>
        <CardDescription>{translate('chartPriceFluctuationsDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)} 
                stroke="hsl(var(--foreground))"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={80}
                tickFormatter={(value) => `₹${value / 1000}k`} 
                stroke="hsl(var(--foreground))"
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent indicator="line" labelClassName="text-foreground" className="bg-card text-card-foreground border-border" />}
              />
              <ChartLegend content={<ChartLegendContent wrapperStyle={{ color: 'hsl(var(--foreground))' }} />} />
              {data.trends.map((trend, index) => (
                <Line
                  key={`trend-${trend.state}-${index}`} // More robust key
                  dataKey={trend.state}
                  type="monotone"
                  stroke={chartColors[index] || `var(--chart-${(index % 5) + 1})`}
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: chartColors[index] || `var(--chart-${(index % 5) + 1})`,
                    stroke: "hsl(var(--background))",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: chartColors[index] || `var(--chart-${(index % 5) + 1})`,
                    stroke: "hsl(var(--background))",
                    strokeWidth: 2,
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
