import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

interface TableEditorProps {
  onInsert: (rows: number, cols: number) => void;
  onClose: () => void;
}

export default function TableEditor({ onInsert, onClose }: TableEditorProps) {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);

  const handleInsert = () => {
    if (rows > 0 && cols > 0) {
      onInsert(rows, cols);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Insert Table</h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rows</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setRows(Math.max(1, rows - 1))}
                  className="p-2 border border-slate-300 rounded hover:bg-slate-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={rows}
                  onChange={(e) => setRows(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="w-20 px-3 py-2 border border-slate-300 rounded text-center"
                />
                <button
                  type="button"
                  onClick={() => setRows(Math.min(20, rows + 1))}
                  className="p-2 border border-slate-300 rounded hover:bg-slate-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Columns</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setCols(Math.max(1, cols - 1))}
                  className="p-2 border border-slate-300 rounded hover:bg-slate-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={cols}
                  onChange={(e) => setCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  className="w-20 px-3 py-2 border border-slate-300 rounded text-center"
                />
                <button
                  type="button"
                  onClick={() => setCols(Math.min(10, cols + 1))}
                  className="p-2 border border-slate-300 rounded hover:bg-slate-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">Preview:</p>
            <div className="overflow-x-auto">
              <table className="border-collapse border border-slate-300 text-xs">
                <tbody>
                  {Array.from({ length: Math.min(rows, 3) }).map((_, r) => (
                    <tr key={r}>
                      {Array.from({ length: cols }).map((_, c) => (
                        <td
                          key={c}
                          className="border border-slate-300 px-2 py-1 min-w-[40px] h-8 bg-white"
                        >
                          {r === 0 ? 'H' : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {rows > 3 && (
                    <tr>
                      <td colSpan={cols} className="text-center text-slate-400 py-1">
                        ...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleInsert}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-colors"
            >
              Insert Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
