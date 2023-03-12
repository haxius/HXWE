import React from "react";

export interface ITaskProps {
  name?: string;
  requestTaskEnd?: () => void;
  requestTaskStart?: (task: ITask) => void;
}

export interface ITask {
  component: React.ReactElement;
  name: string;
}
