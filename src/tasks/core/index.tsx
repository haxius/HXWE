import React from "react";
import TaskRunner from "../../system/tasks/Runner";
import Wallpaper from "./Wallpaper";
import Window from "./Window";

const CoreTasks: React.FC = () => (
  <TaskRunner
    initialTasks={[
      { component: <Wallpaper />, name: "Wallpaper" },
      { component: <Window />, name: "Window" },
    ]}
  />
);

export default CoreTasks;
