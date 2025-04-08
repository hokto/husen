"use client";
import Husen from "@/components/Husen/Normal";
import { HUSEN_BLUE_COLOR, HUSEN_GREEN_COLOR ,HUSEN_RED_COLOR} from "@/const";
import { RefObject, useRef } from "react";
import Draggable from "react-draggable";

export const Home=()=> {
  const blueRef: RefObject<HTMLDivElement>  = useRef<HTMLDivElement>(null!);
  const greenRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null!);
  const redRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null!);
  return (

    <div>
    <Draggable nodeRef={blueRef}>
        <div ref={blueRef} className="block w-fit h-fit">
            <Husen bgColor={HUSEN_BLUE_COLOR} content={"青の付箋"} />
        </div>
    </Draggable>
    <Draggable nodeRef={greenRef}>
      <div ref={greenRef} className="block w-fit h-fit">
          <Husen bgColor={HUSEN_GREEN_COLOR} content={"緑の付箋"} />
      </div>
    </Draggable>
    <Draggable nodeRef={redRef}>
      <div ref={redRef} className="block w-fit h-fit">

          <Husen bgColor={HUSEN_RED_COLOR} content={"赤の付箋"} />
      </div>
    </Draggable>

    </div>
  );
}
export default Home;