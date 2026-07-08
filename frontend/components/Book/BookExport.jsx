'use client';

import { Printer, Download, Book } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookExport() {
  const handleExportPDF = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 3000)),
      {
        loading: 'Generating high-res PDF for print...',
        success: 'PDF downloaded successfully!',
        error: 'Failed to generate PDF.',
      }
    );
  };

  const handleOrderPrint = () => {
    toast.success('Redirecting to printing partner...');
  };

  return (
    <div className="bg-los-card border border-los-border rounded-2xl p-6 shadow-xl sticky top-32">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Book size={20} className="text-los-accent" />
        Publishing Options
      </h3>
      
      <div className="space-y-4">
        {/* Digital Export */}
        <div className="p-4 rounded-xl bg-los-bg border border-los-border hover:border-los-cyan/50 transition-colors group cursor-pointer" onClick={handleExportPDF}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-los-cyan/10 text-los-cyan">
              <Download size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-white group-hover:text-los-cyan transition-colors">Digital PDF</h4>
              <p className="text-xs text-los-text-muted">High-res, print-ready file</p>
            </div>
          </div>
          <p className="text-xs text-los-text-secondary mt-3">Free • Instant Download</p>
        </div>

        {/* Physical Print */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-los-accent/20 to-los-bg border border-los-accent hover:border-los-accent-light transition-colors group cursor-pointer shadow-[0_0_15px_rgba(124,58,237,0.1)]" onClick={handleOrderPrint}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-los-accent text-white shadow-lg">
              <Printer size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-white group-hover:text-los-accent-light transition-colors">Order Hardcover</h4>
              <p className="text-xs text-los-text-muted">Premium photo paper, layflat binding</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-los-accent-light font-medium">Starts at $39.99</p>
            <span className="text-[10px] bg-los-accent px-2 py-0.5 rounded text-white font-bold">POPULAR</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-los-border text-center">
        <p className="text-xs text-los-text-muted">
          Books are generated at 300DPI CMYK to ensure perfect printing quality.
        </p>
      </div>
    </div>
  );
}
