import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Play, ArrowLeft, Trash2, Edit2, RotateCcw } from 'lucide-react';
import { Card, Deck, CardContent } from '../types';
import CardModal from '../components/CardModal';
import RichContentRenderer from '../components/RichContentRenderer';

export default function DeckDetailPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  useEffect(() => {
    if (deckId) {
      const decks = JSON.parse(localStorage.getItem('decks') || '[]');
      const foundDeck = decks.find((d: Deck) => d.id === deckId);
      if (foundDeck) {
        setDeck(foundDeck);
        const deckCards = JSON.parse(localStorage.getItem(`deck-${deckId}-cards`) || '[]');
        setCards(deckCards);
        
        const updatedDeck = { ...foundDeck, cardCount: deckCards.length };
        setDeck(updatedDeck);
        const updatedDecks = decks.map((d: Deck) => (d.id === deckId ? updatedDeck : d));
        localStorage.setItem('decks', JSON.stringify(updatedDecks));
      }
    }
  }, [deckId]);

  const handleCreateCard = (front: string | CardContent, back: string | CardContent, difficulty: 'easy' | 'medium' | 'hard') => {
    if (!deckId) return;
    const newCard: Card = {
      id: Date.now().toString(),
      front,
      back,
      createdAt: Date.now(),
      difficulty,
    };
    const updated = [newCard, ...cards];
    setCards(updated);
    localStorage.setItem(`deck-${deckId}-cards`, JSON.stringify(updated));
    
    if (deck) {
      const updatedDeck = { ...deck, cardCount: updated.length };
      setDeck(updatedDeck);
      const decks = JSON.parse(localStorage.getItem('decks') || '[]');
      const updatedDecks = decks.map((d: Deck) => (d.id === deckId ? updatedDeck : d));
      localStorage.setItem('decks', JSON.stringify(updatedDecks));
    }
    
    setIsCardModalOpen(false);
  };

  const handleEditCard = (front: string | CardContent, back: string | CardContent, difficulty: 'easy' | 'medium' | 'hard') => {
    if (!deckId || !editingCard) return;
    const updated = cards.map(c =>
      c.id === editingCard.id ? { ...c, front, back, difficulty } : c
    );
    setCards(updated);
    localStorage.setItem(`deck-${deckId}-cards`, JSON.stringify(updated));
    setEditingCard(null);
  };

  const handleDeleteCard = (id: string) => {
    if (!deckId) return;
    if (window.confirm('Are you sure you want to delete this card?')) {
      const updated = cards.filter(c => c.id !== id);
      setCards(updated);
      localStorage.setItem(`deck-${deckId}-cards`, JSON.stringify(updated));
      
      if (deck) {
        const updatedDeck = { ...deck, cardCount: updated.length };
        setDeck(updatedDeck);
        const decks = JSON.parse(localStorage.getItem('decks') || '[]');
        const updatedDecks = decks.map((d: Deck) => (d.id === deckId ? updatedDeck : d));
        localStorage.setItem('decks', JSON.stringify(updatedDecks));
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  if (!deck) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <p className="text-slate-600">Deck not found</p>
          <Link to="/" className="text-orange-600 hover:text-orange-700 mt-4 inline-block">
            Go back to decks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Decks</span>
      </Link>

      <div className={`bg-gradient-to-br ${deck.color} rounded-2xl p-8 mb-8 shadow-lg`}>
        <h1 className="text-4xl font-bold text-white mb-2">{deck.name}</h1>
        {deck.description && (
          <p className="text-white/90 text-lg mb-4">{deck.description}</p>
        )}
        <div className="flex items-center space-x-6 text-white/90">
          <span className="font-medium">{deck.cardCount} {deck.cardCount === 1 ? 'card' : 'cards'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Cards</h2>
        <div className="flex items-center space-x-3">
          {cards.length > 0 && (
            <Link
              to={`/deck/${deckId}/study`}
              className="flex items-center space-x-2 px-5 py-2.5 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all font-medium shadow-sm"
            >
              <Play className="w-4 h-4" />
              <span>Study</span>
            </Link>
          )}
          <button
            onClick={() => {
              setEditingCard(null);
              setIsCardModalOpen(true);
            }}
            className="flex items-center space-x-2 px-5 py-2.5 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-300">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
            <Plus className="w-12 h-12 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No cards yet</h3>
          <p className="text-slate-600 mb-6">Add your first flashcard to get started!</p>
          <button
            onClick={() => setIsCardModalOpen(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Add Card</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 group overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${deck.color} w-full`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <span className={`px-3 py-1.5 text-xs font-bold rounded-full border-2 ${getDifficultyColor(card.difficulty)}`}>
                    {card.difficulty.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingCard(card)}
                      className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Front</div>
                    <div className="text-slate-900 font-medium text-base leading-relaxed">
                      <RichContentRenderer content={card.front} />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Back</div>
                    <div className="text-slate-800 font-medium text-base leading-relaxed">
                      <RichContentRenderer content={card.back} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CardModal
        isOpen={isCardModalOpen || editingCard !== null}
        onClose={() => {
          setIsCardModalOpen(false);
          setEditingCard(null);
        }}
        onSubmit={editingCard ? handleEditCard : handleCreateCard}
        card={editingCard}
      />
    </div>
  );
}
