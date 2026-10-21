import React, { useState } from 'react';
import { Menu, X, Calculator, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'estimator', label: 'Estimator' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'projects', label: 'Projects' },
    { id: 'about', label: 'About' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#14213D] text-white border-b border-slate-700/60 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleLinkClick('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#F97316] flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Calculator className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
                  Construct<span className="text-[#F97316]">X</span>
                </span>
                <span className="text-[10px] text-slate-300 font-medium tracking-wider uppercase -mt-0.5">
                  Cost Estimator
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 5 Concise Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`whitespace-nowrap transition-colors duration-150 py-1 border-b-2 ${
                    isActive
                      ? 'text-[#F97316] border-[#F97316] font-semibold'
                      : 'text-slate-300 hover:text-white border-transparent'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleLinkClick('estimator')}
              className="inline-flex items-center gap-2 px-4.5 py-2 text-sm font-semibold text-white bg-[#F97316] rounded-lg hover:bg-orange-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 whitespace-nowrap"
            >
              <span>Start Estimating</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-700/80 bg-[#14213D] px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#F97316] text-white'
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleLinkClick('estimator')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#F97316] rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
            >
              <span>Start Estimating</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
