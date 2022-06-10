import React, { useContext } from "react";
import styled from "styled-components";
import moment from "moment";
import {
  IoCheckmarkOutline,
  IoTimeOutline,
  IoCopyOutline,
} from "react-icons/io5";
import { useKBar } from "kbar";

import { TasksContext } from "../../context/tasks";
import { useKeyPress } from "../../hooks/useKeyPress";

function _TaskHighlight({ className }: any) {
  const { tasks, currentIndex }: any = useContext(TasksContext);

  if (!tasks || !tasks.length) {
    return null;
  }

  return (
    <div
      className={className}
      style={{ transform: `translateY(${currentIndex * 36}px)` }}
    />
  );
}

const TaskHighlight = styled(_TaskHighlight)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 36px;
  transform-origin: top left;
  filter: opacity(1);
  transition: transform 256ms cubic-bezier(0.19, 1, 0.22, 1),
    filter 256ms cubic-bezier(0.19, 1, 0.22, 1);
  background: #f4f6fb;
`;

function _TaskItem({ className, id, index, name, enteredTodo }: any) {
  const { query } = useKBar();
  const { currentTask, completeTask, setCurrentIndex }: any =
    useContext(TasksContext);

  const isCurrentTask = currentTask && currentTask.id === id;

  function onMouseEnter(e) {
    e.preventDefault();
    setCurrentIndex(index);
  }

  return (
    <li className={className} onMouseEnter={onMouseEnter}>
      <span>{name}</span>
      {isCurrentTask ? (
        <span className="actions">
          <button onClick={() => completeTask({ id })}>
            <IoCheckmarkOutline size={18} />
          </button>
          <button>
            <IoTimeOutline size={18} />
          </button>
          <button onClick={query.toggle}>
            <IoCopyOutline size={14} />
          </button>
        </span>
      ) : (
        <span>{moment(new Date(enteredTodo)).format("h:mm A")}</span>
      )}
    </li>
  );
}

const TaskItem = styled(_TaskItem)`
  font-size: 12px;
  line-heght: 16px;

  .actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      outline: none;
      background: none;
      border: none;
      margin: 0;
      padding: 0;
      margin-right: 1rem;
      cursor: pointer;
      position: relative;
      border-radius: 11px;
      height: 22px;
      width: 22px;
      transition: background 150ms ease, box-shadow 150ms ease;

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        background: #fff;
        box-shadow: 0 0 6px 0 rgb(0 0 0 / 10%), 0 2px 6px 0 rgb(0 0 0 / 15%),
          0 0 0.5px 0 rgb(0 0 0 / 10%);

        svg {
          opacity: 0.5;
        }
      }

      svg {
        color: #000;
        opacity: 0.3;
        pointer: cursor;
        transition: opacity 150ms ease;
      }
    }
  }
`;

function _TaskList({ className }: any) {
  const {
    tasks,
    prev,
    next,
    currentIndex,
    actionOpen,
    moveTaskUp,
    moveTaskDown,
  }: any = useContext(TasksContext);

  useKeyPress(
    (e) => {
      if (actionOpen) {
        return;
      }

      if (e.shiftKey) {
        return;
      }

      e.preventDefault();

      if (e.metaKey) {
        moveTaskUp();
        return;
      }

      prev();
    },
    ["KeyK", "ArrowUp"],
    [currentIndex, actionOpen]
  );

  useKeyPress(
    (e) => {
      if (actionOpen) {
        return;
      }
      
      if (e.shiftKey) {
        return;
      }
      
      e.preventDefault();
      
      if (e.metaKey) {
        moveTaskDown();
        return;
      }

      next();
    },
    ["KeyJ", "ArrowDown"],
    [currentIndex, actionOpen]
  );

  return (
    <div className={className}>
      <TaskHighlight />
      <ul>
        {tasks.map(({ id, ...rest }, idx) => (
          <TaskItem key={id} id={id} index={idx} {...rest} />
        ))}
      </ul>
    </div>
  );
}

const TaskList = styled(_TaskList)`
  position: relative;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    height: 36px;
    cursor: pointer;
    transform: translateX(0);
    will-change: transform;
    padding-top: calc(8px + 2px);
    padding-bottom: calc(8px + 2px);
    padding-left: 3.5rem;
    padding-right: 2rem;
    box-sizing: border-box;
    font-size: 0.8rem;
  }
`;

export default TaskList;
