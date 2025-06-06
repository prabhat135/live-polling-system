
export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  correctAnswerId: string; // Made required instead of optional
  timeLimit: number;
  isActive: boolean;
  createdAt: Date;
  responses: PollResponse[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollResponse {
  studentName: string;
  optionId: string;
  timestamp: Date;
}

export interface Student {
  name: string;
  hasAnswered: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isTeacher: boolean;
}
