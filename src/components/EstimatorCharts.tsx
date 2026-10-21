import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ChartConfiguration } from 'chart.js';
import '../utils/chartSetup';
import { EstimatedMaterialItem } from '../types/construction';
import { formatINR, formatNumber } from '../utils/dataProcessor';

interface EstimatorChartsProps {
  items: EstimatedMaterialItem[];
  totalCost: number;
}

export const EstimatorCharts: React.FC<EstimatorChartsProps> = ({ items, totalCost }) => {
  const doughnutRef = useRef<HTMLCanvasElement | null>(null);
  const qtyBarRef = useRef<HTMLCanvasElement | null>(null);
  const costBarRef = useRef<HTMLCanvasElement | null>(null);

  const doughnutChart = useRef<ChartJS | null>(null);
  const qtyBarChart = useRef<ChartJS | null>(null);
  const costBarChart = useRef<ChartJS | null>(null);

  const palette = {
    Bricks: { bg: '#F97316', border: '#EA580C' },   // Orange
    Cement: { bg: '#3B82F6', border: '#2563EB' },   // Blue
    Sand: { bg: '#EAB308', border: '#CA8A04' },     // Amber
    Steel: { bg: '#10B981', border: '#059669' },    // Emerald
  };

  useEffect(() => {
    // 1. Chart A: Material Cost Distribution (Doughnut)
    if (doughnutRef.current) {
      if (doughnutChart.current) doughnutChart.current.destroy();

      const labels = items.map((i) => i.material);
      const data = items.map((i) => i.cost);
      const bgColors = items.map((i) => palette[i.material]?.bg || '#6B7280');
      const borderColors = items.map((i) => palette[i.material]?.border || '#374151');

      const config: ChartConfiguration<'doughnut'> = {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: bgColors,
              borderColor: borderColors,
              borderWidth: 1.5,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                padding: 16,
                font: { size: 12, weight: 500 },
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const val = context.raw as number;
                  const pct = totalCost > 0 ? ((val / totalCost) * 100).toFixed(1) : '0';
                  return ` ${context.label}: ${formatINR(val)} (${pct}%)`;
                },
              },
            },
          },
        },
      };

      doughnutChart.current = new ChartJS(doughnutRef.current, config);
    }

    // 2. Chart B: Estimated Material Quantities (Bar)
    if (qtyBarRef.current) {
      if (qtyBarChart.current) qtyBarChart.current.destroy();

      const labels = items.map((i) => `${i.material} (${i.unit})`);
      const data = items.map((i) => i.quantity);
      const bgColors = items.map((i) => palette[i.material]?.bg || '#6B7280');

      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Estimated Quantity',
              data,
              backgroundColor: bgColors,
              borderRadius: 6,
              barThickness: 28,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const item = items[context.dataIndex];
                  return ` Quantity: ${formatNumber(item.quantity, 1)} ${item.unit}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                callback: (val) => formatNumber(Number(val), 0),
              },
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 11, weight: 500 } },
            },
          },
        },
      };

      qtyBarChart.current = new ChartJS(qtyBarRef.current, config);
    }

    // 3. Chart C: Estimated Material Cost Comparison (Horizontal Bar)
    if (costBarRef.current) {
      if (costBarChart.current) costBarChart.current.destroy();

      const labels = items.map((i) => i.material);
      const data = items.map((i) => i.cost);
      const bgColors = items.map((i) => palette[i.material]?.bg || '#6B7280');

      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Estimated Cost (INR)',
              data,
              backgroundColor: bgColors,
              borderRadius: 6,
              barThickness: 22,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => ` Cost: ${formatINR(Number(context.raw))}`,
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                callback: (val) => formatINR(Number(val), false),
              },
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 12, weight: 600 } },
            },
          },
        },
      };

      costBarChart.current = new ChartJS(costBarRef.current, config);
    }

    return () => {
      doughnutChart.current?.destroy();
      qtyBarChart.current?.destroy();
      costBarChart.current?.destroy();
    };
  }, [items, totalCost]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
      {/* Chart A */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="mb-3">
          <h4 className="text-sm font-bold text-slate-900">Chart A: Cost Distribution</h4>
          <p className="text-xs text-slate-500">Material share of total estimated cost</p>
        </div>
        <div className="relative h-60 w-full flex-1">
          <canvas ref={doughnutRef} />
        </div>
      </div>

      {/* Chart B */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="mb-3">
          <h4 className="text-sm font-bold text-slate-900">Chart B: Required Quantities</h4>
          <p className="text-xs text-slate-500">Physical units are specific to each material</p>
        </div>
        <div className="relative h-60 w-full flex-1">
          <canvas ref={qtyBarRef} />
        </div>
        <p className="text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded mt-2 border border-amber-200">
          Note: Quantities use distinct physical units (pieces, bags, m³, kg) and should not be compared directly.
        </p>
      </div>

      {/* Chart C */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="mb-3">
          <h4 className="text-sm font-bold text-slate-900">Chart C: Cost Comparison</h4>
          <p className="text-xs text-slate-500">Expenditure rank across materials (INR)</p>
        </div>
        <div className="relative h-60 w-full flex-1">
          <canvas ref={costBarRef} />
        </div>
      </div>
    </div>
  );
};
