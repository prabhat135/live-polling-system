
import { useState, useRef, useEffect } from 'react';
import { usePollStore } from '../store/pollStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatDrawerProps {
  onClose: () => void;
}

const ChatDrawer = ({ onClose }: ChatDrawerProps) => {
  const { currentUser, chatMessages, addChatMessage, students, removeStudent } = usePollStore();
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const handleKickStudent = (studentName: string) => {
    removeStudent(studentName);
    toast({
      title: "Student Removed",
      description: `${studentName} has been removed from the session.`,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="w-96 bg-white h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-purple-600 text-white">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">💬</span>
              <h3 className="font-semibold text-lg">Chat</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-purple-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1 bg-purple-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-purple-600'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'participants'
                  ? 'bg-white text-purple-600'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Participants ({students.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'chat' ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
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
                    <div className={`p-3 rounded-lg max-w-[80%] ${
                      msg.sender === currentUser?.name
                        ? 'bg-purple-500 text-white ml-auto'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
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
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            {students.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <div className="text-4xl mb-2">👥</div>
                <p className="text-sm">No participants yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {students.map((student) => (
                  <div key={student.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium text-sm">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">{student.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            student.hasAnswered 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {student.hasAnswered ? 'Answered' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {currentUser?.role === 'teacher' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleKickStudent(student.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDrawer;
