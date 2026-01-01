import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Deck } from '../types';

interface DeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string, color?: string) => void;
  deck?: Deck | null;
}

const colorOptions = [
  { name: 'Blue', value: 'from-blue-500 to-blue-600' },
  { name: 'Purple', value: 'from-purple-500 to-purple-600' },
  { name: 'Pink', value: 'from-pink-500 to-pink-600' },
  { name: 'Green', value: 'from-green-500 to-green-600' },
  { name: 'Orange', value: 'from-orange-500 to-orange-600' },
  { name: 'Teal', value: 'from-teal-500 to-teal-600' },
  { name: 'Red', value: 'from-red-500 to-red-600' },
  { name: 'Indigo', value: 'from-indigo-500 to-indigo-600' },
  { name: 'Amber', value: 'from-amber-500 to-amber-600' },
  { name: 'Rose', value: 'from-rose-500 to-rose-600' },
  { name: 'Cyan', value: 'from-cyan-500 to-cyan-600' },
  { name: 'Violet', value: 'from-violet-500 to-violet-600' },
];

export default function DeckModal({ isOpen, onClose, onSubmit, deck }: DeckModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('from-orange-500 to-red-600');

  useEffect(() => {
    if (deck) {
      setName(deck.name);
      setDescription(deck.description || '');
      setSelectedColor(deck.color || 'from-orange-500 to-red-600');
    } else {
      setName('');
      setDescription('');
      setSelectedColor('from-orange-500 to-red-600');
    }
  }, [deck, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), description.trim() || undefined, selectedColor);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {deck ? 'Edit Deck' : 'Create New Deck'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Deck Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., Spanish Vocabulary"
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
              rows={3}
              placeholder="Add a description for this deck..."
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Deck Color
            </label>
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`relative h-10 w-full rounded-lg bg-gradient-to-br ${color.value} hover:scale-110 transition-transform shadow-md ${
                    selectedColor === color.value ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                  }`}
                  title={color.name}
                >
                  {selectedColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white drop-shadow-lg" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">Choose a color for your deck</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {deck ? 'Save Changes' : 'Create Deck'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
