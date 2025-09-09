import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faRemove } from "@fortawesome/free-solid-svg-icons";
import { useSetRecoilState } from "recoil";
import { toDoState } from "../atoms";

const Card = styled.div<{ isDragging: boolean }>`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0 2px 5px rgba(0,0,0,0.05)" : "none"};
  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

interface IDragabbleCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

const ToDoButton = styled(FontAwesomeIcon)`
  cursor: pointer;
  opacity: 0;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  &:hover ${ToDoButton} {
    opacity: 0.5;
    transition: opacity 0.5s ease-in-out;
  }
`;

function DragabbleCard({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDragabbleCardProps) {
  //console.log(toDoId, toDoText, index, " has been redered.");
  const setToDos = useSetRecoilState(toDoState);

  const onEdit = () => {
    const newToDoText = window
      .prompt(`${toDoText} 할 일의 새 이름을 입력해주세요.`, toDoText)
      ?.trim();

    console.log(newToDoText);

    if (newToDoText !== null && newToDoText !== undefined) {
      if (newToDoText === "") {
        alert("이름을 입력해주세요");
        return;
      }

      setToDos((allBoards) => {
        const copyToDos = [...allBoards[boardId]];
        copyToDos.splice(index, 1);
        const newToDo = {
          id: Date.now(),
          text: newToDoText,
        };

        copyToDos.splice(index, 0, newToDo);

        return {
          ...allBoards,
          [boardId]: copyToDos,
        };
      });
    }
  };

  const onRemove = () => {
    setToDos((allBoards) => {
      const copyToDos = [...allBoards[boardId]];
      copyToDos.splice(index, 1);

      return {
        ...allBoards,
        [boardId]: copyToDos,
      };
    });
  };
  return (
    <Draggable key={toDoId} draggableId={toDoId + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          <p>{toDoText}</p>
          <Buttons>
            <ToDoButton icon={faEdit} onClick={onEdit} />
            <ToDoButton icon={faRemove} onClick={onRemove} />
          </Buttons>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DragabbleCard);
