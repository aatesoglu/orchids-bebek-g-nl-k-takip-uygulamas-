import {
  MoodRecord,
  FeedingRecord,
  PanasRecord,
  DailyNote,
  PANAS_QUESTIONS,
} from '@/types';

// Benzersiz ID üretici
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Tarih formatlayıcı
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

// ============================================================
// Mock Veriler
// ============================================================
export const mockMoods: MoodRecord[] = [
  {
    id: '1',
    moodLevel: 4,
    moodLabel: 'Mutlu',
    emoji: '😊',
    note: 'Bebeğim çok güzel uyudu.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    moodLevel: 3,
    moodLabel: 'Nötr',
    emoji: '😐',
    note: undefined,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    moodLevel: 5,
    moodLabel: 'Çok Mutlu',
    emoji: '😄',
    note: 'İlk adımını attı!',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockFeedings: FeedingRecord[] = [
  {
    id: '1',
    type: 'Biberon',
    amountMl: 120,
    durationMinutes: undefined,
    note: undefined,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'Meme',
    durationMinutes: 15,
    amountMl: undefined,
    note: 'Sol meme 10 dk, sağ meme 5 dk',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'Mama',
    amountGram: 80,
    note: undefined,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockPanasRecords: PanasRecord[] = [
  {
    id: '1',
    answers: PANAS_QUESTIONS.map((q) => ({ questionId: q.id, score: Math.floor(Math.random() * 4) as any })),
    positiveScore: 28,
    negativeScore: 14,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockDailyNotes: DailyNote[] = [
  {
    id: '1',
    text: 'Bugün bebeğimle oyun oynadım. Çok güzel vakit geçirdik.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    text: 'İlk dişi çıkmaya başladı. Biraz huzursuzdu ama geçti.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// Servis Fonksiyonları (API'ye hazır)
// ============================================================

// --- Mood Servisi ---
export const moodService = {
  async getAll(): Promise<MoodRecord[]> {
    // TODO: return await apiRequest('/moods');
    return mockMoods;
  },
  async create(data: Omit<MoodRecord, 'id' | 'createdAt'>): Promise<MoodRecord> {
    // TODO: return await apiRequest('/moods', 'POST', data);
    return {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
  },
  async delete(id: string): Promise<void> {
    // TODO: await apiRequest(`/moods/${id}`, 'DELETE');
  },
};

// --- Feeding Servisi ---
export const feedingService = {
  async getAll(): Promise<FeedingRecord[]> {
    return mockFeedings;
  },
  async create(data: Omit<FeedingRecord, 'id' | 'createdAt'>): Promise<FeedingRecord> {
    return {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
  },
  async delete(id: string): Promise<void> {},
};

// --- PANAS Servisi ---
export const panasService = {
  async getAll(): Promise<PanasRecord[]> {
    return mockPanasRecords;
  },
  async create(data: Omit<PanasRecord, 'id' | 'createdAt'>): Promise<PanasRecord> {
    return {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
  },
  async delete(id: string): Promise<void> {},
};

// --- Note Servisi ---
export const noteService = {
  async getAll(): Promise<DailyNote[]> {
    return mockDailyNotes;
  },
  async create(text: string): Promise<DailyNote> {
    return {
      id: generateId(),
      text,
      createdAt: new Date().toISOString(),
    };
  },
  async update(id: string, text: string): Promise<DailyNote> {
    return {
      id,
      text,
      createdAt: new Date().toISOString(),
    };
  },
  async delete(id: string): Promise<void> {},
};
