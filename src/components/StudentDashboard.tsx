
import { useState, useEffect } from 'react';
import { usePollStore } from '../store/pollStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Clock } from 'lucide-react';
import PollResults from './PollResults';
import ChatDrawer from './ChatDrawer';
import { useToast } from '@/hooks/use-toast';

const StudentDashboard = () => {
  const { 
    currentUser, 
    currentPoll, 
    students,
    logout, 
    submitAnswer,
    setStudentTimer,
    getStudentTimer
  } = usePollStore();
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();

  const currentStudent = students.find(s => s.name === currentUser?.name);
  const timeRemaining = currentUser ? getStudentTimer(currentUser.name) : 0;
  const hasAnswered = currentStudent?.hasAnswered || false;

  useEffect(() => {
    if (currentPoll && timeRemaining > 0 && !hasAnswered && currentUser) {
      const timer = setInterval(() => {
        const newTime = getStudentTimer(currentUser.name) - 1;
        setStudentTimer(currentUser.name, Math.max(0, newTime));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, currentPoll, hasAnswered, currentUser, setStudentTimer, getStudentTimer]);

  useEffect(() => {
    if (timeRemaining <= 0 && currentPoll && !hasAnswered) {
      toast({
        title: "Time's Up!",
        description: "You can now view the poll results.",
        variant: "destructive",
      });
    }
  }, [timeRemaining, currentPoll, hasAnswered, toast]);

  useEffect(() => {
    if (currentPoll && currentUser) {
      setSelectedOption(null);
      // Initialize timer for new poll if not already set
      if (getStudentTimer(currentUser.name) === 0) {
        setStudentTimer(currentUser.name, currentPoll.timeLimit);
      }
    }
  }, [currentPoll?.id, currentUser, setStudentTimer, getStudentTimer]);

  const handleSubmitAnswer = () => {
    if (selectedOption && currentUser && !hasAnswered) {
      submitAnswer(currentUser.name, selectedOption);
      toast({
        title: "Answer Submitted!",
        description: "You can now view the live results.",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white px-3 py-1 rounded-full text-sm font-medium">
              <span className="text-xs">👥</span>
              Intervue Poll
            </div>
            <div>
              <span className="text-gray-600 text-sm">Welcome back,</span>
              <span className="font-semibold ml-1">{currentUser?.name}</span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Main Content */}
        {!currentPoll ? (
          <Card className="text-center py-16 bg-white shadow-lg">
            <CardContent>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white px-4 py-2 rounded-full mb-8">
                <span className="text-sm font-medium">Intervue Poll</span>
              </div>
              <div className="w-20 h-20 border-4 border-purple-200 border-dashed rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <Clock className="w-10 h-10 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Wait for the teacher to ask a new question</h2>
              <p className="text-black/50 text-lg">
                You'll be notified when a new poll is available to answer.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Current Poll */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">Question 1</CardTitle>
                  {timeRemaining > 0 && !hasAnswered && (
                    <div className="flex items-center gap-2 text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4" />
                      {formatTime(timeRemaining)}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 text-white p-6 rounded-xl mb-8">
                  <h3 className="text-xl font-medium">{currentPoll.question}</h3>
                </div>

                {(!hasAnswered && timeRemaining > 0) ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {currentPoll.options.map((option, index) => (
                        <div
                          key={option.id}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                            selectedOption === option.id
                              ? 'border-purple-500 bg-purple-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedOption(option.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                              selectedOption === option.id
                                ? 'border-purple-500 bg-purple-500 text-white'
                                : 'border-gray-300 bg-purple-100 text-purple-600'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="font-medium text-lg">{option.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedOption}
                      className="w-full bg-purple-600 hover:bg-purple-700 py-4 text-lg font-medium rounded-xl h-auto"
                    >
                      Submit
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-2xl font-bold mb-3">
                      {hasAnswered ? "Answer submitted!" : "Time's up!"}
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">View the live polling results below.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results */}
            {(hasAnswered || timeRemaining <= 0) && <PollResults />}
          </div>
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

export default StudentDashboard;
