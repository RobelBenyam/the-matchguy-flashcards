import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Card, CardContent } from '../types';
import RichContentEditor from './RichContentEditor';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (front: string | CardContent, back: string | CardContent, difficulty: 'easy' | 'medium' | 'hard') => void;
  card?: Card | null;
}

export default function CardModal({ isOpen, onClose, onSubmit, card }: CardModalProps) {
  const [front, setFront] = useState<string | CardContent>('');
  const [back, setBack] = useState<string | CardContent>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  useEffect(() => {
    if (card && isOpen) {
      setFront(card.front);
      setBack(card.back);
      setDifficulty(card.difficulty);
    } else if (isOpen && !card) {
      setFront('');
      setBack('');
      setDifficulty('medium');
    }
  }, [card, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const frontValid = typeof front === 'string' ? front.trim() : (front.text?.trim() || front.images?.length || front.videos?.length || front.tables?.length || front.formulas?.length);
    const backValid = typeof back === 'string' ? back.trim() : (back.text?.trim() || back.images?.length || back.videos?.length || back.tables?.length || back.formulas?.length);
    
    if (frontValid && backValid) {
      onSubmit(front, back, difficulty);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {card ? 'Edit Card' : 'Create New Card'}
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
              Front (Question) *
            </label>
            <RichContentEditor
              value={front}
              onChange={setFront}
              placeholder="Enter the question or front of the card..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Back (Answer) *
            </label>
            <RichContentEditor
              value={back}
              onChange={setBack}
              placeholder="Enter the answer or back of the card..."
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Difficulty
            </label>
            <div className="flex items-center space-x-3">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    difficulty === diff
                      ? diff === 'easy'
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : diff === 'medium'
                      ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                      : 'bg-red-50 border-red-500 text-red-700'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
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
              disabled={!(typeof front === 'string' ? front.trim() : (front.text?.trim() || front.images?.length || front.videos?.length || front.tables?.length || front.formulas?.length)) || !(typeof back === 'string' ? back.trim() : (back.text?.trim() || back.images?.length || back.videos?.length || back.tables?.length || back.formulas?.length))}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {card ? 'Save Changes' : 'Create Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
