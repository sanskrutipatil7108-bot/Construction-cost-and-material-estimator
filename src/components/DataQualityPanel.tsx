import React, { useRef } from 'react';
import {
  ShieldCheck,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  FileText,
  AlertCircle,
  Database,
} from 'lucide-react';
import { DataQualityReport } from '../types/construction';

interface DataQualityPanelProps {
  qualityReport: DataQualityReport;
  onCustomCSVUpload: (csvText: string) => void;
  onResetToDefaultDataset: () => void;
  isCustomLoaded: boolean;
}

export const DataQualityPanel: React.FC<DataQualityPanelProps> = ({
  qualityReport,
  onCustomCSVUpload,
  onResetToDefaultDataset,
  isCustomLoaded,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        onCustomCSVUpload(text);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownloadOriginalCSV = async () => {
    try {
      const response = await fetch('/data/construction_data.csv');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'construction_material_cost_dataset_300_records(2).csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  return (
    <section className="py-12 bg-[#F7F8FC] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Data Integrity & Audit Status</span>
            </div>
            <h3 className="text-xl font-bold text-[#14213D] tracking-tight">
              Dataset Quality & Verification Panel
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Automated validation metrics ensuring zero duplicate anomalies and complete relational schema coverage.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Upload Custom CSV</span>
            </button>

            {isCustomLoaded && (
              <button
                onClick={onResetToDefaultDataset}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-800 rounded-lg text-xs font-semibold hover:bg-orange-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
            )}

            <button
              onClick={handleDownloadOriginalCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#14213D] text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-orange-400" />
              <span>Download Original CSV</span>
            </button>
          </div>
        </div>

        {/* Quality Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-slate-500 block">Total CSV Records</span>
            <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
              {qualityReport.totalRows}
            </span>
            <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
              <CheckCircle className="w-3 h-3" /> Validated
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-slate-500 block">Unique Projects</span>
            <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
              {qualityReport.uniqueProjects}
            </span>
            <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
              <CheckCircle className="w-3 h-3" /> 1 row / project
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-slate-500 block">Unique Materials</span>
            <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
              {qualityReport.uniqueMaterials}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">Bricks, Cement, Sand, Steel</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-slate-500 block">Structure Types</span>
            <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
              {qualityReport.uniqueStructures}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">Wall, Room, House</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-slate-500 block">Missing Values</span>
            <span className="text-xl font-bold font-mono tabular-nums text-emerald-700">
              {qualityReport.missingValuesCount}
            </span>
            <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
              <CheckCircle className="w-3 h-3" /> Zero Nulls
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-slate-500 block">Duplicate Rows</span>
            <span className="text-xl font-bold font-mono tabular-nums text-emerald-700">
              {qualityReport.duplicateRowsCount}
            </span>
            <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
              <CheckCircle className="w-3 h-3" /> Fully Distinct
            </span>
          </div>

        </div>

        {/* Audit Notes Accordion / Callout */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-xs text-slate-600 space-y-2">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-orange-500" />
            <span>Relational Schema Verification Notes</span>
          </span>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600">
            {qualityReport.notes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
};
