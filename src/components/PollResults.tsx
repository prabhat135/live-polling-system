
import { usePollStore } from '../store/pollStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PollResults = () => {
  const { currentPoll, students } = usePollStore();

  if (!currentPoll) return null;

  const totalVotes = currentPoll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Live Poll Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-800 text-white p-6 rounded-xl mb-8">
          <h3 className="text-xl font-medium">{currentPoll.question}</h3>
        </div>

        <div className="space-y-6">
          {currentPoll.options.map((option, index) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            const isCorrect = currentPoll.correctAnswerId === option.id;
            
            return (
              <div key={option.id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCorrect ? 'bg-green-600 text-white' : 'bg-purple-600 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-lg">{option.text}</span>
                      {isCorrect && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 text-sm rounded-full font-medium">
                          Correct Answer
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-gray-700">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-700 ease-out ${
                      isCorrect ? 'bg-green-600' : 'bg-purple-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-between text-lg text-gray-600">
            <span className="font-medium">Total Responses: {totalVotes}</span>
            <span className="font-medium">Connected Students: {students.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PollResults;
