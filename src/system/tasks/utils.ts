import React from "react";
import { ITask, ITaskProps } from "./models";

export const taskIsRunning = (
  tasks: ITask[] | undefined,
  task: ITask | string
) =>
  (tasks ?? [])
    .map(({ name }) => name)
    .includes("string" === typeof task ? task : task.name);

export const setTasksComponentProps = (
  task: ITask,
  props: ITaskProps
): ITask => ({
  name: task.name,
  component: React.cloneElement(
    task.component as React.ReactElement<ITaskProps>,
    { name: task.name, ...props }
  ),
});

export const endTaskMaybe = (
  setTasks: (
    value: React.SetStateAction<Map<string, ITask> | undefined>
  ) => void,
  taskName: string
) =>
  setTasks((tasks) => {
    if (tasks?.get(taskName)) {
      const newTasks = new Map(tasks);
      newTasks.delete(taskName);
      return newTasks;
    }

    return tasks;
  });
