export function setCurrentSplit(state, action) {
  return {
    ...state,
    currentIndex: 0,
    currentSplit: action.payload.name,
  };
}

export function addSplit(state, action) {
  return {
    ...state,
    currentSplit: action.payload.name,
    splits: {
      ...state.splits,
      [action.payload.name]: {
        todo: [],
        done: [],
      },
    },
  };
}
