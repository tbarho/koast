import { createContext, useCallback, useState, useMemo } from "react";
import createPersistedReducer from "use-persisted-reducer";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useKBar } from "kbar";

import AddTask from "../components/AddTask";
import AddSplit from "../components/AddSplit";

const useAppReducer = createPersistedReducer("koast");

export const TasksContext = createContext({});

const initialState = {
  currentSplit: "important",
  currentIndex: 0,
  splits: {
    important: {
      todo: [],
      done: [],
    },
  },
};

function next(state) {
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

function prev(state) {
  const previousIndex = state.currentIndex;
  const currentIndex = previousIndex === 0 ? previousIndex : previousIndex - 1;

  return {
    ...state,
    currentIndex,
  };
}

function addTask(state, action) {
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

function completeTask(state, action) {
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

function reducer(state, action) {
  switch (action.type) {
    case `reset`:
      return { ...initialState };
    case `setcurrentsplit`:
      return {
        ...state,
        currentIndex: 0,
        currentSplit: action.payload.name,
      };
    case `addsplit`:
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
    case "addtask":
      return addTask(state, action);
    case "completetask":
      return completeTask(state, action);
    case "next":
      return next(state);
    case "prev":
      return prev(state);
    case "setcurrentindex":
      return {
        ...state,
        currentIndex: action.payload.index,
      };
    default:
      return state;
  }
}

export function TasksProvider({ children }) {
  const _navigate = useNavigate();
  const [state, dispatch] = useAppReducer(reducer, initialState);
  const [addTaskVisible, _setAddTaskVisible] = useState(false);
  const [addSplitVisible, _setAddSplitVisible] = useState(false);

  const { visualState } = useKBar(({ visualState }) => ({ visualState }));

  const { splits, currentSplit, currentIndex } = state;
  const tasks = splits[currentSplit].todo || [];
  const done = splits[currentSplit].done || [];
  const currentTask = tasks[currentIndex];

  const completeTask = (task) => {
    task = task || currentTask;

    if (!task) {
      return;
    }

    const payload = { id: task.id };
    dispatch({ type: "completetask", payload });
  };

  function hideAll() {
    _setAddTaskVisible(false);
    _setAddSplitVisible(false);
  }

  function showAddTask() {
    _setAddTaskVisible(true);
  }

  function showAddSplit() {
    _setAddSplitVisible(true);
  }

  function navigate(path, options?) {
    const payload = { name: path.replace(/^\//, "") };
    dispatch({ type: "setcurrentsplit", payload });
    _navigate(path, options);
  }

  function reset() {
    dispatch({ type: "reset" });
    navigate("/important", { replace: true });
  }

  function addSplit(name) {
    dispatch({ type: "addsplit", payload: { name, todo: [], done: [] } });
    navigate(`/${name}`);
    hideAll();
  }

  function addTask(_, taskString) {
    dispatch({ type: "addtask", payload: { name: taskString } });
    hideAll();
  }

  function next() {
    dispatch({ type: "next" });
  }

  function prev() {
    dispatch({ type: "prev" });
  }

  function setCurrentIndex(index) {
    dispatch({ type: "setcurrentindex", payload: { index } });
  }

  const actionOpen = addTaskVisible || addSplitVisible || visualState === 'showing';

  return (
    <TasksContext.Provider
      value={{
        splits,
        currentTask,
        currentIndex,
        tasks,
        done,
        actionOpen,
        showAddTask,
        showAddSplit,
        hideAll,
        navigate,
        setCurrentIndex,
        reset,
        addSplit,
        addTask,
        completeTask,
        next,
        prev,
      }}
    >
      {children}
      {addTaskVisible ? <AddTask /> : null}
      {addSplitVisible ? <AddSplit /> : null}
    </TasksContext.Provider>
  );
}
