import { Collapse, Fade, Paper } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import AddNewElementTitle from "./AddNewElementTitle";

const AddNewElement = ({ type, projectId, listId, onAdd }) => {
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
        />
      </Collapse>
      <Collapse in={!open}>
        <StyledPaper onClick={() => setOpen(true)}>
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
