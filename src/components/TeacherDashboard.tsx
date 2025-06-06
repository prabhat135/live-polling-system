
import { useState, useEffect } from 'react';
import { usePollStore } from '../store/pollStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, LogOut, Users } from 'lucide-react';
import PollResults from './PollResults';
import ChatDrawer from './ChatDrawer';
import { useToast } from '@/hooks/use-toast';

const TeacherDashboard = () => {
  const { 
    currentUser, 
    currentPoll, 
    students, 
    logout, 
    createPoll, 
    removeStudent,
    pollHistory,
    canCreateNewPoll
  } = usePollStore();
  
  const [activeTab, setActiveTab] = useState('create');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);
  const [timeLimit, setTimeLimit] = useState(60);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();

  // Auto-switch to current poll tab when poll is active
  useEffect(() => {
    if (currentPoll && activeTab === 'create') {
      setActiveTab('current');
    }
  }, [currentPoll, activeTab]);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
      if (correctAnswerIndex === index) {
        setCorrectAnswerIndex(null);
      } else if (correctAnswerIndex !== null && correctAnswerIndex > index) {
        setCorrectAnswerIndex(correctAnswerIndex - 1);
      }
    }
  };

  const handleCreatePoll = () => {
    const validOptions = options.filter(opt => opt.trim());
    
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question.",
        variant: "destructive",
      });
      return;
    }
    
    if (validOptions.length < 2) {
      toast({
        title: "Error",
        description: "Please add at least 2 options.",
        variant: "destructive",
      });
      return;
    }
    
    if (correctAnswerIndex === null) {
      toast({
        title: "Error",
        description: "Please select the correct answer by clicking on a radio button.",
        variant: "destructive",
      });
      return;
    }

    if (!canCreateNewPoll()) {
      toast({
        title: "Cannot Create Poll",
        description: "Wait for all students to answer the current question before creating a new one.",
        variant: "destructive",
      });
      return;
    }

    const correctAnswerId = (correctAnswerIndex + 1).toString();
    createPoll(question.trim(), validOptions, timeLimit, correctAnswerId);
    setQuestion('');
    setOptions(['', '']);
    setCorrectAnswerIndex(null);
    setActiveTab('current');
    toast({
      title: "Poll Created",
      description: "Your poll has been sent to all students!",
    });
  };

  const handleKickStudent = (studentName: string) => {
    removeStudent(studentName);
    toast({
      title: "Student Removed",
      description: `${studentName} has been removed from the session.`,
    });
  };

  const tabs = [
    { id: 'create', label: 'Create Poll', icon: Plus },
    { id: 'current', label: 'Current Poll', disabled: !currentPoll },
    { id: 'history', label: 'Poll History' },
    { id: 'participants', label: 'Participants', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👥</span>
                <h1 className="text-3xl  font-bold">Intervue Poll</h1>
              </div>
              <h2 className="text-2xl font-semibold">Teacher Dashboard</h2>
              <p className="text-purple-100 mt-1">Create and manage polls, ask questions, and monitor responses in real-time</p>
            </div>
            <div className="text-right">
              <div className="text-purple-100 text-sm mb-1">Active Students</div>
              <div className="text-3xl font-bold">{students.length}</div>
              <Button
                variant="outline"
                onClick={logout}
                className="mt-3 text-[#4D0ACD] border-white hover:bg-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-2">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : tab.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'create' && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Create New Poll</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Enter your question</label>
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Which planet is known as the Red Planet?"
                  className="text-lg py-3"
                />
                <div className="text-right text-sm text-gray-500 mt-1">{question.length}/500</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium">Edit Options</label>
                  <div className="flex items-center gap-4">
                    <Select value={timeLimit.toString()} onValueChange={(value) => setTimeLimit(parseInt(value))}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30s</SelectItem>
                        <SelectItem value="60">60s</SelectItem>
                        <SelectItem value="90">90s</SelectItem>
                        <SelectItem value="120">120s</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {options.map((option, index) => (
                  <div key={index} className="flex gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      correctAnswerIndex === index ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {index + 1}
                    </div>
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Is it Correct?</span>
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={correctAnswerIndex === index}
                        onChange={() => setCorrectAnswerIndex(index)}
                        className="w-4 h-4 text-purple-600"
                      />
                    </div>
                    {options.length > 2 && (
                      <Button
                        variant="outline"
                        onClick={() => removeOption(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={addOption}
                  disabled={options.length >= 6}
                  className="flex items-center gap-2 text-[#4D0ACD] border-purple-200"
                >
                  <Plus className="w-4 h-4" />
                  Add More option
                </Button>
              </div>

              <Button
                onClick={handleCreatePoll}
                disabled={!canCreateNewPoll()}
                className="w-full bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] hover:bg-purple-700 py-4 text-lg font-medium rounded-xl"
              >
                Ask Question
              </Button>
              
              {!canCreateNewPoll() && (
                <p className="text-amber-600 text-sm text-center bg-amber-50 p-3 rounded-lg">
                  Wait for all students to answer the current question before creating a new poll.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'current' && currentPoll && (
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Current Question</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 text-white p-6 rounded-xl mb-6">
                  <h3 className="text-xl font-medium">{currentPoll.question}</h3>
                </div>
                
                <div className="space-y-4 mb-6">
                  {currentPoll.options.map((option, index) => (
                    <div key={option.id} className="flex items-center justify-between p-4 border rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          currentPoll.correctAnswerId === option.id ? 'bg-green-600 text-white' : 'bg-purple-100 text-purple-600'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium">{option.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center text-gray-600">
                  Waiting for students to submit their answers...
                </div>
              </CardContent>
            </Card>
            
            <PollResults />
          </div>
        )}

        {activeTab === 'history' && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">View Poll History</CardTitle>
            </CardHeader>
            <CardContent>
              {pollHistory.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">👁️</div>
                  <h3 className="text-xl font-bold mb-2">No Poll History</h3>
                  <p className="text-gray-500">Your past polls will appear here once you start creating them.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pollHistory.map((poll) => (
                    <div key={poll.id} className="border rounded-xl p-6">
                      <h4 className="font-bold text-lg mb-4">{poll.question}</h4>
                      <div className="space-y-3">
                        {poll.options.map((option) => (
                          <div key={option.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{option.text}</span>
                              {poll.correctAnswerId === option.id && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full font-medium">
                                  Correct
                                </span>
                              )}
                            </div>
                            <span className="font-bold">{option.votes} votes</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-4">
                        Total responses: {poll.responses.length}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'participants' && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Participants</CardTitle>
                <div className="text-right">
                  <div className="text-sm text-gray-500">👥 {students.length} active</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-bold mb-2">No Active Participants</h3>
                  <p className="text-gray-500">Students will appear here when they join your session.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-500 pb-2 border-b">
                    <div>Name</div>
                    <div>Action</div>
                  </div>
                  {students.map((student) => (
                    <div key={student.name} className="grid grid-cols-2 gap-4 items-center py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium text-sm">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">{student.name}</span>
                          {currentPoll && (
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              student.hasAnswered 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {student.hasAnswered ? 'Answered' : 'Pending'}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleKickStudent(student.name)}
                        className="text-red-600 hover:text-red-700 w-fit"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chat Button - Fixed at bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowChat(true)}
          className="bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] hover:bg-purple-700 text-white rounded-full p-4 shadow-lg"
          size="lg"
        >
          💬 Chat
        </Button>
      </div>

      {showChat && <ChatDrawer onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default TeacherDashboard;
