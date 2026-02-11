export interface SleepSession {
  id: string;
  bedtime: string;
  waketime: string;
  quality: number; // 1-5
  notes?: string;
  duration: number; // in minutes
}

export interface RoutineItem {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

export interface Routine {
  id: string;
  name: string;
  items: RoutineItem[];
}
