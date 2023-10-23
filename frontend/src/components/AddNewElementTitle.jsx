import { Button, IconButton, InputBase, Paper } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import ClearIcon from "@mui/icons-material/Clear";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const AddNewElementTitle = ({
  type,
  setOpen,
  projectId,
  listId,
  onAdd,
  onAddTask,
}) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");
  const body =
    type === "card" ? { name, projectId, listId } : { name, projectId };

  const handleAdd = async () => {
    if (!name) return;
    setLoading(true);
    setError(null);
    // Dependiendo del elemento que sea, pasamos una url u otra
    const url =
      type === "card" ? `${BASE_URL}/api/tasks/` : `${BASE_URL}/api/lists/`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          if (typeof onAddTask === "function") {
            // Verificamos si onAddTask es una función
            onAddTask(data); // Pasamos la tarea recién creada a onAddTask
          }
        } else {
          throw new Error("Failed to add new task");
        }

        setName("");
        setOpen(false);
        if (type === "list") {
          onAdd(data); // Llama a onAdd con la nueva lista creada
          window.location.reload();
        }
      } else {
        throw new Error("Failed to add new element");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <StyledNewElementTitleWrapper>
      <Paper style={{ width: "100%" }}>
        <StyledInputBase
          multiline
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={
            type === "card"
              ? "Introduce un título para la tarea"
              : "Introduce un título para la lista"
          }
          disabled={loading}
        ></StyledInputBase>
      </Paper>
      <AddNewElementTitleWrapper>
        <div>
          <StyledButton onClick={handleAdd} disabled={loading}>
            {type === "card" ? "Añadir tarea" : "Añadir lista"}
          </StyledButton>
          <IconButton onClick={() => !loading && setOpen(false)}>
            <ClearIcon />
          </IconButton>
        </div>
        <IconButton>
          <MoreHorizIcon />
        </IconButton>
      </AddNewElementTitleWrapper>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </StyledNewElementTitleWrapper>
  );
};

const StyledNewElementTitleWrapper = styled.div`
  && {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
`;
const StyledInputBase = styled(InputBase)`
  && {
    padding: 0.5rem;
    width: 100%;
  }
`;
const StyledButton = styled(Button)`
  && {
    background-color: var(--blackjs);
    color: white;
    &:hover {
      background-color: var(--blackjsdarker);
    }
  }
`;
const AddNewElementTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  width: 100%;
`;
export default AddNewElementTitle;
