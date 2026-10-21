import React from 'react';
import { Calculator } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'estimator', label: 'Estimator' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'projects', label: 'Projects' },
    { id: 'about', label: 'About' },
  ];

  return (
    <footer className="bg-[#14213D] text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#F97316] flex items-center justify-center text-white">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Construct<span className="text-[#F97316]">X</span>
              </span>
            </div>
            <p className="text-xs text-orange-400 font-semibold tracking-wide">
              Build Smarter. Estimate Better.
            </p>
            <p className="text-xs text-slate-400 pt-1">
              Construction Material Quantity & Cost Estimation
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-300">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ConstructX. All rights reserved.</p>
          <p className="text-slate-500">
            Data-Driven Construction Engineering Platform
          </p>
        </div>
      </div>
    </footer>
  );
};
