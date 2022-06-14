import { useState, useContext, useEffect } from "react";
import { createAction, useRegisterActions } from "kbar";
import { AiOutlinePlusCircle, AiOutlineMinusSquare } from "react-icons/ai";

import { TasksContext } from "../../context/tasks";

import CommandBar from "../CommandBar";
import { startCase } from "lodash";

function TaskBar() {
  const [actions, setActions] = useState([]) as any;
  const {
    splits,
    currentSplit,
    currentTask,
    showAddTask,
    showAddSplit,
    removeSplit,
    reset,
    completeTask,
    deleteTask,
    moveToSplit,
  }: any = useContext(TasksContext);

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

  const removeSplitAction = createAction({
    name: "Remove this Split",
    // subtitle: "Read the latest news",
    shortcut: [],
    keywords: "splits remove delete",
    icon: <AiOutlineMinusSquare size={20} />,
    perform: () => {
      removeSplit(currentSplit);
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

  const deleteTaskAction = createAction({
    name: "Delete Task",
    shortcut: [],
    keywords: "delete",
    icon: <AiOutlinePlusCircle size={20} />,
    perform: () => {
      deleteTask();
    },
  });

  const moveTaskAction = createAction({
    name: "Move Task",
    icon: <AiOutlinePlusCircle size={20} />,
  });

  const moveTaskLocations = Object.keys(splits)
    .filter((k) => k !== currentSplit)
    .map((key) => {
      return createAction({
        name: startCase(key),
        parent: moveTaskAction.id,
        perform: () => {
          moveToSplit(currentTask, key);
        },
      });
    });

  useEffect(() => {
    let baseActions = [addTaskAction, addSplitAction, resetAction];

    if (currentSplit !== "important") {
      baseActions.push(removeSplitAction);
    }

    if (!currentTask) {
      setActions(baseActions);
      return;
    }

    setActions([
      ...baseActions,
      completeTaskAction,
      deleteTaskAction,
      moveTaskAction,
      ...moveTaskLocations,
    ]);
  }, [splits, currentSplit, currentTask]);

  useRegisterActions(actions, [actions]);

  return (
    <>
      <CommandBar />
    </>
  );
}

export default TaskBar;
