# StoryForge

StoryForge is a modern, AI-assisted story planning tool designed to help writers organize their ideas, maintain consistency, and develop complex narratives.

## Features

- **Project Management**: Organize multiple story projects with ease.
- **Story Bible**: Track characters, locations, items, and world-building rules.
- **Plot Outline**: Structure your story into acts, chapters, and scenes.
- **AI Workshop**: Brainstorm ideas and get feedback from an AI assistant (integration ready).
- **Export**: Generate summaries and export your project data to JSON.
- **Local First**: All data is stored locally in your browser for privacy and speed.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (with local storage persistence)
- **Routing**: React Router v7

## Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run Development Server**:

   ```bash
   npm run dev
   ```

3. **Build for Production**:

   ```bash
   npm run build
   ```

## Project Structure

- `src/components`: Reusable UI components (Layout, UI primitives).
- `src/features`: Feature-based modules (Story Bible, Plot, Settings, etc.).
- `src/pages`: Top-level page components.
- `src/state`: Global state management (Zustand store).
- `src/types`: TypeScript type definitions.
- `src/utils`: Helper functions.

## AI Integration

The AI features are currently designed to be modular. You can integrate a real AI backend by modifying `src/services/aiService.ts`. The current implementation uses a mock service or a placeholder for Google Generative AI.

## Data Persistence

StoryForge uses `localStorage` to persist your data.
**Warning**: Clearing your browser cache or using the "Reset All Data" button in Settings will permanently delete your projects.

## Roadmap

- [ ] Cloud Sync & Collaboration
- [ ] Advanced Timeline View
- [ ] Character Relationship Graph
- [ ] Rich Text Editor for Scene Writing
- [ ] PDF / Docx Export

## License

MIT
