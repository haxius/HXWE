import React from "react";
import TaskRunner from "../../system/tasks/Runner";
import Wallpaper from "./Wallpaper";
import Window from "./Window";

const CoreTasks: React.FC = () => (
  <TaskRunner
    initialTasks={[
      { component: <Wallpaper />, name: "Wallpaper" },
      {
        component: (
          <Window coords={{ width: 320, height: 240, top: 100, left: 100 }} />
        ),
        name: "Window",
      },
      // { component: <Window />, name: "Window2" },
    ]}
  />
);

export default CoreTasks;
