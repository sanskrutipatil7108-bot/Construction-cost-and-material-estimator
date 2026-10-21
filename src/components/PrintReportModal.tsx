import React from 'react';
import { X, Printer, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { EstimationResult } from '../types/construction';
import { formatINR, formatNumber, generateEstimateCSV } from '../utils/dataProcessor';

interface PrintReportModalProps {
  estimate: EstimationResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  estimate,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !estimate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const csvContent = generateEstimateCSV(estimate);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `ConstructX_Estimate_${estimate.inputs.structureType}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header Controls (Hidden during print) */}
        <div className="no-print bg-[#14213D] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-orange-400" />
            <h3 className="text-base font-bold">ConstructX Estimation Report Preview</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-xs font-semibold rounded-md border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F97316] text-white text-xs font-semibold rounded-md hover:bg-orange-600 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Document Content */}
        <div className="p-8 sm:p-10 space-y-8 bg-white print:p-0">
          
          {/* Header Brand Block */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-black tracking-tight text-[#14213D]">
                  Construct<span className="text-[#F97316]">X</span>
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-2 border-l border-slate-300">
                  Engineering Report
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600">
                Construction Material Quantity & Cost Estimation Platform
              </p>
              <p className="text-xs text-slate-500 italic mt-0.5">
                "Build Smarter. Estimate Better."
              </p>
            </div>
            <div className="text-right text-xs text-slate-600 space-y-1 font-mono">
              <p className="font-semibold text-slate-800">Doc Ref: EST-{Date.now().toString().slice(-6)}</p>
              <p>Date: {estimate.timestamp}</p>
              <p>Currency: INR (₹)</p>
            </div>
          </div>

          {/* Project Dimension Matrix */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              01. Structural Dimensions & Volumetric Parameters
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs text-slate-500 block">Structure Archetype</span>
                <span className="text-sm font-bold text-slate-900">{estimate.inputs.structureType}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Length × Width</span>
                <span className="text-sm font-semibold text-slate-800 font-mono tabular-nums">
                  {estimate.inputs.length_m}m × {estimate.inputs.width_m}m
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Height (Thickness)</span>
                <span className="text-sm font-semibold text-slate-800 font-mono tabular-nums">
                  {estimate.inputs.height_m}m ({estimate.inputs.thickness_m}m)
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Area & Volume</span>
                <span className="text-sm font-bold text-[#F97316] font-mono tabular-nums">
                  {formatNumber(estimate.calculatedArea_m2, 2)} m² / {formatNumber(estimate.calculatedVolume_m3, 2)} m³
                </span>
              </div>
            </div>
          </div>

          {/* Material Breakdown Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              02. Itemized Material Requirement & Cost Schedule
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#14213D] text-white">
                    <th className="py-2.5 px-4 font-semibold">Material</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Required Quantity</th>
                    <th className="py-2.5 px-4 font-semibold">Unit</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Unit Price (₹)</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Estimated Cost (₹)</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Share (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {estimate.items.map((item) => (
                    <tr key={item.material} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-semibold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.material}</span>
                      </td>
                      <td className="py-2.5 px-4 font-mono tabular-nums text-right text-slate-900 font-medium">
                        {formatNumber(item.quantity, 2)}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 font-medium">{item.unit}</td>
                      <td className="py-2.5 px-4 font-mono tabular-nums text-right text-slate-700">
                        {formatNumber(item.unitPrice, 2)}
                      </td>
                      <td className="py-2.5 px-4 font-mono tabular-nums text-right font-semibold text-slate-900">
                        {formatINR(item.cost, true)}
                      </td>
                      <td className="py-2.5 px-4 font-mono tabular-nums text-right text-slate-600">
                        {item.percentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-orange-50/70 font-bold border-t-2 border-slate-900">
                    <td colSpan={4} className="py-3 px-4 text-slate-900 uppercase text-xs tracking-wider">
                      Total Estimated Construction Material Cost
                    </td>
                    <td className="py-3 px-4 text-right text-base text-[#F97316] font-mono tabular-nums">
                      {formatINR(estimate.totalEstimatedCost, true)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700 font-mono">100.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Ratio Metadata Footnote */}
          <div className="bg-slate-50 rounded-lg p-3 text-[11px] text-slate-600 space-y-1">
            <span className="font-semibold text-slate-700">Calculation Methodology: </span>
            <span>
              Material quantities derived via median consumption ratios for structural archetype [{estimate.inputs.structureType}]:
              {' '}
              {estimate.items
                .map(
                  (i) => `${i.material}: ${i.consumptionRatioUsed.toFixed(4)} ${i.unit}/m³`
                )
                .join(' | ')}.
            </span>
          </div>

          {/* Mandatory Estimation Disclaimer */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-start gap-2.5 text-slate-600">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-slate-700 tracking-wide">
                  Estimation Disclaimer
                </span>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  All estimates are indicative and depend on the consumption patterns and material prices used for calculation. Actual construction requirements may differ based on structural design, engineering specifications, material wastage, construction methods, local prices, labor, transportation, taxes, and applicable standards. Verify estimates with a qualified construction professional before purchasing materials or beginning construction.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
