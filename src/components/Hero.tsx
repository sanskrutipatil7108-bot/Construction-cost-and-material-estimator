import React from 'react';
import { ArrowRight, BarChart3, Calculator, Building2, Layers, IndianRupee, Ruler, Box } from 'lucide-react';
import { ProcessedDataset, formatINR, formatNumber } from '../utils/dataProcessor';

interface HeroProps {
  dataset: ProcessedDataset;
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ dataset, onNavigate }) => {
  // Compute metrics dynamically from the dataset
  const uniqueProjectsCount = dataset.projects.length;
  const uniqueMaterialsCount = dataset.qualityReport.uniqueMaterials;
  const uniqueStructuresCount = dataset.qualityReport.uniqueStructures;
  
  // Total construction area across unique projects
  const totalConstructionArea = dataset.projects.reduce((sum, p) => sum + p.Area_m2, 0);

  // Average project cost (one per unique project)
  const avgProjectCost = dataset.insights.averageProjectCost;

  // Total recorded material cost (sum of material level costs)
  const totalMaterialCost = dataset.rawRecords.reduce((sum, r) => sum + r.Material_Cost_INR, 0);

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#14213D] via-[#1A2C50] to-[#14213D] text-white pt-12 pb-16 lg:pt-16 lg:pb-20">
      {/* Subtle blueprint grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400">
              <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
              <span>Engineering Estimation & Analytics Suite</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.1]">
              Build Smarter. <br />
              <span className="text-[#F97316]">Estimate Better.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed text-balance">
              Estimate construction material requirements, understand project costs, and explore data-driven construction insights in one place.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('estimator')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#F97316] text-white font-semibold text-sm hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <Calculator className="w-4 h-4" />
                <span>Start Estimating</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('analytics')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700 font-semibold text-sm hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <BarChart3 className="w-4 h-4 text-orange-400" />
                <span>Explore Analytics</span>
              </button>
            </div>

            {/* Micro proof indicator */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <span>Grounded in {uniqueProjectsCount} verified Indian construction records</span>
              <span aria-hidden="true">·</span>
              <span>Wall, Room & House models</span>
            </div>
          </div>

          {/* Right Column: High-Fidelity Blueprint Image Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl">
              <img
                src="/src/assets/images/constructx_blueprint_hero_1792593358275.jpg"
                alt="ConstructX Architectural 3D Isometric Blueprint"
                className="w-full h-72 sm:h-80 lg:h-96 object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to structured styled technical blueprint view
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.blueprint-fallback');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
              {/* Fallback container */}
              <div 
                className="blueprint-fallback hidden w-full h-72 sm:h-80 lg:h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-[#14213D] p-6 flex-col justify-between"
                aria-hidden="true"
              >
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                  <span className="text-xs font-mono text-orange-400">CONSTRUCTX // ARCHITECTURAL ELEVATION</span>
                  <span className="text-xs text-slate-400 font-mono">SCALE 1:100</span>
                </div>
                <div className="my-auto flex flex-col items-center justify-center text-center space-y-2">
                  <Building2 className="w-16 h-16 text-orange-400/80 stroke-1" />
                  <p className="text-sm font-semibold text-slate-200">Structural Volumetric Analysis</p>
                  <p className="text-xs text-slate-400 max-w-xs">Bricks, Cement, Sand & Steel dimensional consumption modeling</p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-3 border-t border-slate-700/80">
                  <span>AREA: L × W</span>
                  <span>VOLUME: AREA × H</span>
                  <span>DATASET: 300 RECS</span>
                </div>
              </div>

              {/* Blueprint caption bar */}
              <div className="bg-[#14213D]/95 px-4 py-2.5 border-t border-slate-700 flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium text-slate-200">Dataset-Derived Material Estimation</span>
                <span className="font-mono text-orange-400">Median Ratio Engine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Statistics Dashboard Strip (Section 7) */}
        <div className="mt-14 pt-8 border-t border-slate-700/60">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* Metric 1 */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 transition-colors hover:border-slate-600">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                <Building2 className="w-3.5 h-3.5 text-orange-400" />
                <span>Unique Projects</span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-white">
                {uniqueProjectsCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">From 300 records</p>
            </div>

            {/* Metric 2 */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 transition-colors hover:border-slate-600">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                <Layers className="w-3.5 h-3.5 text-orange-400" />
                <span>Material Types</span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-white">
                {uniqueMaterialsCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Bricks, Cement, Sand, Steel</p>
            </div>

            {/* Metric 3 */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 transition-colors hover:border-slate-600">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                <Box className="w-3.5 h-3.5 text-orange-400" />
                <span>Structure Types</span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-white">
                {uniqueStructuresCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Wall, Room, House</p>
            </div>

            {/* Metric 4 */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 transition-colors hover:border-slate-600">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                <IndianRupee className="w-3.5 h-3.5 text-orange-400" />
                <span>Avg. Project Cost</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-white truncate" title={formatINR(avgProjectCost)}>
                {formatINR(avgProjectCost, false)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">One cost per project</p>
            </div>

            {/* Metric 5 */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 transition-colors hover:border-slate-600">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                <IndianRupee className="w-3.5 h-3.5 text-orange-400" />
                <span>Total Material Cost</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-white truncate" title={formatINR(totalMaterialCost)}>
                {formatINR(totalMaterialCost, false)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Sum without double-count</p>
            </div>

            {/* Metric 6 */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 transition-colors hover:border-slate-600">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                <Ruler className="w-3.5 h-3.5 text-orange-400" />
                <span>Total Built Area</span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-white truncate">
                {formatNumber(totalConstructionArea, 1)} <span className="text-sm font-normal text-slate-300">m²</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Across unique projects</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
