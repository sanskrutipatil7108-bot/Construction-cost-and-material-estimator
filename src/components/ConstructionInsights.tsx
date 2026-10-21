import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Building2,
  DollarSign,
  Package,
  Layers,
  Ruler,
  Box,
  Compass,
} from 'lucide-react';
import { DatasetInsights } from '../types/construction';
import { formatINR, formatNumber } from '../utils/dataProcessor';

interface ConstructionInsightsProps {
  insights: DatasetInsights;
}

export const ConstructionInsights: React.FC<ConstructionInsightsProps> = ({ insights }) => {
  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
            <span>Empirical Findings</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#14213D] tracking-tight">
            Construction Insights
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Automatically generated analytical conclusions derived from statistical aggregation of the 300 uploaded dataset records.
          </p>
        </div>

        {/* Dynamic Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Insight 1: Most Common Structure */}
          <div className="bg-[#F7F8FC] p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Structural Distribution
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {insights.mostCommonStructure.type}
              </div>
              <p className="text-xs font-semibold text-purple-700 mt-0.5">
                {insights.mostCommonStructure.count} projects ({insights.mostCommonStructure.percentage.toFixed(1)}% of dataset)
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Standard enclosed room units represent the most frequent archetype sampled, reflecting frequent institutional and residential expansion requirements.
              </p>
            </div>
          </div>

          {/* Insight 2: Highest Cost Material */}
          <div className="bg-[#F7F8FC] p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Primary Cost Driver
              </span>
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#F97316] font-mono">
                {insights.highestCostMaterial.material}
              </div>
              <p className="text-xs font-semibold text-orange-700 mt-0.5 font-mono">
                {formatINR(insights.highestCostMaterial.totalCost, false)} ({insights.highestCostMaterial.percentage.toFixed(1)}% of total cost)
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Masonry bricks constitute the dominant expenditure category across projects, followed by cement binders and structural reinforcing steel.
              </p>
            </div>
          </div>

          {/* Insight 3: Highest Recorded Quantity */}
          <div className="bg-[#F7F8FC] p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Volumetric Volume Leader
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {insights.highestQuantityMaterial.material}
              </div>
              <p className="text-xs font-semibold text-blue-700 mt-0.5 font-mono">
                {formatNumber(insights.highestQuantityMaterial.totalQuantity, 0)} {insights.highestQuantityMaterial.unit}
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Total unit counts peak with bricks due to discrete masonry assembly requirements, demanding dedicated site handling and staging.
              </p>
            </div>
          </div>

          {/* Insight 4: Highest Avg Cost Structure */}
          <div className="bg-[#F7F8FC] p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Highest Capital Archetype
              </span>
              <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {insights.highestAvgCostStructure.type}
              </div>
              <p className="text-xs font-semibold text-pink-700 mt-0.5 font-mono">
                Avg: {formatINR(insights.highestAvgCostStructure.avgCost, false)} per project
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Complete multi-room residential house structures require substantially elevated foundation, roof slab, and structural wall volumes compared to standalone walls.
              </p>
            </div>
          </div>

          {/* Insight 5: Largest Project by Area */}
          <div className="bg-[#F7F8FC] p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Maximum Footprint
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Ruler className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                Project {insights.largestProjectByArea.id}
              </div>
              <p className="text-xs font-semibold text-emerald-700 mt-0.5 font-mono">
                {insights.largestProjectByArea.area.toFixed(2)} m² ({insights.largestProjectByArea.type}) · {formatINR(insights.largestProjectByArea.cost, false)}
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Project {insights.largestProjectByArea.id} represents the largest single footprint recorded, demonstrating extensive floor and partition wall demands.
              </p>
            </div>
          </div>

          {/* Insight 6: Largest Project by Volume */}
          <div className="bg-[#F7F8FC] p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Maximum 3D Volume
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Box className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                Project {insights.largestProjectByVolume.id}
              </div>
              <p className="text-xs font-semibold text-indigo-700 mt-0.5 font-mono">
                {insights.largestProjectByVolume.volume.toFixed(2)} m³ · {formatINR(insights.largestProjectByVolume.cost, false)}
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Enclosed volume peaks with {insights.largestProjectByVolume.id}, which also recorded the maximum overall project cost at {formatINR(insights.largestProjectByVolume.cost, false)}.
              </p>
            </div>
          </div>

        </div>

        {/* Statistical Correlation Analysis Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          <div className="p-5 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Area vs. Total Cost Correlation
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                Pearson r = {insights.areaCostCorrelation.r.toFixed(4)}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {insights.areaCostCorrelation.interpretation}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F7F8FC] border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Volume vs. Total Cost Correlation
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Pearson r = {insights.volumeCostCorrelation.r.toFixed(4)}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {insights.volumeCostCorrelation.interpretation}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
