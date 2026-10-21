import React, { useState, useEffect } from 'react';
import {
  Calculator,
  RotateCcw,
  Download,
  Printer,
  Ruler,
  Box,
  Building,
  Home,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  StructureType,
  EstimationInputs,
  EstimationResult,
} from '../types/construction';
import {
  ProcessedDataset,
  calculateEstimate,
  formatINR,
  formatNumber,
  generateEstimateCSV,
} from '../utils/dataProcessor';
import { EstimatorCharts } from './EstimatorCharts';
import { PrintReportModal } from './PrintReportModal';

interface EstimatorProps {
  dataset: ProcessedDataset;
}

export const Estimator: React.FC<EstimatorProps> = ({ dataset }) => {
  // Input states with clean initial defaults
  const [structureType, setStructureType] = useState<StructureType>('Room');
  const [length, setLength] = useState<string>('5.0');
  const [width, setWidth] = useState<string>('4.0');
  const [height, setHeight] = useState<string>('3.0');
  const [thickness, setThickness] = useState<string>('0.23');

  // Validation & Result states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [estimateResult, setEstimateResult] = useState<EstimationResult | null>(null);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Pre-fill a valid estimate on mount
  useEffect(() => {
    handleRunCalculation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Quick preset loader
  const handleApplyPreset = (type: StructureType, l: number, w: number, h: number, t: number) => {
    setStructureType(type);
    setLength(l.toString());
    setWidth(w.toString());
    setHeight(h.toString());
    setThickness(t.toString());
    setErrors({});
  };

  const validateInputs = (): EstimationInputs | null => {
    const errs: { [key: string]: string } = {};

    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    const t = parseFloat(thickness);

    if (isNaN(l) || l <= 0) {
      errs.length = 'Length must be a valid positive number greater than 0.';
    }
    if (isNaN(w) || w <= 0) {
      errs.width = 'Width must be a valid positive number greater than 0.';
    }
    if (isNaN(h) || h <= 0) {
      errs.height = 'Height must be a valid positive number greater than 0.';
    }
    if (isNaN(t) || t <= 0) {
      errs.thickness = 'Thickness must be a positive number greater than 0.';
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      return null;
    }

    return {
      structureType,
      length_m: l,
      width_m: w,
      height_m: h,
      thickness_m: t,
    };
  };

  const handleRunCalculation = () => {
    const validInputs = validateInputs();
    if (!validInputs) {
      setEstimateResult(null);
      return;
    }

    const result = calculateEstimate(validInputs, dataset);
    setEstimateResult(result);
  };

  const handleReset = () => {
    setStructureType('Room');
    setLength('5.0');
    setWidth('4.0');
    setHeight('3.0');
    setThickness('0.23');
    setErrors({});
    setEstimateResult(null);
  };

  const handleDownloadCSV = () => {
    if (!estimateResult) return;
    const csvContent = generateEstimateCSV(estimateResult);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `ConstructX_Estimate_${estimateResult.inputs.structureType}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Real-time dimensions area and volume preview
  const parsedL = parseFloat(length) || 0;
  const parsedW = parseFloat(width) || 0;
  const parsedH = parseFloat(height) || 0;
  const liveArea = parsedL > 0 && parsedW > 0 ? parsedL * parsedW : 0;
  const liveVolume = liveArea > 0 && parsedH > 0 ? liveArea * parsedH : 0;

  return (
    <section id="estimator" className="py-16 bg-[#F7F8FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
              <span>Interactive Dimension Engine</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#14213D] tracking-tight">
              Construction Material & Cost Estimator
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Input physical project dimensions to calculate required quantities of Bricks, Cement, Sand, and Steel using median consumption ratios and representative unit prices derived from the dataset.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Presets:</span>
            <button
              onClick={() => handleApplyPreset('Wall', 15.0, 0.23, 3.0, 0.23)}
              className="px-2.5 py-1 text-xs font-medium rounded bg-white border border-slate-300 text-slate-700 hover:border-orange-500 hover:text-orange-600 transition-colors"
            >
              Boundary Wall (15m)
            </button>
            <button
              onClick={() => handleApplyPreset('Room', 5.5, 4.5, 3.2, 0.23)}
              className="px-2.5 py-1 text-xs font-medium rounded bg-white border border-slate-300 text-slate-700 hover:border-orange-500 hover:text-orange-600 transition-colors"
            >
              Standard Room (5.5×4.5m)
            </button>
            <button
              onClick={() => handleApplyPreset('House', 14.0, 10.0, 3.2, 0.23)}
              className="px-2.5 py-1 text-xs font-medium rounded bg-white border border-slate-300 text-slate-700 hover:border-orange-500 hover:text-orange-600 transition-colors"
            >
              Residential House (14×10m)
            </button>
          </div>
        </div>

        {/* Input Interface Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          
          {/* Step 1: Structure Type Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              1. Select Construction Structure Archetype
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Wall Option */}
              <button
                type="button"
                onClick={() => setStructureType('Wall')}
                className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                  structureType === 'Wall'
                    ? 'border-[#F97316] bg-orange-50/50 shadow-sm ring-1 ring-[#F97316]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${structureType === 'Wall' ? 'bg-[#F97316] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Wall</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Boundary, partition, and perimeter brick walls</p>
                  <span className="text-[11px] font-mono text-orange-700 font-medium block mt-2">
                    Brick Ratio: ~495 pcs/m³
                  </span>
                </div>
              </button>

              {/* Room Option */}
              <button
                type="button"
                onClick={() => setStructureType('Room')}
                className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                  structureType === 'Room'
                    ? 'border-[#F97316] bg-orange-50/50 shadow-sm ring-1 ring-[#F97316]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${structureType === 'Room' ? 'bg-[#F97316] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Room</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Enclosed single chamber, bedroom, or office unit</p>
                  <span className="text-[11px] font-mono text-orange-700 font-medium block mt-2">
                    Brick Ratio: ~89 pcs/m³
                  </span>
                </div>
              </button>

              {/* House Option */}
              <button
                type="button"
                onClick={() => setStructureType('House')}
                className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                  structureType === 'House'
                    ? 'border-[#F97316] bg-orange-50/50 shadow-sm ring-1 ring-[#F97316]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${structureType === 'House' ? 'bg-[#F97316] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">House</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Multi-room complete residential building frame</p>
                  <span className="text-[11px] font-mono text-orange-700 font-medium block mt-2">
                    Brick Ratio: ~68 pcs/m³
                  </span>
                </div>
              </button>

            </div>
          </div>

          {/* Step 2: Dimensions Form Inputs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              2. Enter Construction Dimensions (Metres)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Length Input */}
              <div>
                <label htmlFor="length_input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Length <span className="text-slate-400 font-normal">(metres)</span>
                </label>
                <div className="relative">
                  <input
                    id="length_input"
                    type="number"
                    step="0.01"
                    min="0.1"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="e.g. 10.0"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-lg border font-mono tabular-nums ${
                      errors.length
                        ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-red-400'
                        : 'border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-mono">
                    m
                  </span>
                </div>
                {errors.length && <p className="text-xs text-red-600 mt-1">{errors.length}</p>}
              </div>

              {/* Width Input */}
              <div>
                <label htmlFor="width_input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Width <span className="text-slate-400 font-normal">(metres)</span>
                </label>
                <div className="relative">
                  <input
                    id="width_input"
                    type="number"
                    step="0.01"
                    min="0.05"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="e.g. 6.5"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-lg border font-mono tabular-nums ${
                      errors.width
                        ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-red-400'
                        : 'border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-mono">
                    m
                  </span>
                </div>
                {errors.width && <p className="text-xs text-red-600 mt-1">{errors.width}</p>}
              </div>

              {/* Height Input */}
              <div>
                <label htmlFor="height_input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Height <span className="text-slate-400 font-normal">(metres)</span>
                </label>
                <div className="relative">
                  <input
                    id="height_input"
                    type="number"
                    step="0.01"
                    min="0.5"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 3.0"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-lg border font-mono tabular-nums ${
                      errors.height
                        ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-red-400'
                        : 'border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-mono">
                    m
                  </span>
                </div>
                {errors.height && <p className="text-xs text-red-600 mt-1">{errors.height}</p>}
              </div>

              {/* Thickness Input */}
              <div>
                <label htmlFor="thickness_input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Thickness <span className="text-slate-400 font-normal">(metres)</span>
                </label>
                <div className="relative">
                  <input
                    id="thickness_input"
                    type="number"
                    step="0.01"
                    min="0.1"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                    placeholder="e.g. 0.23"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-lg border font-mono tabular-nums ${
                      errors.thickness
                        ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-red-400'
                        : 'border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-mono">
                    m
                  </span>
                </div>
                {errors.thickness && <p className="text-xs text-red-600 mt-1">{errors.thickness}</p>}
              </div>

            </div>
          </div>

          {/* Real-time Engineering Formula Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                <Info className="w-4 h-4 text-slate-700" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">Dataset Volume Convention Preserved</p>
                <p className="text-[11px] text-slate-500">
                  Area (m²) = Length × Width | Volume (m³) = Area × Height. Thickness is preserved as a structural boundary attribute.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono shrink-0">
              <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-slate-500">Area: </span>
                <span className="font-bold text-slate-900">{formatNumber(liveArea, 2)} m²</span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-slate-500">Volume: </span>
                <span className="font-bold text-orange-600">{formatNumber(liveVolume, 2)} m³</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRunCalculation}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#F97316] text-white text-sm font-semibold hover:bg-orange-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate Estimate</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors focus:outline-none"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Reset Form</span>
              </button>
            </div>

            {estimateResult && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>Download Estimate (CSV)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#14213D] text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4 text-orange-400" />
                  <span>Print Formal Report</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Estimation Results Dashboard (Section 10) */}
        {estimateResult && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Step 3: Project Summary Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#14213D]">
                  Estimation Results Dashboard
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Calculated: {estimateResult.timestamp}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] text-slate-500 block">Structure</span>
                  <span className="text-sm font-bold text-slate-900">{estimateResult.inputs.structureType}</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] text-slate-500 block">Length</span>
                  <span className="text-sm font-semibold font-mono tabular-nums text-slate-900">
                    {estimateResult.inputs.length_m} m
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] text-slate-500 block">Width</span>
                  <span className="text-sm font-semibold font-mono tabular-nums text-slate-900">
                    {estimateResult.inputs.width_m} m
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] text-slate-500 block">Height</span>
                  <span className="text-sm font-semibold font-mono tabular-nums text-slate-900">
                    {estimateResult.inputs.height_m} m
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] text-slate-500 block">Thickness</span>
                  <span className="text-sm font-semibold font-mono tabular-nums text-slate-900">
                    {estimateResult.inputs.thickness_m} m
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] text-slate-500 block">Calculated Area</span>
                  <span className="text-sm font-bold font-mono tabular-nums text-slate-900">
                    {formatNumber(estimateResult.calculatedArea_m2, 2)} m²
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] text-slate-500 block">Calculated Volume</span>
                  <span className="text-sm font-bold font-mono tabular-nums text-slate-900">
                    {formatNumber(estimateResult.calculatedVolume_m3, 2)} m³
                  </span>
                </div>

                <div className="bg-orange-50 border border-orange-200 p-3.5 rounded-xl shadow-sm">
                  <span className="text-[11px] text-orange-700 block font-semibold">Total Estimated Cost</span>
                  <span className="text-sm font-extrabold font-mono tabular-nums text-[#F97316] truncate block" title={formatINR(estimateResult.totalEstimatedCost)}>
                    {formatINR(estimateResult.totalEstimatedCost, false)}
                  </span>
                </div>

              </div>
            </div>

            {/* Material Breakdown Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/70">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Material Breakdown Table</h4>
                  <p className="text-xs text-slate-500">
                    Estimated quantities based on {estimateResult.inputs.structureType} median consumption ratios and dataset unit prices.
                  </p>
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  All costs in Indian Rupees (INR ₹)
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#14213D] text-white text-xs">
                      <th className="py-3 px-6 font-semibold">Material</th>
                      <th className="py-3 px-6 font-semibold text-right">Estimated Quantity</th>
                      <th className="py-3 px-6 font-semibold">Unit</th>
                      <th className="py-3 px-6 font-semibold text-right">Representative Unit Price (₹)</th>
                      <th className="py-3 px-6 font-semibold text-right">Estimated Cost (₹)</th>
                      <th className="py-3 px-6 font-semibold text-right">Cost Share (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {estimateResult.items.map((item) => (
                      <tr key={item.material} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-6 font-semibold text-slate-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{item.material}</span>
                          {item.isFallbackRatio && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-normal">
                              Fallback Ratio
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-6 font-mono tabular-nums text-right font-medium text-slate-900">
                          {formatNumber(item.quantity, 2)}
                        </td>
                        <td className="py-3.5 px-6 text-slate-600 font-medium">{item.unit}</td>
                        <td className="py-3.5 px-6 font-mono tabular-nums text-right text-slate-700">
                          {formatNumber(item.unitPrice, 2)}
                        </td>
                        <td className="py-3.5 px-6 font-mono tabular-nums text-right font-bold text-slate-900">
                          {formatINR(item.cost, true)}
                        </td>
                        <td className="py-3.5 px-6 font-mono tabular-nums text-right text-slate-600">
                          {item.percentage.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-orange-50/80 border-t-2 border-slate-900">
                      <td colSpan={4} className="py-4 px-6 text-slate-900 font-bold uppercase tracking-wider text-xs">
                        Total Estimated Material Cost
                      </td>
                      <td className="py-4 px-6 text-right font-mono tabular-nums text-xl font-extrabold text-[#F97316]">
                        {formatINR(estimateResult.totalEstimatedCost, true)}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-xs font-bold text-slate-700">
                        100.0%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Cost Contribution Percentage Bar */}
              <div className="p-6 border-t border-slate-200 space-y-3 bg-slate-50/30">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Material Cost Contribution Breakdown</span>
                  <span className="text-slate-500 font-mono">Total: 100%</span>
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                  {estimateResult.items.map((item) => {
                    const colors: { [key: string]: string } = {
                      Bricks: 'bg-[#F97316]',
                      Cement: 'bg-[#3B82F6]',
                      Sand: 'bg-[#EAB308]',
                      Steel: 'bg-[#10B981]',
                    };
                    return (
                      <div
                        key={item.material}
                        style={{ width: `${item.percentage}%` }}
                        className={`${colors[item.material] || 'bg-slate-400'} h-full transition-all duration-500`}
                        title={`${item.material}: ${item.percentage.toFixed(1)}%`}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  {estimateResult.items.map((item) => (
                    <div key={item.material} className="flex items-center gap-1.5">
                      <span
                        className={`w-3 h-3 rounded-sm ${
                          item.material === 'Bricks'
                            ? 'bg-[#F97316]'
                            : item.material === 'Cement'
                            ? 'bg-[#3B82F6]'
                            : item.material === 'Sand'
                            ? 'bg-[#EAB308]'
                            : 'bg-[#10B981]'
                        }`}
                      />
                      <span className="text-slate-600 font-medium">
                        {item.material}: <strong className="text-slate-900 font-mono">{item.percentage.toFixed(1)}%</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Step 4: Interactive Estimate Charts (Section 11) */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#14213D]">
                Interactive Graphical Analysis for This Estimate
              </h3>
              <p className="text-xs text-slate-600">
                Visualizing cost shares, dimensional material requirements, and relative expenditures for the calculated structure.
              </p>
              <EstimatorCharts
                items={estimateResult.items}
                totalCost={estimateResult.totalEstimatedCost}
              />
            </div>

            {/* Estimation Disclaimer Callout */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-slate-800">Indicative Material Cost Estimate</span>
                <p className="text-slate-500 leading-relaxed">
                  All estimates are indicative and depend on the consumption patterns and material prices used for calculation. Actual construction requirements may differ based on structural design, engineering specifications, material wastage, construction methods, local prices, labor, transportation, taxes, and applicable standards. Verify estimates with a qualified construction professional before purchasing materials or beginning construction.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Print Report Modal */}
      <PrintReportModal
        estimate={estimateResult}
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
      />
    </section>
  );
};
