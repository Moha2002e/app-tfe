
export type Priority = 'basse' | 'moyenne' | 'haute';

export interface User {
  email: string;
}

export interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: Priority;
  completed: boolean;
}

export interface TFEMilestone {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed';
  deadline: string;
}

export interface TFEProject {
  title: string;
  subject: string;
  milestones: TFEMilestone[];
  notes: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  notes: string;
}

export interface UserState {
  stressLevel: number;
  tasks: Task[];
  tfe: TFEProject;
  courses: Course[];
}
