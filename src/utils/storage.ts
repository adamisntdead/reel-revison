import { Tune, PracticeSession } from '@/types/tune';

const TUNES_STORAGE_KEY = 'reel-revision-tunes';
const PRACTICE_SESSIONS_STORAGE_KEY = 'reel-revision-practice-sessions';

export const getTunes = (): Tune[] => {
  const stored = localStorage.getItem(TUNES_STORAGE_KEY);
  console.log('Getting tunes from storage:', stored);
  if (!stored) return [];
  const parsed = JSON.parse(stored);
  console.log('Parsed tunes:', parsed);
  return parsed.map((tune: any) => ({
    ...tune,
    lastPracticed: tune.lastPracticed ? new Date(tune.lastPracticed) : undefined,
    nextReview: tune.nextReview ? new Date(tune.nextReview) : undefined,
  }));
};

export const saveTunes = (tunes: Tune[]): void => {
  console.log('Saving tunes to storage:', tunes);
  localStorage.setItem(TUNES_STORAGE_KEY, JSON.stringify(tunes));
  // Verify the save
  const saved = localStorage.getItem(TUNES_STORAGE_KEY);
  console.log('Verified saved tunes:', saved);
};

export const getPracticeSessions = (): PracticeSession[] => {
  const stored = localStorage.getItem(PRACTICE_SESSIONS_STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored).map((session: any) => ({
    ...session,
    date: new Date(session.date),
  }));
};

export const savePracticeSessions = (sessions: PracticeSession[]): void => {
  localStorage.setItem(PRACTICE_SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
}; 