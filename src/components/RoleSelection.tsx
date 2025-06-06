
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users } from 'lucide-react';

interface RoleSelectionProps {
  onRoleSelect: (role: 'teacher' | 'student') => void;
}

const RoleSelection = ({ onRoleSelect }: RoleSelectionProps) => {
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white px-4 py-2 rounded-full mb-6">
            <span className="text-sm font-medium">Intervue Poll</span>
          </div>
          <h1 className="text-4xl font-normal text-black mb-2">
            Welcome to the <span className="font-bold">Live Polling System</span>
          </h1>
          <p className="text-black/50 text-lg">
            Please select the role that best describes you to begin using the live polling system
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedRole === 'student' 
                ? 'ring-4 ring-[#4D0ACD] bg-purple-50' 
                : 'hover:shadow-xl'
            }`}
            onClick={() => setSelectedRole('student')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">I'm a Student</h3>
              <p className="text-gray-600">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry
              </p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedRole === 'teacher' 
                ? 'ring-4 ring-[#4D0ACD] bg-purple-50' 
                : 'hover:shadow-xl'
            }`}
            onClick={() => setSelectedRole('teacher')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">I'm a Teacher</h3>
              <p className="text-gray-600">
                Submit answers and view live poll results in real-time.</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] hover:bg-purple-700 text-white px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
