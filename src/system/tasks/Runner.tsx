import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ITask } from "./models";
import { endTaskMaybe, setTasksComponentProps } from "./utils";

export interface ITaskRunner {
  initialTasks: ITask[];
}

const TaskRunner: React.FC<ITaskRunner> = ({ initialTasks }) => {
  const [processedInitialTasks, setProcessedInitialTasks] =
    useState<boolean>(false);
  const [tasks, setTasks] = useState<Map<string, ITask>>();
  const [siblingTasks, setSiblingTasks] = useState<Map<string, ITask>>();

  const requestInitialTaskEnd = useCallback(
    (taskName: string) => endTaskMaybe(setTasks, taskName),
    []
  );

  const requestSiblingTaskEnd = useCallback(
    (taskName: string) => endTaskMaybe(setSiblingTasks, taskName),
    []
  );

  const requestSiblingTaskStart = useCallback(
    (task: ITask): void =>
      setSiblingTasks((prevSiblingTasks) => {
        const newSiblingTasks = new Map(prevSiblingTasks);

        if (!newSiblingTasks.get(task.name)) {
          newSiblingTasks.set(
            task.name,
            setTasksComponentProps(task, {
              requestTaskStart: requestSiblingTaskStart,
              requestTaskEnd: () => requestSiblingTaskEnd(task.name),
            })
          );
        }

        return newSiblingTasks;
      }),
    [requestSiblingTaskEnd]
  );

  useEffect(() => {
    if (initialTasks?.length && !tasks && !processedInitialTasks) {
      const newTasks = new Map<string, ITask>();

      initialTasks.forEach((task) =>
        newTasks.set(
          task.name,
          setTasksComponentProps(task, {
            requestTaskStart: requestSiblingTaskStart,
            requestTaskEnd: () => requestInitialTaskEnd(task.name),
          })
        )
      );

      setTasks(newTasks);
      setProcessedInitialTasks(true);
    }
  }, [
    initialTasks,
    processedInitialTasks,
    requestInitialTaskEnd,
    requestSiblingTaskStart,
    tasks,
  ]);

  const renderedTasks = useMemo(() => {
    if (!tasks) {
      return null;
    }

    return Array.from(tasks).map(([name, { component }]) => (
      <React.Fragment key={name}>{component}</React.Fragment>
    ));
  }, [tasks]);

  const renderedSiblingTasks = useMemo(() => {
    if (!siblingTasks) {
      return null;
    }

    return Array.from(siblingTasks).map(([name, { component }]) => (
      <React.Fragment key={name}>{component}</React.Fragment>
    ));
  }, [siblingTasks]);

  return (
    <>
      {renderedTasks}
      {renderedSiblingTasks}
    </>
  );
};

export default TaskRunner;
