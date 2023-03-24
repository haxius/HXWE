import React from "react";

export interface ITaskProps {
  name?: string;
  requestTaskEnd?: () => void;
  requestTaskStart?: (task: ITask) => void;
}

export type TTaskPropsWith<T = {}> = ITaskProps & T;

export interface ITask {
  component: React.ReactElement;
  name: string;
}
