import React from "react";

export interface ITaskProps {
  children?: React.ReactElement;
  name?: string;
  requestTaskEnd?: () => void;
  requestTaskStart?: (task: ITask) => void;
}

export type TTaskPropsWith<T = {}> = ITaskProps & T;

export interface ITask {
  component: React.ReactElement;
  name: string;
}
