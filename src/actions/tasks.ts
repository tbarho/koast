import { v4 } from "uuid";

export function setCurrentIndex(state, action) {
  return {
    ...state,
    currentIndex: action.payload.index,
  };
}

export function next(state) {
  const currentSplit = state.currentSplit;
  const previousIndex = state.currentIndex;

  const todosLength = state.splits[currentSplit].todo.length;

  const currentIndex =
    previousIndex === todosLength - 1 ? todosLength - 1 : previousIndex + 1;

  return {
    ...state,
    currentIndex,
  };
}

export function prev(state) {
  const previousIndex = state.currentIndex;
  const currentIndex = previousIndex === 0 ? previousIndex : previousIndex - 1;

  return {
    ...state,
    currentIndex,
  };
}

export function addTask(state, action) {
  const currentSplit = state.currentSplit;
  const task = {
    id: v4(),
    name: action.payload.name,
    enteredTodo: new Date().toISOString(),
  };

  const todo = [...state.splits[currentSplit].todo, task];

  return {
    ...state,
    currentIndex: todo.length - 1,
    splits: {
      ...state.splits,
      [currentSplit]: {
        ...state.splits[currentSplit],
        todo,
      },
    },
  };
}

export function completeTask(state, action) {
  const currentSplit = state.currentSplit;
  const { id } = action.payload;
  const task = state.splits[currentSplit].todo.find((t) => t.id === id);

  if (!task) {
    console.error(state, action);
    throw new Error("Task not found");
  }

  const todo = state.splits[currentSplit].todo.filter((t) => t.id !== id);
  const done = [...state.splits[currentSplit].done, task];

  const previousIndex = state.currentIndex;
  const currentIndex = previousIndex === 0 ? previousIndex : previousIndex - 1;

  return {
    ...state,
    currentIndex,
    splits: {
      ...state.splits,
      [currentSplit]: {
        ...state.splits[currentSplit],
        todo,
        done,
      },
    },
  };
}

export function deleteTask(state, action) {
  const currentSplit = state.currentSplit;
  const { id } = action.payload;
  const task = state.splits[currentSplit].todo.find((t) => t.id === id);

  if (!task) {
    console.error(state, action);
    throw new Error("Task not found");
  }

  const todo = state.splits[currentSplit].todo.filter((t) => t.id !== id);

  const previousIndex = state.currentIndex;
  const currentIndex = previousIndex === 0 ? previousIndex : previousIndex - 1;

  return {
    ...state,
    currentIndex,
    splits: {
      ...state.splits,
      [currentSplit]: {
        ...state.splits[currentSplit],
        todo,
      },
    },
  };
}

export function moveTaskUp(state, action) {
  if (state.currentIndex === 0) {
    return state;
  }

  const currentSplit = state.currentSplit;
  const { id } = action.payload;
  const task = state.splits[currentSplit].todo.find((t) => t.id === id);

  if (!task) {
    console.error(state, action);
    throw new Error("Task not found");
  }

  const newIndex = state.currentIndex - 1;
  const stack = state.splits[state.currentSplit].todo;

  const before = stack.slice(0, newIndex);
  const after = [
    ...stack.slice(newIndex, state.currentIndex),
    ...stack.slice(state.currentIndex + 1),
  ];

  const todo = [...before, task, ...after];

  return {
    ...state,
    currentIndex: newIndex,
    splits: {
      ...state.splits,
      [currentSplit]: {
        ...state.splits[currentSplit],
        todo,
      },
    },
  };
}

export function moveTaskDown(state, action) {
  const currentSplit = state.currentSplit;
  const { id } = action.payload;
  const task = state.splits[currentSplit].todo.find((t) => t.id === id);

  if (!task) {
    console.error(state, action);
    throw new Error("Task not found");
  }

  const stack = state.splits[state.currentSplit].todo;

  if (state.currentIndex === stack.length - 1) {
    return state;
  }

  const newIndex = state.currentIndex + 1;

  const before = [
    ...stack.slice(0, state.currentIndex),
    ...stack.slice(newIndex, newIndex + 1),
  ];
  const after = [...stack.slice(newIndex + 1)];
  const todo = [...before, task, ...after];

  return {
    ...state,
    currentIndex: newIndex,
    splits: {
      ...state.splits,
      [currentSplit]: {
        ...state.splits[currentSplit],
        todo,
      },
    },
  };
}
