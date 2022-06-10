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

export function removeSplit(state, action) {
  if (!action.payload.name) {
    return;
  }

  if (action.payload.name === 'important') {
    return;
  }

  if (!state.splits[action.payload.name]) {
    return;
  }

  const currentSplit = state.splits[state.currentSplit];
  let newSplits = { ...state.splits };
  delete newSplits[action.payload.name];

  newSplits.important = {
    todo: [...newSplits.important.todo, ...currentSplit.todo],
    done: [...newSplits.important.done, ...currentSplit.done],
  };

  return {
    ...state,
    currentIndex: 0,
    currentSplit: "important",
    splits: newSplits,

  }

}