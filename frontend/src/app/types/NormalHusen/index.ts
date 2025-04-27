import { MouseEventHandler } from "react";

export type NormalHusenProps = {
  width?: number;
  height?: number;
  bgColor: string;
  textColor?: string;
  textSize?: number;
  content?: string;
  handleClick?: MouseEventHandler;
};
