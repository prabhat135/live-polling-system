
import { useState, useEffect } from 'react';
import { usePollStore } from '../store/pollStore';
import RoleSelection from '../components/RoleSelection';
import StudentNameEntry from '../components/StudentNameEntry';
import TeacherDashboard from '../components/TeacherDashboard';
import StudentDashboard from '../components/StudentDashboard';

const Index = () => {
  const { currentUser, setCurrentUser, addStudent } = usePollStore();
  const [studentName, setStudentName] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null);

  // Check for existing student name in sessionStorage
  useEffect(() => {
    const savedName = sessionStorage.getItem('studentName');
    if (savedName) {
      setStudentName(savedName);
    }
  }, []);

  // Reset role selection when user logs out
  useEffect(() => {
    if (!currentUser) {
      setSelectedRole(null);
      setStudentName(null);
    }
  }, [currentUser]);

  const handleRoleSelect = (role: 'teacher' | 'student') => {
    setSelectedRole(role);
    if (role === 'teacher') {
      setCurrentUser({ name: 'Teacher', role: 'teacher' });
    }
    // For students, we need to get their name first before setting currentUser
  };

  const handleStudentNameSubmit = (name: string) => {
    sessionStorage.setItem('studentName', name);
    setStudentName(name);
    setCurrentUser({ name, role: 'student' });
    addStudent(name);
  };

  // Show role selection if no role is selected yet
  if (!selectedRole) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  // Show name entry for students who haven't provided a name yet
  if (selectedRole === 'student' && !currentUser) {
    return <StudentNameEntry onNameSubmit={handleStudentNameSubmit} />;
  }

  // Show appropriate dashboard
  if (currentUser?.role === 'teacher') {
    return <TeacherDashboard />;
  }

  if (currentUser?.role === 'student') {
    return <StudentDashboard />;
  }

  // Fallback
  return <RoleSelection onRoleSelect={handleRoleSelect} />;
};

export default Index;
