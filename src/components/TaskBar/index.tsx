import React, { useState, useMemo, useContext, useEffect } from "react";
import { KBarProvider, createAction, useRegisterActions } from "kbar";
import { AiOutlinePlusCircle } from "react-icons/ai";

import { TasksContext } from "../../context/tasks";

import CommandBar from "../CommandBar";

function TaskBar() {
  const [actions, setActions] = useState([]) as any;
  const { currentTask, showAddTask, showAddSplit, reset, completeTask }: any =
    useContext(TasksContext);

  const addTaskAction = createAction({
    name: "Add Task",
    // subtitle: "Read the latest news",
    shortcut: ["t"],
    keywords: "tasks add",
    icon: <AiOutlinePlusCircle size={20} />,
    perform: () => {
      showAddTask();
    },
  });

  const addSplitAction = createAction({
    name: "Create a new Split",
    // subtitle: "Read the latest news",
    shortcut: ["s"],
    keywords: "splits add",
    icon: <AiOutlinePlusCircle size={20} />,
    perform: () => {
      showAddSplit();
    },
  });

  const resetAction = createAction({
    name: "Developer: Reset State",
    // subtitle: "Read the latest news",
    shortcut: [],
    keywords: "reset",
    icon: <AiOutlinePlusCircle size={20} />,
    perform: () => {
      reset();
    },
  });

  const completeTaskAction = createAction({
    name: "Complete Task",
    shortcut: ["e"],
    keywords: "complete",
    icon: <AiOutlinePlusCircle size={20} />,
    perform: () => {
      completeTask();
    },
  });

  useEffect(() => {
    const baseActions = [
      addTaskAction,
      addSplitAction,
      resetAction
    ];

    if (!currentTask) {
      setActions(baseActions);
      return;
    }

    setActions([
      ...baseActions,
      completeTaskAction,
    ]);

  }, [currentTask]);

  useRegisterActions(actions, [actions]);

  return (
    <>
      <CommandBar />
    </>
  );
}

export default TaskBar;
