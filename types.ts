
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Resource {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId?: string;
  startDate: string; // ISO string
  durationDays: number;
  dependencies: string[]; // Task IDs
}

export interface ProjectPhase {
  name: string;
  tasks: Task[];
}

export interface ProjectPlan {
  projectName: string;
  description: string;
  suggestedTeam: Resource[];
  phases: ProjectPhase[];
}

export interface Issue {
  id: string;
  title: string;
  type: 'BUG' | 'TASK' | 'IMPROVEMENT';
  status: 'OPEN' | 'RESOLVED' | 'CLOSED';
  reporter: string;
  createdAt: string;
}
