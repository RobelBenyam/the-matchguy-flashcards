import { useState } from 'react';
import { X } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface FormulaEditorProps {
  onInsert: (formula: string) => void;
  onClose: () => void;
}

export default function FormulaEditor({ onInsert, onClose }: FormulaEditorProps) {
  const [latex, setLatex] = useState('');
  const [error, setError] = useState('');

  const symbols = [
    { label: 'x²', latex: 'x^2' },
    { label: 'x₁', latex: 'x_1' },
    { label: 'x/y', latex: '\\frac{x}{y}' },
    { label: '√x', latex: '\\sqrt{x}' },
    { label: '∫', latex: '\\int' },
    { label: 'Σ', latex: '\\sum' },
    { label: '±', latex: '\\pm' },
    { label: '≈', latex: '\\approx' },
    { label: '≠', latex: '\\neq' },
    { label: '≤', latex: '\\leq' },
    { label: '≥', latex: '\\geq' },
    { label: '→', latex: '\\rightarrow' },
  ];

  const greek = [
    { label: 'α', latex: '\\alpha' },
    { label: 'β', latex: '\\beta' },
    { label: 'γ', latex: '\\gamma' },
    { label: 'δ', latex: '\\delta' },
    { label: 'Δ', latex: '\\Delta' },
    { label: 'θ', latex: '\\theta' },
    { label: 'λ', latex: '\\lambda' },
    { label: 'μ', latex: '\\mu' },
    { label: 'π', latex: '\\pi' },
    { label: 'Σ', latex: '\\Sigma' },
    { label: 'Φ', latex: '\\Phi' },
    { label: 'Ω', latex: '\\Omega' },
  ];

  const templates = [
    { label: 'H₂O', latex: 'H_2O' },
    { label: 'CO₂', latex: 'CO_2' },
    { label: 'ΔH', latex: '\\Delta H' },
    { label: 'ΔG', latex: '\\Delta G' },
  ];

  const insertSymbol = (symbolLatex: string) => {
    setLatex(prev => prev + symbolLatex);
  };

  const handleInsert = () => {
    if (latex.trim()) {
      try {
        onInsert(latex.trim());
        setLatex('');
        setError('');
      } catch (e) {
        setError('Invalid formula');
      }
    }
  };

  const renderPreview = () => {
    if (!latex.trim()) return null;
    try {
      return <BlockMath math={latex} />;
    } catch {
      return <div className="text-red-500 text-sm">Invalid formula</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-800 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-xl font-bold">Formula Editor</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              LaTeX Input:
            </label>
            <input
              type="text"
              value={latex}
              onChange={(e) => {
                setLatex(e.target.value);
                setError('');
              }}
              placeholder="Enter LaTeX or click buttons below"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 min-h-[100px] flex items-center justify-center">
            {renderPreview() || <p className="text-slate-400">Preview will appear here</p>}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Common Symbols:</h3>
            <div className="flex flex-wrap gap-2">
              {symbols.map((sym, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => insertSymbol(sym.latex)}
                  className="px-3 py-2 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors text-sm"
                >
                  {sym.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Greek Letters:</h3>
            <div className="flex flex-wrap gap-2">
              {greek.map((letter, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => insertSymbol(letter.latex)}
                  className="px-3 py-2 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors text-sm"
                >
                  {letter.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Quick Templates:</h3>
            <div className="flex flex-wrap gap-2">
              {templates.map((tmpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => insertSymbol(tmpl.latex)}
                  className="px-3 py-2 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors text-sm"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setLatex('');
                setError('');
              }}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleInsert}
              disabled={!latex.trim()}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Insert Formula
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
