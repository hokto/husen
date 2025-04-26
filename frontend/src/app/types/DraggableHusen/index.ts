import { RefObject } from "react";

export type DraggableHusenProps = {
  bgColor: string;
  content: string;
  ref: RefObject<HTMLDivElement>;
  id: string;
  positionX: number;
  positionY: number;
};
