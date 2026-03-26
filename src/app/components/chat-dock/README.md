# Global Floating Chat Dock System

## Overview
The Chat Dock is a persistent, floating chat interface that appears at the bottom-right of the screen across ALL pages in the application. It allows users to maintain multiple chat conversations simultaneously without losing their current context.

## Features

### ✅ Core Functionality
- **Multi-window support**: Open up to 4 chat windows side-by-side
- **Persistent across pages**: Chat windows stay open when navigating
- **Minimize/Expand**: Click header to toggle between collapsed and expanded states
- **localStorage persistence**: Chat state survives page refreshes
- **Real-time messaging**: Send and receive messages (mock data)
- **Status indicators**: See participant online/away/busy/offline status

### ✅ Window Management
- **Open chat**: Click message button anywhere to open a chat
- **Close chat**: X button to dismiss
- **Minimize**: Collapse to header only
- **Unread badges**: Shows unread count on minimized windows
- **Auto-scroll**: Messages scroll to bottom automatically

### ✅ Integration Points
- **Team Hub**: Message buttons on team member cards
- **Conversation List**: Click any conversation to open in dock
- **Global Access**: Use `useChatDock()` hook from any component

## Usage

### Opening a Chat from Any Component

```tsx
import { useChatDock } from '../../chat-dock';

function MyComponent() {
  const { openChat } = useChatDock();

  const handleMessageUser = () => {
    openChat({
      id: 'user-123',
      type: 'direct',
      title: 'Sarah Chen',
      participants: [
        { 
          id: 'user-123', 
          name: 'Sarah Chen',
          status: 'online'
        }
      ]
    });
  };

  return <button onClick={handleMessageUser}>Message Sarah</button>;
}
```

### Available Hook Methods

```tsx
const {
  windows,              // Array of open chat windows
  openChat,             // Open a new chat or focus existing
  closeChat,            // Close a specific chat
  minimizeChat,         // Minimize a specific chat
  expandChat,           // Expand a specific chat
  toggleChatState,      // Toggle minimize/expand
  sendMessage,          // Send a message to a chat
  markAsRead            // Clear unread count
} = useChatDock();
```

## Architecture

### File Structure
```
/src/app/components/chat-dock/
├── types.ts                 # TypeScript interfaces
├── ChatDockContext.tsx      # Global state management
├── ChatDock.tsx             # Main container (fixed bottom-right)
├── ChatWindow.tsx           # Individual chat window
└── index.ts                 # Exports
```

### State Management
- **Context API**: React Context for global state
- **localStorage**: Persists window state across sessions
- **Provider**: Wraps entire app in `App.tsx`

### Component Hierarchy
```
App.tsx
└── ChatDockProvider
    ├── AppContent (all pages)
    └── ChatDock (fixed position)
        └── ChatWindow[] (0-4 windows)
```

## Styling & Positioning

### CSS Classes
- `fixed bottom-0 right-4 z-50`: Dock positioning
- `w-80`: Chat window width (320px)
- `h-96`: Expanded message area height
- Tailwind CSS v4 for all styling

### Z-Index Strategy
- Chat Dock: `z-50`
- Ensures it floats above all page content
- Below modals (z-50 < modal z-index)

## Future Enhancements

### Phase 2 (Planned)
- [ ] Drag to reorder windows
- [ ] Video/audio call integration
- [ ] File attachments
- [ ] Emoji picker
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Push notifications
- [ ] Sound effects

### Phase 3 (Advanced)
- [ ] Group chat management
- [ ] Screen sharing
- [ ] Message search
- [ ] Chat history export
- [ ] Custom themes per chat
- [ ] Keyboard shortcuts

## Testing

### How to Test
1. Navigate to **Communication > Team Hub**
2. Click the message icon on any team member
3. Chat window opens at bottom-right
4. Send messages using the input field
5. Click header to minimize/expand
6. Open multiple chats (try 3-4)
7. Navigate to other pages (Finance, Work, etc.)
8. Verify chats persist across pages
9. Refresh page - chats should reload from localStorage
10. Close individual chats with X button

## Integration Guide

### Add Chat Button to Any Component

```tsx
import { useChatDock } from '../../chat-dock';
import { MessageSquare } from 'lucide-react';

function UserCard({ user }) {
  const { openChat } = useChatDock();

  return (
    <div>
      <h3>{user.name}</h3>
      <button 
        onClick={() => openChat({
          id: user.id,
          type: 'direct',
          title: user.name,
          participants: [user]
        })}
      >
        <MessageSquare className="h-4 w-4" />
        Message
      </button>
    </div>
  );
}
```

## Known Limitations
- Mock data only (no real backend integration)
- Maximum 4 windows (UI constraint)
- No mobile optimization yet
- No WebSocket/real-time connection

## Related Components
- `AC00TeamHub`: Primary integration point
- `EC01CommunicateHome`: Conversations page
- `App.tsx`: Provider wrapper
- `ToastProvider`: Notification system
