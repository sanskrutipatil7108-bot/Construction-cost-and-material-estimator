import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, HardHat, FileText } from 'lucide-react';
import { ProcessedDataset, processConstructionCSV } from './utils/dataProcessor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Estimator } from './components/Estimator';
import { Analytics } from './components/Analytics';
import { ProjectExplorer } from './components/ProjectExplorer';
import { ConstructionInsights } from './components/ConstructionInsights';
import { DataQualityPanel } from './components/DataQualityPanel';
import { About } from './components/About';
import { Footer } from './components/Footer';

export default function App() {
  const [dataset, setDataset] = useState<ProcessedDataset | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isCustomLoaded, setIsCustomLoaded] = useState<boolean>(false);

  // Load dataset on initial mount
  useEffect(() => {
    loadDefaultDataset();
  }, []);

  const loadDefaultDataset = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // First try standard public path
      const res = await fetch('/data/construction_data.csv');
      if (!res.ok) {
        throw new Error(`Failed to load CSV: ${res.status} ${res.statusText}`);
      }
      const csvText = await res.text();
      const processed = processConstructionCSV(csvText);
      setDataset(processed);
      setIsCustomLoaded(false);
    } catch (err: any) {
      console.error('Error loading default CSV dataset:', err);
      // Secondary fallback to original asset path if any
      try {
        const fallbackRes = await fetch('/assets/aistudio/construction_material_cost_dataset_300_records_c08282a2.csv');
        if (fallbackRes.ok) {
          const fallbackText = await fallbackRes.text();
          const processed = processConstructionCSV(fallbackText);
          setDataset(processed);
          setIsCustomLoaded(false);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        // Fallback failed as well
      }
      setErrorMessage(
        'Could not load the construction material cost dataset. Please ensure the CSV file is present at /data/construction_data.csv or upload your own CSV file below.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomCSVUpload = (csvText: string) => {
    try {
      const processed = processConstructionCSV(csvText);
      if (processed.rawRecords.length === 0) {
        alert('The uploaded file does not contain valid construction records. Please check the column headers.');
        return;
      }
      setDataset(processed);
      setIsCustomLoaded(true);
      setErrorMessage(null);
    } catch (err) {
      alert('Error parsing uploaded CSV file. Please ensure it follows the dataset schema.');
    }
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'estimator', 'analytics', 'projects', 'about'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FC] text-[#111827]">
      {/* Top Navbar */}
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-700">
              Loading Construction Material Cost Dataset (300 records)...
            </p>
          </div>
        )}

        {errorMessage && !isLoading && (
          <div className="max-w-3xl mx-auto my-16 p-6 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold">Failed to Load Dataset</h3>
                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={loadDefaultDataset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Loading</span>
              </button>
            </div>
          </div>
        )}

        {dataset && !isLoading && (
          <>
            {/* 1. Hero Section */}
            <Hero dataset={dataset} onNavigate={handleNavigate} />

            {/* 2. Construction Estimator */}
            <Estimator dataset={dataset} />

            {/* 3. Analytics Dashboard */}
            <Analytics dataset={dataset} />

            {/* 4. Projects Explorer Table */}
            <ProjectExplorer projects={dataset.projects} />

            {/* 5. Construction Insights */}
            <ConstructionInsights insights={dataset.insights} />

            {/* 6. Data Quality & Audit Panel */}
            <DataQualityPanel
              qualityReport={dataset.qualityReport}
              onCustomCSVUpload={handleCustomCSVUpload}
              onResetToDefaultDataset={loadDefaultDataset}
              isCustomLoaded={isCustomLoaded}
            />

            {/* 7. About Section */}
            <About />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
