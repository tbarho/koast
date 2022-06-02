import React from 'react';
import {
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useMatches,
} from "kbar";
import ResultItem from './ResultItem';

const searchStyle = {
  padding: "1.5rem",
  fontSize: "20px",
  width: "100%",
  boxSizing: "border-box" as React.CSSProperties["boxSizing"],
  outline: "none",
  border: "none",
  background: "#1a1a1a",
  color: "#fff",
  fontFamily: 'monospace',
};

const animatorStyle = {
  maxWidth: "600px",
  width: "100%",
  background: "#1a1a1a",
  color: "rgba(255, 255, 255, 0.5)",
  borderRadius: "4px",
  overflow: "hidden",
  boxShadow: "0 15px 25px 0 rgb(0 0 0 / 10%), 0 19px 45px 0 rgb(0 0 0 / 30%)",
};

const groupNameStyle = {
  padding: "8px 16px",
  fontSize: "10px",
  textTransform: "uppercase" as const,
  opacity: 0.5,
};

function RenderResults() {
  const { results, rootActionId }:any = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId}
          />
        )
      }
    />
  );
}

function CommandBar() {
  return (
    <KBarPortal>
      <KBarPositioner>
        <KBarAnimator style={animatorStyle}>
          <KBarSearch style={searchStyle} />
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}

export default CommandBar;