"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  progress: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  empty: {
    label: "Remaining",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface RadialChartProps {
  progress: {
    Remaining: number;
    Completed: number;
  };
  estimated: any;
  finished: any;
  unit: string;
}

export function RadialChart({
  progress,
  estimated,
  finished,
  unit,
}: RadialChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[250px]"
    >
      <RadialBarChart
        data={[progress]}
        startAngle={180}
        endAngle={0}
        innerRadius={110}
        outerRadius={160}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 32}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {finished}/{estimated} {unit == "Percentage" && "%"}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 12}
                      className="fill-muted-foreground"
                    >
                      {unit}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>

        <RadialBar
          dataKey="Completed"
          stackId="a"
          cornerRadius={8}
          fill="#37AD4A"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="Remaining"
          fill="#F6F6F6"
          stackId="a"
          cornerRadius={8}
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
