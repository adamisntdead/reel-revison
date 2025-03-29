export interface Tune {
  id: string;
  title: string;
  type: 'reel' | 'jig' | 'hornpipe' | 'polka' | 'barndance' | 'slip jig' | 'slide' | 'waltz' | 'strathspey' | 'three-two' | 'mazurka' | 'march' | 'other';
  key: string;
  abc: string;
  lastPracticed?: Date;
  nextReview?: Date;
  difficulty: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  tags: string[];
}

export interface PracticeSession {
  id: string;
  tuneId: string;
  date: Date;
  duration: number; // in minutes
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
} 