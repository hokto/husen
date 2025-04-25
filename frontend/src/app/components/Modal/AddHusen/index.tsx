import { forwardRef, useState } from "react";

type PopUpHusenProps = {
  handleClick?: (content: string) => void;
};
const ModalHusen = forwardRef<HTMLDivElement, PopUpHusenProps>(
  ({ handleClick }: PopUpHusenProps, ref) => {
    const [content, setContent] = useState("");
    return (
      <div ref={ref}>
        <div
          className="fixed top-0 left-0 bg-black/10 backdrop-blur-sm w-full h-full z-10"
          onClick={(e) => {
            e.stopPropagation();
            handleClick?.(content);
          }}
        ></div>
        <div className="bg-white top-1/3 left-1/3 transform -transform-x-1/2 -transform-y-1/2 w-120 h-60 p-5 flex flex-col items-start absolute z-20">
          <h1 className="text-xl font-bold mb-5">付箋内容</h1>
          <textarea
            className="mb-5 h-full w-full"
            placeholder="メモ"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex mt-auto w-full">
            <button
              className="bg-slate-900 hover:bg-slate-700 text-white px-8 py-2 mx-auto"
              onClick={(e) => {
                e.stopPropagation();
                handleClick?.(content);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
);
ModalHusen.displayName = "ModalHusen"; // forwardRef使用するために設定
export default ModalHusen;
