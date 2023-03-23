import React from "react";
import TaskRunner from "../../system/tasks/Runner";
import Wallpaper from "./Wallpaper";

const CoreTasks: React.FC = () => (
  <TaskRunner
    initialTasks={[{ component: <Wallpaper />, name: "Wallpaper" }]}
  />
);

export default CoreTasks;
