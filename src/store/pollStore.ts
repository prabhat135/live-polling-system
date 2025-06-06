
import { create } from 'zustand';
import { Poll, Student, ChatMessage } from '../types/poll';

interface PollStore {
  currentUser: { name: string; role: 'teacher' | 'student' } | null;
  currentPoll: Poll | null;
  students: Student[];
  chatMessages: ChatMessage[];
  pollHistory: Poll[];
  studentTimers: Record<string, number>; // Track individual student timers
  
  setCurrentUser: (user: { name: string; role: 'teacher' | 'student' }) => void;
  logout: () => void;
  createPoll: (question: string, options: string[], timeLimit: number, correctAnswerId: string) => void;
  submitAnswer: (studentName: string, optionId: string) => void;
  endPoll: () => void;
  addChatMessage: (message: string, isTeacher: boolean) => void;
  setStudentTimer: (studentName: string, time: number) => void;
  getStudentTimer: (studentName: string) => number;
  addStudent: (name: string) => void;
  removeStudent: (name: string) => void;
  canCreateNewPoll: () => boolean;
}

export const usePollStore = create<PollStore>((set, get) => ({
  currentUser: null,
  currentPoll: null,
  students: [],
  chatMessages: [],
  pollHistory: [],
  studentTimers: {},

  setCurrentUser: (user) => set({ currentUser: user }),
  
  logout: () => {
    // Clear sessionStorage for student name
    sessionStorage.removeItem('studentName');
    
    // Only clear user-specific data, keep polls and poll history
    set({ 
      currentUser: null
    });
  },

  createPoll: (question, options, timeLimit, correctAnswerId) => {
    const newPoll: Poll = {
      id: Date.now().toString(),
      question,
      options: options.map((text, index) => ({
        id: (index + 1).toString(),
        text,
        votes: 0
      })),
      correctAnswerId,
      timeLimit,
      isActive: true,
      createdAt: new Date(),
      responses: []
    };
    
    // Reset students' answer status
    const updatedStudents = get().students.map(student => ({
      ...student,
      hasAnswered: false
    }));
    
    // Initialize timers for all current students
    const studentTimers: Record<string, number> = {};
    updatedStudents.forEach(student => {
      studentTimers[student.name] = timeLimit;
    });
    
    set({ 
      currentPoll: newPoll, 
      students: updatedStudents,
      studentTimers
    });
  },

  submitAnswer: (studentName, optionId) => {
    const state = get();
    if (!state.currentPoll) return;

    // Check if student already answered
    const student = state.students.find(s => s.name === studentName);
    if (student?.hasAnswered) return;

    const updatedPoll = { ...state.currentPoll };
    const option = updatedPoll.options.find(opt => opt.id === optionId);
    if (option) {
      option.votes += 1;
    }

    updatedPoll.responses.push({
      studentName,
      optionId,
      timestamp: new Date()
    });

    const updatedStudents = state.students.map(student =>
      student.name === studentName 
        ? { ...student, hasAnswered: true }
        : student
    );

    set({ 
      currentPoll: updatedPoll,
      students: updatedStudents
    });
  },

  endPoll: () => {
    const state = get();
    if (!state.currentPoll) return;

    const endedPoll = { ...state.currentPoll, isActive: false };
    
    set({ 
      currentPoll: null,
      pollHistory: [...state.pollHistory, endedPoll],
      studentTimers: {}
    });
  },

  addChatMessage: (message, isTeacher) => {
    const state = get();
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: state.currentUser?.name || 'Anonymous',
      message,
      timestamp: new Date(),
      isTeacher
    };

    set({ 
      chatMessages: [...state.chatMessages, newMessage]
    });
  },

  setStudentTimer: (studentName, time) => {
    const state = get();
    set({ 
      studentTimers: { ...state.studentTimers, [studentName]: time }
    });
  },

  getStudentTimer: (studentName) => {
    const state = get();
    return state.studentTimers[studentName] || 0;
  },

  addStudent: (name) => {
    const state = get();
    if (!state.students.find(s => s.name === name)) {
      const newStudents = [...state.students, { name, hasAnswered: false }];
      
      // If there's a current poll, initialize timer for new student
      const updatedTimers = { ...state.studentTimers };
      if (state.currentPoll) {
        updatedTimers[name] = state.currentPoll.timeLimit;
      }
      
      set({ 
        students: newStudents,
        studentTimers: updatedTimers
      });
    }
  },

  removeStudent: (name) => {
    const state = get();
    const updatedTimers = { ...state.studentTimers };
    delete updatedTimers[name];
    
    set({ 
      students: state.students.filter(s => s.name !== name),
      studentTimers: updatedTimers
    });
  },

  canCreateNewPoll: () => {
    const state = get();
    // Can create if no poll exists or if all students have answered
    return !state.currentPoll || state.students.every(s => s.hasAnswered);
  }
}));
