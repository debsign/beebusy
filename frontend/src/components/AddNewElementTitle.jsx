import {Button, IconButton, InputBase, Paper} from "@mui/material"
import { useState } from "react"
import styled from "styled-components"
import ClearIcon from "@mui/icons-material/Clear"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"

const AddNewElementTitle = ({type, setOpen}) => {
    const [title, setTitle] = useState("")
    return (
        <StyledNewElementTitleWrapper>
            <Paper style={{width: '100%'}}>
                <StyledInputBase 
                    multiline
                    value={title} 
                    onBlur={() => setOpen(false)}
                    onChange={e=>setTitle(e.target.value)}
                    placeholder = {
                        type === "card" ? "Introduce un título para la tarea" : "Introduce un título para la lista"
                    }
                ></StyledInputBase>
            </Paper>
            <AddNewElementTitleWrapper>
                <div>
                    <StyledButton>{type === "card" ? "Añadir tarea" : "Añadir lista"}</StyledButton>
                    <IconButton onClick={()=>setOpen(false)}>
                        <ClearIcon/>
                    </IconButton>
                </div>
                <IconButton>
                    <MoreHorizIcon/>
                </IconButton>
            </AddNewElementTitleWrapper>
        </StyledNewElementTitleWrapper>
    )
}

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

export default AddNewElementTitle