import { createContext, useState } from "react";
import createPersistedReducer from "use-persisted-reducer";
import { useNavigate } from "react-router-dom";
import { useKBar } from "kbar";

import AddTask from "../components/AddTask";
import AddSplit from "../components/AddSplit";
import {
  setCurrentSplit,
  addSplit,
  removeSplit,
  addTask,
  completeTask,
  deleteTask,
  next,
  prev,
  moveTaskUp,
  moveTaskDown,
  setCurrentIndex,
} from "../actions";

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

function reducer(state, action) {
  switch (action.type) {
    case `reset`:
      return { ...initialState };
    case `setcurrentsplit`:
      return setCurrentSplit(state, action);
    case `addsplit`:
      return addSplit(state, action);
    case `removesplit`:
      return removeSplit(state, action);
    case "addtask":
      return addTask(state, action);
    case "completetask":
      return completeTask(state, action);
    case "deletetask":
      return deleteTask(state, action);
    case "next":
      return next(state);
    case "prev":
      return prev(state);
    case "movetaskup":
      return moveTaskUp(state, action);
    case "movetaskdown":
      return moveTaskDown(state, action);
    case "setcurrentindex":
      return setCurrentIndex(state, action);
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

  const deleteTask = (task) => {
    task = task || currentTask;

    if (!task) {
      return;
    }

    const payload = { id: task.id };
    dispatch({ type: "deletetask", payload });
  };

  const moveTaskUp = (task) => {
    task = task || currentTask;

    if (!task) {
      return;
    }

    const payload = { id: task.id };
    dispatch({ type: "movetaskup", payload });
  };

  const moveTaskDown = (task) => {
    task = task || currentTask;

    if (!task) {
      return;
    }

    const payload = { id: task.id };
    dispatch({ type: "movetaskdown", payload });
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

  function removeSplit(name) {
    if (name === 'important') {
      return;
    }
    dispatch({ type: 'removesplit', payload: { name } });
    navigate("/important", { replace: true });
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

  const actionOpen =
    addTaskVisible || addSplitVisible || visualState === "showing";

  return (
    <TasksContext.Provider
      value={{
        splits,
        currentSplit,
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
        removeSplit,
        addTask,
        completeTask,
        deleteTask,
        moveTaskUp,
        moveTaskDown,
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
