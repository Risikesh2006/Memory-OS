import { saveMemories } from './storage';

export const initialState = {
  memories: [],
  filter: "All",
  searchQuery: ""
};

export function memoryReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'INIT_MEMORIES':
      return { ...state, memories: action.payload };
    case 'ADD_MEMORY':
      newState = { ...state, memories: [action.payload, ...state.memories] };
      saveMemories(newState.memories);
      return newState;
    case 'DELETE_MEMORY':
      newState = { ...state, memories: state.memories.filter(m => m.id !== action.payload) };
      saveMemories(newState.memories);
      return newState;
    case 'UPDATE_MEMORY':
      newState = {
        ...state,
        memories: state.memories.map(m => m.id === action.payload.id ? action.payload : m)
      };
      saveMemories(newState.memories);
      return newState;
    case 'TOGGLE_FAVORITE':
      newState = {
        ...state,
        memories: state.memories.map(m => m.id === action.payload ? { ...m, favorite: !m.favorite } : m)
      };
      saveMemories(newState.memories);
      return newState;
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}
