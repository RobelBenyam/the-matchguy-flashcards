# The Match Guy Flashcards

A modern, beautiful flashcard application inspired by Anki. Create decks, add cards, and study with an intuitive interface.

## Features

- 🎴 **Deck Management**: Create, edit, and delete flashcard decks
- 📝 **Card Management**: Add, edit, and delete cards with customizable difficulty levels
- 📚 **Study Mode**: Interactive card flipping with progress tracking
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- 💾 **Local Storage**: All data is saved locally in your browser

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide Icons
- Framer Motion

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── types.ts       # TypeScript type definitions
  ├── App.tsx        # Main app component with routing
  └── main.tsx       # Entry point
```

## Deployment

This app is configured for deployment on Vercel.

### Deploy to Vercel

1. Push your code to GitHub (already done ✅)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your repository: `RobelBenyam/the-matchguy-flashcards`
5. Vercel will auto-detect Vite settings
6. Click "Deploy"

The app will be live at a vercel.app URL, and all future pushes to main will auto-deploy.

## Next Steps

- [ ] Integrate Firebase for backend storage
- [ ] Add user authentication
- [ ] Implement spaced repetition algorithm
- [ ] Add statistics and progress tracking
- [ ] Export/import deck functionality
