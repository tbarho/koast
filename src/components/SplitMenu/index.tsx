import React, { useContext } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { startCase } from "lodash";
import { useKeyPress } from "../../hooks/useKeyPress";

import { TasksContext } from "../../context/tasks";

function getNextSplitId(splits, currentSplitId, shiftKey) {
  const mapped = Object.keys(splits);

  const currentSplitIndex = mapped.findIndex(
    (s) => s === currentSplitId
  );

  const nextSplitIndex = shiftKey
    ? currentSplitIndex - 1
    : currentSplitIndex + 1;

  if (nextSplitIndex === mapped.length) {
    return mapped[0];
  }

  if (nextSplitIndex < 0) {
    return mapped[mapped.length - 1];
  }

  return mapped[nextSplitIndex];
}

function _SplitMenu({ className }: any) {
  const { splits, navigate }: any = useContext(TasksContext);

  const tabCallback = (e) => {
    e.preventDefault();
    const currentSplitId = window.location.pathname.replace("/", "");
    const nextSplitId = getNextSplitId(splits, currentSplitId, e.shiftKey);
    navigate(`/${nextSplitId}`);
  };

  useKeyPress(tabCallback, ["Tab"], [splits]);

  const menuItems = Object.keys(splits).map((key) => {
    const count = (splits[key].todo || []).length;
    return (
      <NavLink
        key={key}
        to={key}
        className={({ isActive }) => (isActive ? "active" : undefined)}
      >
        <span>{startCase(key)}</span> {count > 0 ? (<span className="count">{count}</span>) : null}
      </NavLink>
    )
  });

  return <div className={className}>{menuItems}</div>;
}

const SplitMenu = styled(_SplitMenu)`
  display: flex;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  padding-left: 3.5rem;

  a {
    color: rgba(0, 0, 0, 0.3);
    text-decoration: none;
    font-weight: 400;
    margin-right: 3rem;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: flex-end;

    &.active {
      color: rgba(0, 0, 0, 0.8);
    }

    .count {
      font-size: 13px;
      margin-left: 0.5rem;
      line-height: 22px;
    }
  }
`;

export default SplitMenu;
