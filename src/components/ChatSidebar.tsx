
import { useState, useRef, useEffect } from 'react';
import { usePollStore } from '../store/pollStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, X } from 'lucide-react';

const ChatSidebar = () => {
  const { currentUser, chatMessages, addChatMessage } = usePollStore();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && currentUser) {
      addChatMessage(message.trim(), currentUser.role === 'teacher');
      setMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Chat</h3>
          <span className="text-sm text-gray-500">Participants</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <p className="text-gray-500 text-center text-sm">No messages yet</p>
        ) : (
          chatMessages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${
                  msg.isTeacher ? 'text-purple-600' : 'text-blue-600'
                }`}>
                  {msg.sender}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <div className={`p-3 rounded-lg ${
                msg.sender === currentUser?.name
                  ? 'bg-purple-100 ml-4'
                  : 'bg-gray-100 mr-4'
              }`}>
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!message.trim()}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatSidebar;
