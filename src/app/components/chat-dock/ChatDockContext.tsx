import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ChatWindow, ChatMessage, ChatParticipant, ChatWindowState } from './types';

interface ChatDockContextType {
  windows: ChatWindow[];
  openChat: (config: {
    id: string;
    type: 'direct' | 'group' | 'channel';
    title: string;
    participants: ChatParticipant[];
  }) => void;
  closeChat: (windowId: string) => void;
  minimizeChat: (windowId: string) => void;
  expandChat: (windowId: string) => void;
  toggleChatState: (windowId: string) => void;
  sendMessage: (windowId: string, content: string) => void;
  markAsRead: (windowId: string) => void;
}

const ChatDockContext = createContext<ChatDockContextType | undefined>(undefined);

const MAX_VISIBLE_WINDOWS = 4;

// Mock initial messages for demo
const getMockMessages = (chatId: string, participantName: string): ChatMessage[] => {
  return [
    {
      id: `msg-${chatId}-1`,
      senderId: 'other-user',
      senderName: participantName,
      content: 'Hey! How are you doing?',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      isCurrentUser: false
    },
    {
      id: `msg-${chatId}-2`,
      senderId: 'current-user',
      senderName: 'You',
      content: "I'm good! Working on the new features.",
      timestamp: new Date(Date.now() - 240000).toISOString(),
      isCurrentUser: true
    },
    {
      id: `msg-${chatId}-3`,
      senderId: 'other-user',
      senderName: participantName,
      content: 'That sounds great! Let me know if you need any help.',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      isCurrentUser: false
    }
  ];
};

export function ChatDockProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<ChatWindow[]>(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chatDockWindows');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  // Persist to localStorage whenever windows change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatDockWindows', JSON.stringify(windows));
    }
  }, [windows]);

  const openChat = useCallback((config: {
    id: string;
    type: 'direct' | 'group' | 'channel';
    title: string;
    participants: ChatParticipant[];
  }) => {
    setWindows(prev => {
      // Check if window already exists
      const existingIndex = prev.findIndex(w => w.id === config.id);
      
      if (existingIndex !== -1) {
        // Window exists - expand it and move to end (rightmost)
        const updated = [...prev];
        const existingWindow = { ...updated[existingIndex], state: 'expanded' as ChatWindowState };
        updated.splice(existingIndex, 1);
        updated.push(existingWindow);
        return updated;
      }
      
      // Create new window
      const newWindow: ChatWindow = {
        id: config.id,
        type: config.type,
        title: config.title,
        participants: config.participants,
        messages: getMockMessages(config.id, config.participants[0]?.name || config.title),
        state: 'expanded',
        unreadCount: 0,
        lastActivity: new Date().toISOString()
      };
      
      // Add to end (rightmost position)
      return [...prev, newWindow];
    });
  }, []);

  const closeChat = useCallback((windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
  }, []);

  const minimizeChat = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, state: 'minimized' as ChatWindowState } : w
    ));
  }, []);

  const expandChat = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, state: 'expanded' as ChatWindowState, unreadCount: 0 } : w
    ));
  }, []);

  const toggleChatState = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === windowId) {
        const newState = w.state === 'expanded' ? 'minimized' : 'expanded';
        return {
          ...w,
          state: newState as ChatWindowState,
          unreadCount: newState === 'expanded' ? 0 : w.unreadCount
        };
      }
      return w;
    }));
  }, []);

  const sendMessage = useCallback((windowId: string, content: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === windowId) {
        const newMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: 'current-user',
          senderName: 'You',
          content,
          timestamp: new Date().toISOString(),
          isCurrentUser: true
        };
        return {
          ...w,
          messages: [...w.messages, newMessage],
          lastActivity: new Date().toISOString()
        };
      }
      return w;
    }));
  }, []);

  const markAsRead = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, unreadCount: 0 } : w
    ));
  }, []);

  return (
    <ChatDockContext.Provider
      value={{
        windows,
        openChat,
        closeChat,
        minimizeChat,
        expandChat,
        toggleChatState,
        sendMessage,
        markAsRead
      }}
    >
      {children}
    </ChatDockContext.Provider>
  );
}

export function useChatDock() {
  const context = useContext(ChatDockContext);
  if (!context) {
    throw new Error('useChatDock must be used within ChatDockProvider');
  }
  return context;
}
