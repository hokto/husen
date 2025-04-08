import { HUSEN_TEXT_COLOR, NORMAL_HUSEN_HEIGHT, NORMAL_HUSEN_TEXT_SIZE, NORMAL_HUSEN_WIDTH } from "@/const";
import { NormalHusenProps } from "@/types/NormalHusen";
const classNamesListToStr = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

const Husen = (husenProps : NormalHusenProps) => {
    const {width,height,bgColor,textColor,textSize,content} = husenProps;
    const fontSize = textSize ? `${textSize}px` : NORMAL_HUSEN_TEXT_SIZE;
    return (
    <div
      className={classNamesListToStr(
        "relative",
        "flex",
        "pt-[.5em]",
        "pr-[1.3em]",
        "pb-[.5em]",
        "pl-[.1em]"
      )}
      style={{
        width: `${width || NORMAL_HUSEN_WIDTH}px`,
        height:`${height || NORMAL_HUSEN_HEIGHT}px`,
        backgroundColor: bgColor,
        color: textColor || HUSEN_TEXT_COLOR,
        fontSize
      }}
    >
      <div
        className={classNamesListToStr(
          "absolute",
          "-bottom-[1px]",
          "right-[9px]",
          "z-[-1]",
          "rotate-[5deg]",
          "w-[70%]",
          "h-[50%]",
          "blur-[4px]"
        )}
        style={{ backgroundColor: "#d0d0d0" }}
      />
      {content}
    </div>
  );
};

export default Husen;
