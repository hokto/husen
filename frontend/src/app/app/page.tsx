"use client";
import Husen from "@/components/Husen/Normal";
import ModalHusen from "@/components/Modal/AddHusen";
import { HUSEN_BLUE_COLOR } from "@/const";
import { DraggableHusenProps } from "@/types/DraggableHusen";
import { createRef, RefObject, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
export const Home = () => {
  const [draggableHusenList, setDraggableHusenList] = useState<
    DraggableHusenProps[]
  >([]);
  const [isModal, setIsModal] = useState(false);
  const [isTrashing, setIsTrashing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const handleClickTrash = () => {
    setIsTrashing(!isTrashing);
  };
  const handleHusenMouseOn = (clickedId?: number) => {
    if (isTrashing) {
      const newDraggableHusenList = draggableHusenList.filter(({ id }) => {
        return id != clickedId;
      });
      setDraggableHusenList(newDraggableHusenList);
      return; // isDraggingをtrueにしない
    }
    setIsDragging(true);
  };
  const handleHusenMouseOff = () => {
    setIsDragging(false);
  };
  const handleClickCloseModal = (content: string) => {
    // 内容がある場合のみ付箋を追加
    if (content) {
      setDraggableHusenList([
        ...draggableHusenList,
        {
          bgColor: HUSEN_BLUE_COLOR,
          content: content,
          ref: createRef<HTMLDivElement>() as RefObject<HTMLDivElement>,
          id: Date.now(),
        },
      ]);
    }
    setIsModal(false);
  };
  const husenAlignAreaRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (isDragging || isTrashing) return; // 付箋を移動してるとき，付箋を捨てるときは反応させない
      const target = event.target;
      if (!(target instanceof Node)) return;
      const excludeRefs = [husenAlignAreaRef, modalRef];
      if (
        !excludeRefs.some((ref) => ref.current && ref.current.contains(target))
      ) {
        setIsModal(true);
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isTrashing, isDragging]);
  return (
    <div className="w-full h-full bg-gray-200 flex">
      {isModal && (
        <ModalHusen handleClick={handleClickCloseModal} ref={modalRef} />
      )}
      <div
        className="w-1/4 h-150 bg-white border-solid box-border border-black border-2 mx-1 my-2 p-5"
        ref={husenAlignAreaRef}
      >
        <Husen bgColor={HUSEN_BLUE_COLOR} content={"青の付箋"} />
      </div>
      <div className="w-full h-full">
        {draggableHusenList &&
          draggableHusenList.map(({ bgColor, content, ref, id }) => (
            <Draggable
              nodeRef={ref}
              key={id}
              onStart={() => {
                handleHusenMouseOn(id);
              }}
              onStop={() => {
                setTimeout(handleHusenMouseOff, 100);
              }}
            >
              <div
                ref={ref}
                className="block w-fit h-fit"
                style={{
                  border: `${isTrashing ? "5px dashed #f50000" : "none"}`,
                  padding: `${isTrashing ? "10px" : "none"}`,
                }}
              >
                <Husen bgColor={bgColor} content={content} />
              </div>
            </Draggable>
          ))}
      </div>
      <div
        className="fixed bottom-4 right-4 flex flex-col items-center space-y-1"
        onClick={() => {
          // true->falseの場合はモーダルが反応しないようにディレイを入れる
          if (isTrashing) {
            setTimeout(handleClickTrash, 100);
          } else {
            handleClickTrash();
          }
        }}
      >
        {/* ゴミ箱のフタ */}
        <div className="w-16 h-2 bg-gray-800 rounded-t-md" />
        {/* 本体 */}
        <div className="w-16 h-20 bg-gray-600 rounded-b-md border-t-4 border-gray-800 shadow-md" />
      </div>
    </div>
  );
};
export default Home;
