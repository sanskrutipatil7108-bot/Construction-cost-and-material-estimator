import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { ProjectRecord, StructureType } from '../types/construction';
import { formatINR, formatNumber } from '../utils/dataProcessor';

interface ProjectExplorerProps {
  projects: ProjectRecord[];
}

type SortField = 'Project_ID' | 'Structure_Type' | 'Area_m2' | 'Volume_m3' | 'Total_Project_Cost_INR';
type SortDirection = 'asc' | 'desc';

export const ProjectExplorer: React.FC<ProjectExplorerProps> = ({ projects }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [structureFilter, setStructureFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('Project_ID');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let result = projects.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.Project_ID.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesStructure =
        structureFilter === 'All' || p.Structure_Type === structureFilter;
      return matchesSearch && matchesStructure;
    });

    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'Project_ID') {
        return sortDirection === 'asc'
          ? a.Project_ID.localeCompare(b.Project_ID, undefined, { numeric: true })
          : b.Project_ID.localeCompare(a.Project_ID, undefined, { numeric: true });
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [projects, searchQuery, structureFilter, sortField, sortDirection]);

  // Pagination slice
  const totalItems = filteredAndSortedProjects.length;
  const totalPages = pageSize === -1 ? 1 : Math.ceil(totalItems / pageSize);
  const startIndex = pageSize === -1 ? 0 : (currentPage - 1) * pageSize;
  const paginatedProjects =
    pageSize === -1
      ? filteredAndSortedProjects
      : filteredAndSortedProjects.slice(startIndex, startIndex + pageSize);

  const handleReset = () => {
    setSearchQuery('');
    setStructureFilter('All');
    setSortField('Project_ID');
    setSortDirection('asc');
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-orange-500" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-orange-500" />
    );
  };

  return (
    <section id="projects" className="py-16 bg-[#F7F8FC] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
              <span>Project Repository</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#14213D] tracking-tight">
              Projects Explorer
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Inspect all 75 unique construction projects recorded in the dataset. Search by ID, filter by archetype, sort by dimensions or cost, and drill down into original material schedules.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Showing <strong className="text-slate-900">{totalItems}</strong> of {projects.length} unique projects
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search Project ID (e.g. P001)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 font-mono placeholder:font-sans focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Structure Filter */}
            <div className="w-full sm:w-48">
              <select
                value={structureFilter}
                onChange={(e) => {
                  setStructureFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              >
                <option value="All">All Structure Types</option>
                <option value="Wall">Wall</option>
                <option value="Room">Room</option>
                <option value="House">House</option>
              </select>
            </div>

            {(searchQuery || structureFilter !== 'All') && (
              <button
                onClick={handleReset}
                className="text-xs text-orange-600 hover:underline font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-2 text-xs text-slate-600 shrink-0">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 text-xs rounded-md border border-slate-300 bg-white font-mono"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={-1}>All ({totalItems})</option>
            </select>
          </div>
        </div>

        {/* Responsive Table Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#14213D] text-white">
                  <th
                    onClick={() => handleSort('Project_ID')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Project ID</span>
                      {getSortIcon('Project_ID')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('Structure_Type')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Structure Type</span>
                      {getSortIcon('Structure_Type')}
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold text-right">Length (m)</th>
                  <th className="py-3 px-4 font-semibold text-right">Width (m)</th>
                  <th className="py-3 px-4 font-semibold text-right">Height (m)</th>
                  <th className="py-3 px-4 font-semibold text-right">Thickness (m)</th>
                  <th
                    onClick={() => handleSort('Area_m2')}
                    className="py-3 px-4 font-semibold text-right cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Area (m²)</span>
                      {getSortIcon('Area_m2')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('Volume_m3')}
                    className="py-3 px-4 font-semibold text-right cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Volume (m³)</span>
                      {getSortIcon('Volume_m3')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('Total_Project_Cost_INR')}
                    className="py-3 px-4 font-semibold text-right cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Total Project Cost (₹)</span>
                      {getSortIcon('Total_Project_Cost_INR')}
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold text-center">Material Breakdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedProjects.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-500">
                      No matching projects found. Try adjusting your search query or structure filter.
                    </td>
                  </tr>
                ) : (
                  paginatedProjects.map((p) => (
                    <tr
                      key={p.Project_ID}
                      className="hover:bg-orange-50/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedProject(p)}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {p.Project_ID}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            p.Structure_Type === 'House'
                              ? 'bg-pink-100 text-pink-800'
                              : p.Structure_Type === 'Room'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {p.Structure_Type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right text-slate-700">
                        {p.Length_m.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right text-slate-700">
                        {p.Width_m.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right text-slate-700">
                        {p.Height_m.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right text-slate-700">
                        {p.Thickness_m.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right font-medium text-slate-900">
                        {formatNumber(p.Area_m2, 2)}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right font-medium text-slate-900">
                        {formatNumber(p.Volume_m3, 2)}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right font-bold text-orange-600">
                        {formatINR(p.Total_Project_Cost_INR, true)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(p);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-[#14213D] hover:text-white text-slate-700 text-[11px] font-medium transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View (4)</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50 text-xs">
              <span className="text-slate-600">
                Page <strong className="text-slate-900">{currentPage}</strong> of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-2.5 py-1.5 rounded border border-slate-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pNum = currentPage - 2 + i;
                    if (pNum > totalPages) pNum = totalPages - (4 - i);
                  }
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`px-3 py-1.5 rounded font-mono font-medium ${
                        currentPage === pNum
                          ? 'bg-[#14213D] text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-2.5 py-1.5 rounded border border-slate-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Project Material Breakdown Modal (Section 14 requirement) */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
              
              <div className="bg-[#14213D] text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-mono">
                    Project {selectedProject.Project_ID} Breakdown
                  </h3>
                  <p className="text-xs text-slate-300">
                    {selectedProject.Structure_Type} · {selectedProject.Length_m}m × {selectedProject.Width_m}m × {selectedProject.Height_m}m
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-slate-300 hover:text-white p-1 rounded-md"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Metrics Summary */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block">Area</span>
                    <span className="font-bold text-slate-900">{selectedProject.Area_m2.toFixed(2)} m²</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Volume</span>
                    <span className="font-bold text-slate-900">{selectedProject.Volume_m3.toFixed(2)} m³</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Project Cost</span>
                    <span className="font-bold text-orange-600">{formatINR(selectedProject.Total_Project_Cost_INR, true)}</span>
                  </div>
                </div>

                {/* 4 Materials Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Actual Material Records in Dataset
                  </h4>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700">
                          <th className="py-2.5 px-3 font-semibold">Material</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Quantity</th>
                          <th className="py-2.5 px-3 font-semibold">Unit</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Unit Price (₹)</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Material Cost (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selectedProject.materials.map((m) => (
                          <tr key={m.Material} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{m.Material}</span>
                            </td>
                            <td className="py-2.5 px-3 font-mono tabular-nums text-right font-medium text-slate-800">
                              {formatNumber(m.Quantity, 2)}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 font-medium">{m.Unit}</td>
                            <td className="py-2.5 px-3 font-mono tabular-nums text-right text-slate-700">
                              {formatNumber(m.Unit_Price_INR, 2)}
                            </td>
                            <td className="py-2.5 px-3 font-mono tabular-nums text-right font-bold text-slate-900">
                              {formatINR(m.Material_Cost_INR, true)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-orange-50 font-bold border-t border-slate-300">
                          <td colSpan={4} className="py-2.5 px-3 text-slate-900 uppercase">
                            Sum of Materials
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-orange-600 text-sm">
                            {formatINR(selectedProject.Total_Project_Cost_INR, true)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#14213D] text-white hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
