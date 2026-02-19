import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  MoodRecord,
  FeedingRecord,
  PanasRecord,
  DailyNote,
} from '@/types';

// ============================================================
// State
// ============================================================
interface AppState {
  moods: MoodRecord[];
  feedings: FeedingRecord[];
  panasRecords: PanasRecord[];
  dailyNotes: DailyNote[];
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';
}

const initialState: AppState = {
  moods: [],
  feedings: [],
  panasRecords: [],
  dailyNotes: [],
  toastMessage: null,
  toastType: 'success',
};

// ============================================================
// Action Types
// ============================================================
type Action =
  | { type: 'ADD_MOOD'; payload: MoodRecord }
  | { type: 'DELETE_MOOD'; payload: string }
  | { type: 'ADD_FEEDING'; payload: FeedingRecord }
  | { type: 'DELETE_FEEDING'; payload: string }
  | { type: 'ADD_PANAS'; payload: PanasRecord }
  | { type: 'DELETE_PANAS'; payload: string }
  | { type: 'ADD_NOTE'; payload: DailyNote }
  | { type: 'UPDATE_NOTE'; payload: DailyNote }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SHOW_TOAST'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'HIDE_TOAST' }
  | { type: 'SET_INITIAL_DATA'; payload: Partial<AppState> };

// ============================================================
// Reducer
// ============================================================
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_MOOD':
      return { ...state, moods: [action.payload, ...state.moods] };
    case 'DELETE_MOOD':
      return { ...state, moods: state.moods.filter((m) => m.id !== action.payload) };
    case 'ADD_FEEDING':
      return { ...state, feedings: [action.payload, ...state.feedings] };
    case 'DELETE_FEEDING':
      return { ...state, feedings: state.feedings.filter((f) => f.id !== action.payload) };
    case 'ADD_PANAS':
      return { ...state, panasRecords: [action.payload, ...state.panasRecords] };
    case 'DELETE_PANAS':
      return { ...state, panasRecords: state.panasRecords.filter((p) => p.id !== action.payload) };
    case 'ADD_NOTE':
      return { ...state, dailyNotes: [action.payload, ...state.dailyNotes] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        dailyNotes: state.dailyNotes.map((n) =>
          n.id === action.payload.id ? action.payload : n
        ),
      };
    case 'DELETE_NOTE':
      return { ...state, dailyNotes: state.dailyNotes.filter((n) => n.id !== action.payload) };
    case 'SHOW_TOAST':
      return {
        ...state,
        toastMessage: action.payload.message,
        toastType: action.payload.type,
      };
    case 'HIDE_TOAST':
      return { ...state, toastMessage: null };
    case 'SET_INITIAL_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// ============================================================
// Context
// ============================================================
interface AppContextType {
  state: AppState;
  addMood: (mood: MoodRecord) => void;
  deleteMood: (id: string) => void;
  addFeeding: (feeding: FeedingRecord) => void;
  deleteFeeding: (id: string) => void;
  addPanas: (panas: PanasRecord) => void;
  deletePanas: (id: string) => void;
  addNote: (note: DailyNote) => void;
  updateNote: (note: DailyNote) => void;
  deleteNote: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ============================================================
// Provider
// ============================================================
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addMood = useCallback((mood: MoodRecord) => {
    dispatch({ type: 'ADD_MOOD', payload: mood });
  }, []);

  const deleteMood = useCallback((id: string) => {
    dispatch({ type: 'DELETE_MOOD', payload: id });
  }, []);

  const addFeeding = useCallback((feeding: FeedingRecord) => {
    dispatch({ type: 'ADD_FEEDING', payload: feeding });
  }, []);

  const deleteFeeding = useCallback((id: string) => {
    dispatch({ type: 'DELETE_FEEDING', payload: id });
  }, []);

  const addPanas = useCallback((panas: PanasRecord) => {
    dispatch({ type: 'ADD_PANAS', payload: panas });
  }, []);

  const deletePanas = useCallback((id: string) => {
    dispatch({ type: 'DELETE_PANAS', payload: id });
  }, []);

  const addNote = useCallback((note: DailyNote) => {
    dispatch({ type: 'ADD_NOTE', payload: note });
  }, []);

  const updateNote = useCallback((note: DailyNote) => {
    dispatch({ type: 'UPDATE_NOTE', payload: note });
  }, []);

  const deleteNote = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
  }, []);

  const hideToast = useCallback(() => {
    dispatch({ type: 'HIDE_TOAST' });
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        addMood,
        deleteMood,
        addFeeding,
        deleteFeeding,
        addPanas,
        deletePanas,
        addNote,
        updateNote,
        deleteNote,
        showToast,
        hideToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
