import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { Tune } from '@/types/tune';
import { getTunes, saveTunes } from '@/utils/storage';

interface TuneState {
  tunes: Tune[];
  loading: boolean;
  error: string | null;
}

type TuneAction =
  | { type: 'SET_TUNES'; payload: Tune[] }
  | { type: 'ADD_TUNE'; payload: Tune }
  | { type: 'UPDATE_TUNE'; payload: Tune }
  | { type: 'DELETE_TUNE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: TuneState = {
  tunes: [],
  loading: false,
  error: null,
};

const TuneContext = createContext<{
  state: TuneState;
  addTune: (tune: Omit<Tune, 'id'>) => Promise<void>;
  updateTune: (tune: Tune) => Promise<void>;
  deleteTune: (id: string) => Promise<void>;
  loadTunes: () => Promise<void>;
} | null>(null);

function tuneReducer(state: TuneState, action: TuneAction): TuneState {
  switch (action.type) {
    case 'SET_TUNES':
      return { ...state, tunes: action.payload, loading: false, error: null };
    case 'ADD_TUNE':
      return { ...state, tunes: [...state.tunes, action.payload], loading: false, error: null };
    case 'UPDATE_TUNE':
      return {
        ...state,
        tunes: state.tunes.map((tune) =>
          tune.id === action.payload.id ? action.payload : tune
        ),
        loading: false,
        error: null,
      };
    case 'DELETE_TUNE':
      return {
        ...state,
        tunes: state.tunes.filter((tune) => tune.id !== action.payload),
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function TuneProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tuneReducer, initialState);

  const loadTunes = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const tunes = getTunes();
      dispatch({ type: 'SET_TUNES', payload: tunes });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load tunes' });
    }
  }, []);

  const addTune = useCallback(async (tune: Omit<Tune, 'id'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newTune: Tune = { ...tune, id: crypto.randomUUID() };
      const updatedTunes = [...state.tunes, newTune];
      saveTunes(updatedTunes);
      dispatch({ type: 'ADD_TUNE', payload: newTune });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add tune' });
    }
  }, [state.tunes]);

  const updateTune = useCallback(async (tune: Tune) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedTunes = state.tunes.map((t) =>
        t.id === tune.id ? tune : t
      );
      saveTunes(updatedTunes);
      dispatch({ type: 'UPDATE_TUNE', payload: tune });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update tune' });
    }
  }, [state.tunes]);

  const deleteTune = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedTunes = state.tunes.filter((t) => t.id !== id);
      saveTunes(updatedTunes);
      dispatch({ type: 'DELETE_TUNE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete tune' });
    }
  }, [state.tunes]);

  return (
    <TuneContext.Provider
      value={{
        state,
        addTune,
        updateTune,
        deleteTune,
        loadTunes,
      }}
    >
      {children}
    </TuneContext.Provider>
  );
}

export function useTuneContext() {
  const context = useContext(TuneContext);
  if (!context) {
    throw new Error('useTuneContext must be used within a TuneProvider');
  }
  return context;
} 