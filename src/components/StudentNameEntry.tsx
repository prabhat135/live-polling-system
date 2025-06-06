
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface StudentNameEntryProps {
  onNameSubmit: (name: string) => void;
}

const StudentNameEntry = ({ onNameSubmit }: StudentNameEntryProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white px-4 py-2 rounded-full mb-4">
              <span className="text-sm font-medium">Intervue Poll</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Let's Get Started</h2>
            <p className="text-gray-600">
              If you're a student, you'll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Enter your Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] hover:bg-purple-700 text-white py-3 rounded-full font-medium"
              disabled={!name.trim()}
            >
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentNameEntry;
