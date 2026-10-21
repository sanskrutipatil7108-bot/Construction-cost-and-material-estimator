import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chart as ChartJS, ChartConfiguration } from 'chart.js';
import '../utils/chartSetup';
import {
  Filter,
  RotateCcw,
  Search,
  BarChart3,
  PieChart,
  ScatterChart,
  Layers,
  Building2,
  TrendingUp,
} from 'lucide-react';
import {
  StructureType,
  MaterialType,
  RawMaterialRow,
  ProjectRecord,
} from '../types/construction';
import {
  ProcessedDataset,
  STRUCTURE_TYPES,
  MATERIAL_TYPES,
  formatINR,
  formatNumber,
  calculateMedian,
} from '../utils/dataProcessor';

interface AnalyticsProps {
  dataset: ProcessedDataset;
}

export const Analytics: React.FC<AnalyticsProps> = ({ dataset }) => {
  // Filter States
  const [structureFilter, setStructureFilter] = useState<string>('All');
  const [materialFilter, setMaterialFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Canvas Refs for 8 Charts
  const chart1Ref = useRef<HTMLCanvasElement | null>(null);
  const chart2Ref = useRef<HTMLCanvasElement | null>(null);
  const chart3Ref = useRef<HTMLCanvasElement | null>(null);
  const chart4Ref = useRef<HTMLCanvasElement | null>(null);
  const chart5Ref = useRef<HTMLCanvasElement | null>(null);
  const chart6Ref = useRef<HTMLCanvasElement | null>(null);
  const chart7Ref = useRef<HTMLCanvasElement | null>(null);
  const chart8Ref = useRef<HTMLCanvasElement | null>(null);

  // Chart Instances
  const chart1Instance = useRef<ChartJS | null>(null);
  const chart2Instance = useRef<ChartJS | null>(null);
  const chart3Instance = useRef<ChartJS | null>(null);
  const chart4Instance = useRef<ChartJS | null>(null);
  const chart5Instance = useRef<ChartJS | null>(null);
  const chart6Instance = useRef<ChartJS | null>(null);
  const chart7Instance = useRef<ChartJS | null>(null);
  const chart8Instance = useRef<ChartJS | null>(null);

  const palette = {
    Bricks: '#F97316',
    Cement: '#3B82F6',
    Sand: '#EAB308',
    Steel: '#10B981',
    Wall: '#6366F1',
    Room: '#8B5CF6',
    House: '#EC4899',
  };

  // Filtered unique projects (for project-level charts: Charts 4, 5, 6, 8)
  const filteredProjects = useMemo(() => {
    return dataset.projects.filter((p) => {
      const matchesStructure =
        structureFilter === 'All' || p.Structure_Type === structureFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        p.Project_ID.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesStructure && matchesSearch;
    });
  }, [dataset.projects, structureFilter, searchQuery]);

  // Filtered material rows (for material-level charts: Charts 1, 2, 3, 7)
  const filteredMaterialRows = useMemo(() => {
    return dataset.rawRecords.filter((r) => {
      const matchesStructure =
        structureFilter === 'All' || r.Structure_Type === structureFilter;
      const matchesMaterial =
        materialFilter === 'All' || r.Material === materialFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        r.Project_ID.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesStructure && matchesMaterial && matchesSearch;
    });
  }, [dataset.rawRecords, structureFilter, materialFilter, searchQuery]);

  const handleResetFilters = () => {
    setStructureFilter('All');
    setMaterialFilter('All');
    setSearchQuery('');
  };

  // Render & Update all 8 Charts
  useEffect(() => {
    // Determine active materials list
    const activeMaterials =
      materialFilter === 'All'
        ? MATERIAL_TYPES
        : [materialFilter as MaterialType];

    // Determine active structures list
    const activeStructures =
      structureFilter === 'All'
        ? STRUCTURE_TYPES
        : [structureFilter as StructureType];

    // ==========================================
    // Chart 1: Total Material Cost by Material (Bar)
    // ==========================================
    if (chart1Ref.current) {
      if (chart1Instance.current) chart1Instance.current.destroy();

      const labels = activeMaterials;
      const data = activeMaterials.map((m) => {
        const rows = filteredMaterialRows.filter((r) => r.Material === m);
        return rows.reduce((sum, r) => sum + r.Material_Cost_INR, 0);
      });
      const bgColors = activeMaterials.map((m) => palette[m] || '#6B7280');

      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Total Material Cost (INR)',
              data,
              backgroundColor: bgColors,
              borderRadius: 6,
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
                label: (ctx) => ` Total Cost: ${formatINR(Number(ctx.raw))}`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                callback: (v) => formatINR(Number(v), false),
              },
            },
            x: { grid: { display: false } },
          },
        },
      };

      chart1Instance.current = new ChartJS(chart1Ref.current, config);
    }

    // ==========================================
    // Chart 2: Total Material Quantity (Bar)
    // ==========================================
    if (chart2Ref.current) {
      if (chart2Instance.current) chart2Instance.current.destroy();

      const labels = activeMaterials.map(
        (m) => `${m} (${dataset.unitsMap.get(m) || ''})`
      );
      const data = activeMaterials.map((m) => {
        const rows = filteredMaterialRows.filter((r) => r.Material === m);
        return rows.reduce((sum, r) => sum + r.Quantity, 0);
      });
      const bgColors = activeMaterials.map((m) => palette[m] || '#6B7280');

      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Total Recorded Quantity',
              data,
              backgroundColor: bgColors,
              borderRadius: 6,
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
                label: (ctx) => {
                  const m = activeMaterials[ctx.dataIndex];
                  const unit = dataset.unitsMap.get(m) || '';
                  return ` Quantity: ${formatNumber(Number(ctx.raw), 1)} ${unit}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                callback: (v) => formatNumber(Number(v), 0),
              },
            },
            x: { grid: { display: false } },
          },
        },
      };

      chart2Instance.current = new ChartJS(chart2Ref.current, config);
    }

    // ==========================================
    // Chart 3: Material Cost Distribution (Doughnut)
    // ==========================================
    if (chart3Ref.current) {
      if (chart3Instance.current) chart3Instance.current.destroy();

      const labels = activeMaterials;
      const data = activeMaterials.map((m) => {
        const rows = filteredMaterialRows.filter((r) => r.Material === m);
        return rows.reduce((sum, r) => sum + r.Material_Cost_INR, 0);
      });
      const totalFilteredCost = data.reduce((sum, v) => sum + v, 0);
      const bgColors = activeMaterials.map((m) => palette[m] || '#6B7280');

      const config: ChartConfiguration<'doughnut'> = {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: bgColors,
              borderWidth: 1.5,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 10, padding: 12, font: { size: 11 } },
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const val = Number(ctx.raw);
                  const pct =
                    totalFilteredCost > 0
                      ? ((val / totalFilteredCost) * 100).toFixed(1)
                      : '0';
                  return ` ${ctx.label}: ${formatINR(val)} (${pct}%)`;
                },
              },
            },
          },
        },
      };

      chart3Instance.current = new ChartJS(chart3Ref.current, config);
    }

    // ==========================================
    // Chart 4: Average Project Cost by Structure Type (Bar)
    // ==========================================
    if (chart4Ref.current) {
      if (chart4Instance.current) chart4Instance.current.destroy();

      const labels = activeStructures;
      const data = activeStructures.map((st) => {
        const sub = filteredProjects.filter((p) => p.Structure_Type === st);
        return sub.length > 0
          ? sub.reduce((sum, p) => sum + p.Total_Project_Cost_INR, 0) / sub.length
          : 0;
      });
      const bgColors = activeStructures.map((st) => palette[st] || '#14213D');

      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Average Project Cost (INR)',
              data,
              backgroundColor: bgColors,
              borderRadius: 6,
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
                label: (ctx) => ` Avg Cost: ${formatINR(Number(ctx.raw))}`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                callback: (v) => formatINR(Number(v), false),
              },
            },
            x: { grid: { display: false } },
          },
        },
      };

      chart4Instance.current = new ChartJS(chart4Ref.current, config);
    }

    // ==========================================
    // Chart 5: Construction Area vs Project Cost (Scatter Plot)
    // ==========================================
    if (chart5Ref.current) {
      if (chart5Instance.current) chart5Instance.current.destroy();

      const scatterData = filteredProjects.map((p) => ({
        x: p.Area_m2,
        y: p.Total_Project_Cost_INR,
        id: p.Project_ID,
        type: p.Structure_Type,
      }));

      const config: ChartConfiguration<'scatter'> = {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Unique Projects',
              data: scatterData,
              backgroundColor: '#F97316',
              borderColor: '#EA580C',
              borderWidth: 1,
              pointRadius: 5,
              pointHoverRadius: 7,
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
                label: (ctx) => {
                  const pt = ctx.raw as { x: number; y: number; id: string; type: string };
                  return ` ${pt.id} (${pt.type}): Area ${pt.x}m² -> ${formatINR(pt.y)}`;
                },
              },
            },
          },
          scales: {
            x: {
              title: { display: true, text: 'Construction Area (m²)', font: { size: 11, weight: 600 } },
              grid: { color: 'rgba(0,0,0,0.05)' },
            },
            y: {
              title: { display: true, text: 'Total Project Cost (INR)', font: { size: 11, weight: 600 } },
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                callback: (v) => formatINR(Number(v), false),
              },
            },
          },
        },
      };

      chart5Instance.current = new ChartJS(chart5Ref.current, config);
    }

    // ==========================================
    // Chart 6: Construction Volume vs Project Cost (Scatter Plot)
    // ==========================================
    if (chart6Ref.current) {
      if (chart6Instance.current) chart6Instance.current.destroy();

      const scatterData = filteredProjects.map((p) => ({
        x: p.Volume_m3,
        y: p.Total_Project_Cost_INR,
        id: p.Project_ID,
        type: p.Structure_Type,
      }));

      const config: ChartConfiguration<'scatter'> = {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Unique Projects',
              data: scatterData,
              backgroundColor: '#3B82F6',
              borderColor: '#2563EB',
              borderWidth: 1,
              pointRadius: 5,
              pointHoverRadius: 7,
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
                label: (ctx) => {
                  const pt = ctx.raw as { x: number; y: number; id: string; type: string };
                  return ` ${pt.id} (${pt.type}): Volume ${pt.x}m³ -> ${formatINR(pt.y)}`;
                },
              },
            },
          },
          scales: {
            x: {
              title: { display: true, text: 'Construction Volume (m³)', font: { size: 11, weight: 600 } },
              grid: { color: 'rgba(0,0,0,0.05)' },
            },
            y: {
              title: { display: true, text: 'Total Project Cost (INR)', font: { size: 11, weight: 600 } },
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                callback: (v) => formatINR(Number(v), false),
              },
            },
          },
        },
      };

      chart6Instance.current = new ChartJS(chart6Ref.current, config);
    }

    // ==========================================
    // Chart 7: Material Unit Price Comparison (Bar)
    // ==========================================
    if (chart7Ref.current) {
      if (chart7Instance.current) chart7Instance.current.destroy();

      const labels = activeMaterials.map(
        (m) => `${m} (₹/${dataset.unitsMap.get(m) || 'unit'})`
      );
      const data = activeMaterials.map((m) => {
        const rows = filteredMaterialRows.filter((r) => r.Material === m);
        const prices = rows.map((r) => r.Unit_Price_INR);
        return calculateMedian(prices);
      });
      const bgColors = activeMaterials.map((m) => palette[m] || '#6B7280');

      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Median Unit Price (INR)',
              data,
              backgroundColor: bgColors,
              borderRadius: 6,
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
                label: (ctx) => {
                  const m = activeMaterials[ctx.dataIndex];
                  const u = dataset.unitsMap.get(m) || '';
                  return ` Median Price: ${formatINR(Number(ctx.raw))} per ${u}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                callback: (v) => formatINR(Number(v), false),
              },
            },
            x: { grid: { display: false } },
          },
        },
      };

      chart7Instance.current = new ChartJS(chart7Ref.current, config);
    }

    // ==========================================
    // Chart 8: Project Cost Distribution (Histogram / Cost Ranges)
    // ==========================================
    if (chart8Ref.current) {
      if (chart8Instance.current) chart8Instance.current.destroy();

      // Define standard project cost brackets based on dataset bounds (min ~₹25k, max ~₹8.17L)
      const buckets = [
        { label: '< ₹1 Lakh', min: 0, max: 100000, count: 0 },
        { label: '₹1L – ₹2 Lakhs', min: 100000, max: 200000, count: 0 },
        { label: '₹2L – ₹4 Lakhs', min: 200000, max: 400000, count: 0 },
        { label: '₹4L – ₹6 Lakhs', min: 400000, max: 600000, count: 0 },
        { label: '> ₹6 Lakhs', min: 600000, max: Infinity, count: 0 },
      ];

      filteredProjects.forEach((p) => {
        const cost = p.Total_Project_Cost_INR;
        for (const b of buckets) {
          if (cost >= b.min && cost < b.max) {
            b.count++;
            break;
          }
        }
      });

      const labels = buckets.map((b) => b.label);
      const data = buckets.map((b) => b.count);

      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Project Count',
              data,
              backgroundColor: '#14213D',
              hoverBackgroundColor: '#F97316',
              borderRadius: 6,
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
                label: (ctx) => ` Frequency: ${ctx.raw} unique projects`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: { stepSize: 2 },
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 } },
            },
          },
        },
      };

      chart8Instance.current = new ChartJS(chart8Ref.current, config);
    }

    return () => {
      chart1Instance.current?.destroy();
      chart2Instance.current?.destroy();
      chart3Instance.current?.destroy();
      chart4Instance.current?.destroy();
      chart5Instance.current?.destroy();
      chart6Instance.current?.destroy();
      chart7Instance.current?.destroy();
      chart8Instance.current?.destroy();
    };
  }, [filteredProjects, filteredMaterialRows, dataset, structureFilter, materialFilter]);

  return (
    <section id="analytics" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
            <span>Comprehensive Dataset Analytics</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#14213D] tracking-tight">
            Construction Project & Material Analytics
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Explore empirical cost distributions, material consumption patterns, structural archetypes, and econometric correlations across 75 unique projects and 300 material records.
          </p>
        </div>

        {/* Filter Toolbar (Section 13) */}
        <div className="bg-[#F7F8FC] p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Filter className="w-4 h-4 text-orange-500" />
              <span>Interactive Filters</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-orange-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Structure Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Structure Type
              </label>
              <select
                value={structureFilter}
                onChange={(e) => setStructureFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              >
                <option value="All">All Structure Types</option>
                <option value="Wall">Wall</option>
                <option value="Room">Room</option>
                <option value="House">House</option>
              </select>
            </div>

            {/* Material Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Material Focus
              </label>
              <select
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              >
                <option value="All">All Materials</option>
                <option value="Bricks">Bricks</option>
                <option value="Cement">Cement</option>
                <option value="Sand">Sand</option>
                <option value="Steel">Steel</option>
              </select>
            </div>

            {/* Project ID Search */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Search by Project ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. P001, P045, P075..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono placeholder:font-sans focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Active Filter Scope Summary */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600 border-t border-slate-200/80">
            <span className="font-semibold text-slate-700">Active Analytics Scope:</span>
            <span>{filteredProjects.length} matching unique projects</span>
            <span aria-hidden="true">·</span>
            <span>{filteredMaterialRows.length} matching material observations</span>
            {(structureFilter !== 'All' || materialFilter !== 'All' || searchQuery) && (
              <span className="text-orange-600 font-medium ml-auto">
                Filters applied
              </span>
            )}
          </div>
        </div>

        {/* 8 Charts Grid (Section 12) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Chart 1 */}
          <div className="bg-[#F7F8FC] p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-2">
              <h4 className="text-sm font-bold text-slate-900">1. Total Material Cost</h4>
              <p className="text-xs text-slate-500">Sum of Material_Cost_INR by material</p>
            </div>
            <div className="relative h-60 w-full flex-1">
              <canvas ref={chart1Ref} />
            </div>
          </div>

          {/* Chart 2 */}
          <div className="bg-[#F7F8FC] p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-2">
              <h4 className="text-sm font-bold text-slate-900">2. Recorded Quantity</h4>
              <p className="text-xs text-slate-500">Aggregate physical consumption (with units)</p>
            </div>
            <div className="relative h-60 w-full flex-1">
              <canvas ref={chart2Ref} />
            </div>
          </div>

          {/* Chart 3 */}
          <div className="bg-[#F7F8FC] p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-2">
              <h4 className="text-sm font-bold text-slate-900">3. Cost Distribution</h4>
              <p className="text-xs text-slate-500">Share of total recorded material budget</p>
            </div>
            <div className="relative h-60 w-full flex-1">
              <canvas ref={chart3Ref} />
            </div>
          </div>

          {/* Chart 4 */}
          <div className="bg-[#F7F8FC] p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-2">
              <h4 className="text-sm font-bold text-slate-900">4. Avg. Cost by Structure</h4>
              <p className="text-xs text-slate-500">Unique project averages (no duplicate rows)</p>
            </div>
            <div className="relative h-60 w-full flex-1">
              <canvas ref={chart4Ref} />
            </div>
          </div>

          {/* Chart 5 */}
          <div className="bg-[#F7F8FC] p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-2">
              <h4 className="text-sm font-bold text-slate-900">5. Area vs. Project Cost</h4>
              <p className="text-xs text-slate-500">Scatter: 1 point = 1 unique project (m²)</p>
            </div>
            <div className="relative h-60 w-full flex-1">
              <canvas ref={chart5Ref} />
            </div>
          </div>

          {/* Chart 6 */}
          <div className="bg-[#F7F8FC] p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-2">
              <h4 className="text-sm font-bold text-slate-900">6. Volume vs. Cost</h4>
              <p className="text-xs text-slate-500">Scatter: 1 point = 1 unique project (m³)</p>
            </div>
            <div className="relative h-60 w-full flex-1">
              <canvas ref={chart6Ref} />
            </div>
          </div>

          {/* Chart 7 */}
          <div className="bg-[#F7F8FC] p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-2">
              <h4 className="text-sm font-bold text-slate-900">7. Unit Price Comparison</h4>
              <p className="text-xs text-slate-500">Median Unit_Price_INR by material</p>
            </div>
            <div className="relative h-60 w-full flex-1">
              <canvas ref={chart7Ref} />
            </div>
          </div>

          {/* Chart 8 */}
          <div className="bg-[#F7F8FC] p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-2">
              <h4 className="text-sm font-bold text-slate-900">8. Project Cost Distribution</h4>
              <p className="text-xs text-slate-500">Histogram of unique project cost brackets</p>
            </div>
            <div className="relative h-60 w-full flex-1">
              <canvas ref={chart8Ref} />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
