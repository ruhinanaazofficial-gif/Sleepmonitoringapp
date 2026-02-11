import { SleepSession, Routine } from "../types";

const SLEEP_SESSIONS_KEY = "sleep_sessions";
const ROUTINES_KEY = "bedtime_routines";

export const getSleepSessions = (): SleepSession[] => {
  const data = localStorage.getItem(SLEEP_SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSleepSession = (session: SleepSession) => {
  const sessions = getSleepSessions();
  const existingIndex = sessions.findIndex((s) => s.id === session.id);
  
  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }
  
  localStorage.setItem(SLEEP_SESSIONS_KEY, JSON.stringify(sessions));
};

export const deleteSleepSession = (id: string) => {
  const sessions = getSleepSessions().filter((s) => s.id !== id);
  localStorage.setItem(SLEEP_SESSIONS_KEY, JSON.stringify(sessions));
};

export const getRoutines = (): Routine[] => {
  const data = localStorage.getItem(ROUTINES_KEY);
  if (data) return JSON.parse(data);
  
  // Default routine
  return [
    {
      id: "default",
      name: "Evening Routine",
      items: [
        { id: "1", title: "Dim the lights", completed: false, order: 1 },
        { id: "2", title: "No screens 30 min before bed", completed: false, order: 2 },
        { id: "3", title: "Read a book", completed: false, order: 3 },
        { id: "4", title: "Meditation or breathing exercises", completed: false, order: 4 },
        { id: "5", title: "Set room temperature (60-67°F)", completed: false, order: 5 },
      ],
    },
  ];
};

export const saveRoutines = (routines: Routine[]) => {
  localStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
};
