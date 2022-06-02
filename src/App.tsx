import { Routes, Route, Navigate } from "react-router-dom";
import { KBarProvider } from "kbar";

import { TasksProvider } from "./context/tasks";

import SplitMenu from "./components/SplitMenu";
import TaskList from "./components/TaskList";
import TaskBar from "./components/TaskBar";

function App() {
  return (
    <>
      <SplitMenu />
      <Routes>
        <Route path="/" element={<Navigate replace to="/important" />} />
        <Route path=":split" element={<TaskList />} />
      </Routes>
    </>
  );
}

function Container() {
  return (
    <KBarProvider>
      <TasksProvider>
        <App />
        <TaskBar />
      </TasksProvider>
    </KBarProvider>
  );
}

export default Container;
