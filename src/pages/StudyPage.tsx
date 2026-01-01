import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, ThumbsUp, ThumbsDown, X, CheckCircle } from 'lucide-react';
import { Card, Deck } from '../types';
import RichContentRenderer from '../components/RichContentRenderer';

export default function StudyPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCount, setStudiedCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (deckId) {
      const decks = JSON.parse(localStorage.getItem('decks') || '[]');
      const foundDeck = decks.find((d: Deck) => d.id === deckId);
      if (foundDeck) {
        setDeck(foundDeck);
        const deckCards = JSON.parse(localStorage.getItem(`deck-${deckId}-cards`) || '[]');
        if (deckCards.length === 0) {
          navigate(`/deck/${deckId}`);
          return;
        }
        setCards([...deckCards].sort(() => Math.random() - 0.5));
      }
    }
  }, [deckId, navigate]);

  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;
  const isComplete = studiedCount === cards.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setStudiedCount(studiedCount + 1);
    }
  };

  const handleReview = (remembered: boolean) => {
    if (!deckId || !currentCard) return;
    
    const updatedCard = {
      ...currentCard,
      lastReviewed: Date.now(),
      difficulty: remembered ? 'easy' : currentCard.difficulty === 'easy' ? 'medium' : 'hard',
    };
    
    const deckCards = JSON.parse(localStorage.getItem(`deck-${deckId}-cards`) || '[]');
    const updatedCards = deckCards.map((c: Card) => (c.id === currentCard.id ? updatedCard : c));
    localStorage.setItem(`deck-${deckId}-cards`, JSON.stringify(updatedCards));
    
    handleNext();
  };

  const handleRestart = () => {
    if (deckId) {
      const deckCards = JSON.parse(localStorage.getItem(`deck-${deckId}-cards`) || '[]');
      setCards([...deckCards].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
      setIsFlipped(false);
      setStudiedCount(0);
    }
  };

  if (!deck || !currentCard) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={`/deck/${deckId}`}
          className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Deck</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Study Session Complete!</h2>
          <p className="text-slate-600 mb-8">You've reviewed all {cards.length} cards.</p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleRestart}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-colors shadow-lg shadow-orange-500/50"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="font-semibold">Restart Session</span>
            </button>
            <Link
              to={`/deck/${deckId}`}
              className="flex items-center space-x-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold"
            >
              <span>Back to Deck</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to={`/deck/${deckId}`}
        className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Deck</span>
      </Link>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-900">{deck.name}</h1>
          <span className="text-sm text-slate-600">
            {studiedCount + 1} / {cards.length}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className={`bg-gradient-to-r ${deck.color} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${((studiedCount + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative">
        <div
          className={`card-flip ${isFlipped ? 'flipped' : ''} cursor-pointer`}
          onClick={handleFlip}
        >
          <div className="card-face bg-white rounded-2xl shadow-xl p-12 flex flex-col justify-center items-center border-2 border-slate-200 hover:border-orange-300 transition-colors overflow-y-auto">
            <div className="text-sm font-semibold text-slate-500 uppercase mb-4">Question</div>
            <div className="text-2xl font-medium text-slate-900 text-center w-full">
              <RichContentRenderer content={currentCard.front} className="text-center" />
            </div>
            <div className="mt-8 text-sm text-slate-500">Click to reveal answer</div>
          </div>
          <div className={`card-face card-face-back bg-gradient-to-br ${deck.color} rounded-2xl shadow-xl p-12 flex flex-col justify-center items-center text-white overflow-y-auto`}>
            <div className="text-sm font-semibold text-white/80 uppercase mb-4">Answer</div>
            <div className="text-2xl font-medium text-white text-center w-full">
              <RichContentRenderer content={currentCard.back} className="text-center text-white" />
            </div>
            <div className="mt-8 text-sm text-white/80">Click to see question</div>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="mt-8 flex items-center justify-center space-x-3">
          <button
            onClick={() => handleReview(false)}
            className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-red-300 hover:text-red-600 transition-all font-medium shadow-sm"
          >
            <ThumbsDown className="w-4 h-4" />
            <span>Forgot</span>
          </button>
          <button
            onClick={() => handleReview(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-green-300 hover:text-green-600 transition-all font-medium shadow-sm"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Remembered</span>
          </button>
        </div>
      )}

      <div className="mt-6 flex items-center justify-center">
        <button
          onClick={handleRestart}
          className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm font-medium">Restart Session</span>
        </button>
      </div>
    </div>
  );
}
