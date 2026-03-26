import { useChatDock } from './ChatDockContext';
import { ChatWindow } from './ChatWindow';

export function ChatDock() {
  const { windows } = useChatDock();

  if (windows.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-4 z-50 flex items-end gap-2 pointer-events-none">
      <div className="flex items-end gap-2 pointer-events-auto">
        {windows.map(window => (
          <ChatWindow key={window.id} window={window} />
        ))}
      </div>
    </div>
  );
}
