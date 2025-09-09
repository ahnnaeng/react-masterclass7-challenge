import { Droppable } from "react-beautiful-dnd";
import DragabbleCard from "./DragabbleCard";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faRemove } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  display: flex;
  justify-content: space-between;
  text-align: center;
  font-weight: 600;
  margin: 0 21px 10px;
  font-size: 18px;
`;

const Area = styled.div<IAreaPros>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 87%;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  padding: 0 20px;
  input {
    width: 100%;
    border-radius: 5px;
    border: 1px solid rgb(230, 227, 227);
    padding: 0 10px;
  }
`;

const BoardButton = styled(FontAwesomeIcon)`
  cursor: pointer;
  //opacity: 0;
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.3rem;
  &:hover ${BoardButton} {
    opacity: 0.5;
    transition: opacity 0.5s ease-in-out;
  }
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

interface IAreaPros {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };

    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue("toDo", "");
  };

  const onEdit = () => {
    const newBoardId = window
      .prompt(`${boardId} 할 일의 새 이름을 입력해주세요.`, boardId)
      ?.trim();

    console.log(newBoardId);

    if (newBoardId !== null && newBoardId !== undefined) {
      if (newBoardId === "") {
        alert("보드이름을 입력해주세요");
        return;
      }

      setToDos((allBoards) => {
        const updated = Object.fromEntries(
          Object.entries(allBoards).map(([key, value]) =>
            key === boardId ? [newBoardId, value] : [key, value]
          )
        );
        return updated;
      });
    }
  };

  const onRemove = () => {
    setToDos((allBoards) => {
      const copyBoards = { ...allBoards };
      delete copyBoards[boardId]; // 해당 보드 삭제
      return copyBoards;
    });
  };

  return (
    <Wrapper>
      <Title>
        {boardId}
        <Buttons>
          <BoardButton icon={faEdit} onClick={onEdit} />
          <BoardButton icon={faRemove} onClick={onRemove} />
        </Buttons>
      </Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DragabbleCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
                boardId={boardId}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
