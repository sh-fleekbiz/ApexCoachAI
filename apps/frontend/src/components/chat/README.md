# Chat Enhancement Components

This directory contains React components for enhancing the chat interface with RAG (Retrieval Augmented Generation) visualization and user experience improvements.

## Components

### CitationsList

**File:** `CitationsList.tsx`

Displays source citations from RAG search results below AI responses.

**Features:**

- Beautiful card-based UI with hover effects
- Shows citation title, snippet, and metadata (page numbers, video timestamps)
- Displays source file names
- Handles empty citations gracefully
- Dark theme support
- Responsive design

**Props:**

```typescript
interface CitationsListProps {
  citations: Citation[];
}
```

### PersonalityIndicator

**File:** `PersonalityIndicator.tsx`

Shows the currently active coaching personality and its description.

**Features:**

- Displays personality name as a badge
- Expandable to show full personality description
- Integrates with PersonalityContext
- Smooth animations
- Dark theme support
- Responsive design

**Props:** None (uses PersonalityContext)

### RAGVisualizer

**File:** `RAGVisualizer.tsx`

Animated visualizer that shows RAG process stages during AI response generation.

**Features:**

- Three-stage animation: Searching → Found sources → Generating
- Shows number of sources found
- Pulse animation and progress bar
- Auto-dismisses after completion
- Fixed position (bottom-right)
- Dark theme support
- Responsive design

**Props:**

```typescript
interface RAGVisualizerProps {
  isActive: boolean;
  sourcesCount?: number;
}
```

## Integration

These components are integrated into `pages/chat/Chat.tsx`:

1. **CitationsList** - Renders below the chat when citations are available
2. **PersonalityIndicator** - Shows below the chat input area
3. **RAGVisualizer** - Fixed overlay during AI response generation

### Event Handling

The Chat component listens for custom events to trigger visualizations:

- `chat-message-start` - Activates RAG visualizer
- `chat-message-update` - Updates sources count and citations
- `chat-message-complete` - Deactivates visualizer, stores final citations

## Styling

Each component has a corresponding `.module.css` file with:

- Light and dark theme support
- Responsive breakpoints
- Smooth animations and transitions
- Accessibility considerations

## Usage Example

```tsx
import { CitationsList, PersonalityIndicator, RAGVisualizer } from '../../components/chat';

// In your component
<CitationsList citations={citations} />
<PersonalityIndicator />
<RAGVisualizer isActive={isProcessing} sourcesCount={5} />
```
