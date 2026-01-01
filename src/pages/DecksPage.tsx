import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Layers, Hash, Trash2, Play, Edit2 } from 'lucide-react';
import { Deck } from '../types';
import DeckModal from '../components/DeckModal';

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>(() => {
    const saved = localStorage.getItem('decks');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);

  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-teal-500 to-teal-600',
    'from-red-500 to-red-600',
    'from-indigo-500 to-indigo-600',
  ];

  const handleCreateDeck = (name: string, description?: string, color?: string) => {
    const newDeck: Deck = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: Date.now(),
      cardCount: 0,
      color: color || colors[Math.floor(Math.random() * colors.length)],
    };
    const updated = [newDeck, ...decks];
    setDecks(updated);
    localStorage.setItem('decks', JSON.stringify(updated));
    setIsModalOpen(false);
  };

  const handleEditDeck = (name: string, description?: string, color?: string) => {
    if (!editingDeck) return;
    const updated = decks.map(d =>
      d.id === editingDeck.id ? { ...d, name, description, color: color || d.color } : d
    );
    setDecks(updated);
    localStorage.setItem('decks', JSON.stringify(updated));
    setEditingDeck(null);
  };

  const handleDeleteDeck = (id: string) => {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      const updated = decks.filter(d => d.id !== id);
      setDecks(updated);
      localStorage.setItem('decks', JSON.stringify(updated));
      const cards = JSON.parse(localStorage.getItem(`deck-${id}-cards`) || '[]');
      if (cards.length > 0) {
        localStorage.removeItem(`deck-${id}-cards`);
      }
    }
  };

  const openEditModal = (deck: Deck) => {
    setEditingDeck(deck);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Decks</h1>
          <p className="text-slate-600 mt-2">Create and organize your flashcard decks</p>
        </div>
        <button
          onClick={() => {
            setEditingDeck(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-colors shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">New Deck</span>
        </button>
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
            <Layers className="w-12 h-12 text-orange-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">No decks yet</h2>
          <p className="text-slate-600 mb-6">Create your first deck to get started!</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-colors shadow-lg shadow-orange-500/50"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Create Deck</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 group"
            >
              <Link to={`/deck/${deck.id}`} className="block">
                <div className={`h-32 bg-gradient-to-br ${deck.color} relative`}>
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                </div>
              </Link>
              <div className="p-6">
                <Link to={`/deck/${deck.id}`}>
                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">
                    {deck.name}
                  </h3>
                </Link>
                {deck.description && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{deck.description}</p>
                )}
                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <Hash className="w-4 h-4 mr-1" />
                  <span>{deck.cardCount} {deck.cardCount === 1 ? 'card' : 'cards'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/deck/${deck.id}/study`}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all text-sm font-medium"
                    onClick={(e) => {
                      if (deck.cardCount === 0) {
                        e.preventDefault();
                        alert('Add some cards to this deck before studying!');
                      }
                    }}
                  >
                    <Play className="w-4 h-4" />
                    <span>Study</span>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openEditModal(deck);
                    }}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteDeck(deck.id);
                    }}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeckModal
        isOpen={isModalOpen || editingDeck !== null}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDeck(null);
        }}
        onSubmit={editingDeck ? handleEditDeck : handleCreateDeck}
        deck={editingDeck}
      />
    </div>
  );
}
