// ============================================================
// DUYGU DURUMU (Mood) Tipleri
// ============================================================
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export type MoodLabel = 'Çok Mutsuz' | 'Mutsuz' | 'Nötr' | 'Mutlu' | 'Çok Mutlu';

export const MOOD_CONFIG: Record<MoodLevel, { label: MoodLabel; emoji: string; color: string }> = {
  1: { label: 'Çok Mutsuz', emoji: '😢', color: '#EF4444' },
  2: { label: 'Mutsuz', emoji: '😞', color: '#F97316' },
  3: { label: 'Nötr', emoji: '😐', color: '#EAB308' },
  4: { label: 'Mutlu', emoji: '😊', color: '#22C55E' },
  5: { label: 'Çok Mutlu', emoji: '😄', color: '#10B981' },
};

export interface MoodRecord {
  id: string;
  moodLevel: MoodLevel;
  moodLabel: MoodLabel;
  emoji: string;
  note?: string;
  createdAt: string; // ISO date string
}

// ============================================================
// BESLENME (Feeding) Tipleri
// ============================================================
export type FeedingType = 'Meme' | 'Biberon' | 'Mama';

export const FEEDING_TYPE_CONFIG: Record<FeedingType, { icon: string; color: string; unit: string }> = {
  Meme: { icon: '🤱', color: '#EC4899', unit: 'dk' },
  Biberon: { icon: '🍼', color: '#8B5CF6', unit: 'mL' },
  Mama: { icon: '🥣', color: '#F59E0B', unit: 'g' },
};

export interface FeedingRecord {
  id: string;
  type: FeedingType;
  durationMinutes?: number; // Meme için (dakika)
  amountMl?: number;        // Biberon için (mL)
  amountGram?: number;      // Mama için (gram)
  note?: string;
  createdAt: string;        // ISO date string
}

// ============================================================
// PANAS TESTİ Tipleri
// ============================================================
export type PanasScore = 0 | 1 | 2 | 3 | 4 | 5;

export interface PanasQuestion {
  id: string;
  label: string;
  category: 'positive' | 'negative';
}

export interface PanasAnswer {
  questionId: string;
  score: PanasScore;
}

export interface PanasRecord {
  id: string;
  answers: PanasAnswer[];
  positiveScore: number;
  negativeScore: number;
  createdAt: string;
}

export const PANAS_QUESTIONS: PanasQuestion[] = [
  { id: 'q1',  label: 'İlgili',      category: 'positive' },
  { id: 'q2',  label: 'Sıkıntılı',   category: 'negative' },
  { id: 'q3',  label: 'Heyecanlı',   category: 'positive' },
  { id: 'q4',  label: 'Mutsuz',      category: 'negative' },
  { id: 'q5',  label: 'Güçlü',       category: 'positive' },
  { id: 'q6',  label: 'Suçlu',       category: 'negative' },
  { id: 'q7',  label: 'Korkmuş',     category: 'negative' },
  { id: 'q8',  label: 'Düşmanca',    category: 'negative' },
  { id: 'q9',  label: 'Coşkulu',     category: 'positive' },
  { id: 'q10', label: 'Gururlu',     category: 'positive' },
  { id: 'q11', label: 'Sinirli',     category: 'negative' },
  { id: 'q12', label: 'Uyanık',      category: 'positive' },
  { id: 'q13', label: 'Utanmış',     category: 'negative' },
  { id: 'q14', label: 'İlhamlı',     category: 'positive' },
  { id: 'q15', label: 'Gergin',      category: 'negative' },
  { id: 'q16', label: 'Kararlı',     category: 'positive' },
  { id: 'q17', label: 'Titiz',       category: 'positive' },
  { id: 'q18', label: 'Huysuz',      category: 'negative' },
  { id: 'q19', label: 'Aktif',       category: 'positive' },
  { id: 'q20', label: 'Endişeli',    category: 'negative' },
];

export const PANAS_SCALE_LABELS: Record<PanasScore, string> = {
  0: 'Hiç',
  1: 'Biraz',
  2: 'Ortalama',
  3: 'Oldukça',
  4: 'Çok',
  5: 'Çok Fazla',
};

// ============================================================
// GÜNLÜK NOT (Daily Note) Tipleri
// ============================================================
export interface DailyNote {
  id: string;
  text: string;
  createdAt: string;
}

// ============================================================
// Genel Yardımcı Tipler
// ============================================================
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
