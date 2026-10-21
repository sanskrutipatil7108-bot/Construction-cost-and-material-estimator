import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Layers,
  Calculator,
  Compass,
  FileSpreadsheet,
} from 'lucide-react';

export const About: React.FC = () => {
  const capabilities = [
    'Construction dimension calculations',
    'Material quantity estimation',
    'Material-wise cost breakdown',
    'Interactive data visualization',
    'Project comparison',
    'Cost and quantity analysis',
    'Downloadable estimation reports',
  ];

  return (
    <section id="about" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
            <span>Platform Overview</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#14213D] tracking-tight">
            About ConstructX
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Empowering engineers, project managers, and builders with data-driven construction quantification and transparent econometric modeling.
          </p>
        </div>

        {/* Content Block 1 & 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <div className="space-y-4 bg-[#F7F8FC] p-8 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#14213D] flex items-center gap-2">
              <Compass className="w-5 h-5 text-orange-500" />
              <span>About ConstructX</span>
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              ConstructX is a construction estimation platform designed to simplify material quantity calculations, construction cost estimation, and project cost analysis. By combining construction dimensions, material consumption patterns, pricing information, and interactive visualizations, ConstructX helps users understand estimated material requirements and anticipated costs.
            </p>
          </div>

          <div className="space-y-4 bg-[#F7F8FC] p-8 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#14213D] flex items-center gap-2">
              <Calculator className="w-5 h-5 text-orange-500" />
              <span>What We Do</span>
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              ConstructX provides a structured way to estimate construction material quantities, compare material costs, explore project data, and visualize relationships between construction dimensions and project expenses.
            </p>
          </div>

        </div>

        {/* Core Capabilities */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-[#14213D]">
              Core Capabilities
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((cap, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-orange-300 transition-colors flex items-start gap-3 shadow-xs"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-800 leading-snug">
                  {cap}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Estimation Disclaimer */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Estimation Disclaimer
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                All estimates are indicative and depend on the consumption patterns and material prices used for calculation. Actual construction requirements may differ based on structural design, engineering specifications, material wastage, construction methods, local prices, labor, transportation, taxes, and applicable standards. Verify estimates with a qualified construction professional before purchasing materials or beginning construction.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
