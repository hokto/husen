"use client";
import deleteStickNotes from "@/api/Delete";
import getStickNotes from "@/api/Get";
import postStickNotes from "@/api/Post";
import putStickNotes from "@/api/Put";
import Husen from "@/components/Husen/Normal";
import ModalHusen from "@/components/Modal/AddHusen";
import { HUSEN_BLUE_COLOR } from "@/const";
import { GetResponse, PostRequest, PutRequest } from "@/types/API";
import { DraggableHusenProps } from "@/types/DraggableHusen";
import { createRef, RefObject, useEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
export const Home = () => {
  const [draggableHusenList, setDraggableHusenList] = useState<
    DraggableHusenProps[]
  >([]);
  const [isModal, setIsModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [id, setId] = useState(1); // idをこちらで用意して対応
  const fetchStagedHusen = async () => {
    const promise = getStickNotes();
    await promise.then((response) => {
      response.data.list.forEach((value: GetResponse) => {
        // 即時反映させる
        setDraggableHusenList((prevDraggableHusenList) => {
          return [
            ...prevDraggableHusenList,
            {
              bgColor: HUSEN_BLUE_COLOR,
              content: value.content,
              ref: createRef<HTMLDivElement>() as RefObject<HTMLDivElement>,
              id: value.id.toString(),
              positionX: value.positionX,
              positionY: value.positionY,
            },
          ];
        });
      });
    });
  };
  const handleTrashHusen = (clickedId: string) => {
    const promise = deleteStickNotes(clickedId);
    promise.then(() => {
      const newDraggableHusenList = draggableHusenList.filter(({ id }) => {
        return id != clickedId;
      });
      setDraggableHusenList(newDraggableHusenList);
    });
  };
  const handleHusenMouseOn = () => {
    setIsDragging(true);
  };
  const handleHusenMouseOff = (
    clickedId: string,
    content: string,
    dragEvent: DraggableEvent,
    dragElement: DraggableData
  ) => {
    const target = dragEvent.target;
    if (!(target instanceof Node)) return;
    // 付箋を捨てる場合
    if (trashRef.current?.contains(target)) {
      handleTrashHusen(clickedId);
      return;
    }
    // 捨てないで移動する場合
    const request: PutRequest = {
      content: content,
      positionX: dragElement.x,
      positionY: dragElement.y,
    };
    console.log(request);
    const promise = putStickNotes(clickedId, request);
    // 正常に終わった場合，リスト内も変更する
    promise
      .then(() => {
        const newDraggableHusenList = draggableHusenList.map(
          (draggableHusen: DraggableHusenProps) => {
            // ドラッグしたものの座標情報を変更する
            if (draggableHusen.id == clickedId) {
              const newDraggableHusen: DraggableHusenProps = {
                bgColor: draggableHusen.bgColor,
                content: draggableHusen.content,
                ref: draggableHusen.ref,
                id: draggableHusen.id,
                positionX: dragElement.x,
                positionY: dragElement.y,
              };
              return newDraggableHusen;
            } else {
              return draggableHusen;
            }
          }
        );
        setDraggableHusenList(newDraggableHusenList);
      })
      .catch((error) => {
        console.log(error);
      });
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
          id: id.toString(), // 一旦手動で調整
          positionX: 0,
          positionY: 0,
        },
      ]);
      const request: PostRequest = {
        content: content,
        positionX: 0,
        positionY: 0,
      };
      const promise = postStickNotes(request);
      promise.then((response) => {
        console.log(response);
        setId(id + 1); // postが成功すると1増やす
      });
    }
    setIsModal(false);
  };
  const husenAlignAreaRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (isDragging) return; // 付箋を移動してるとき，付箋を捨てるときは反応させない
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
  }, [isDragging]);
  useEffect(() => {
    setDraggableHusenList([]); // 初期化処理
    fetchStagedHusen();
  }, []);
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
          draggableHusenList.map(
            ({ bgColor, content, ref, id, positionX, positionY }) => (
              <Draggable
                nodeRef={ref}
                key={id}
                onStart={handleHusenMouseOn}
                onStop={(dragEvent, dragElement) => {
                  setTimeout(() => {
                    handleHusenMouseOff(id, content, dragEvent, dragElement);
                  }, 100);
                }}
                defaultPosition={{ x: positionX, y: positionY }}
              >
                <div ref={ref} className="block w-fit h-fit">
                  <Husen bgColor={bgColor} content={content} />
                </div>
              </Draggable>
            )
          )}
      </div>
      <div
        className="fixed bottom-4 right-4 flex flex-col items-center space-y-1"
        ref={trashRef}
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
