import { Collapse, Paper } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import AddNewElementTitle from "./AddNewElementTitle";

const AddNewElement = ({ type, projectId, listId, onAdd, onAddTask }) => {
  const [open, setOpen] = useState(false);
  return (
    <StyledNewElementWrapper>
      <Collapse in={open}>
        <AddNewElementTitle
          type={type}
          setOpen={setOpen}
          projectId={projectId}
          listId={listId}
          onAdd={onAdd}
          // Pasamos la función de callback
          onAddTask={onAddTask}
        />
      </Collapse>
      <Collapse in={!open}>
        <StyledPaper onClick={() => setOpen(true)} style={{ color: "black" }}>
          {type === "card"
            ? "+ Añade una nueva tarea"
            : "+ Añade una nueva lista"}
        </StyledPaper>
      </Collapse>
    </StyledNewElementWrapper>
  );
};
const StyledNewElementWrapper = styled.div`
  && {
    width: 100%;
  }
`;
const StyledPaper = styled(Paper)`
  && {
    background-color: var(--yellowjslighter);
    margin: 0;
    padding: 10px;
  }
  p {
    margin: 0;
  }
`;

export default AddNewElement;
