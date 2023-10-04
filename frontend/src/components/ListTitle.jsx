import styled from "styled-components"
import {IconButton, InputBase} from "@mui/material"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import { useState } from "react"

const ListTitle = ({ name }) => {
    const [open, setOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(name);
  
    return (
      <>
        {open ? (
          <StyledListTitleWrapper>
            <InputBase
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
            <IconButton onClick={() => setOpen(false)}>
              <MoreHorizIcon />
            </IconButton>
          </StyledListTitleWrapper>
        ) : (
          <StyledListTitleWrapper onClick={() => setOpen(true)}>
            <StyledListTitle>{newTitle}</StyledListTitle>
            <IconButton>
              <MoreHorizIcon />
            </IconButton>
          </StyledListTitleWrapper>
        )}
      </>
    );
  };

const StyledListTitle = styled.h1`
  && {
    font-size: 1.5rem;
    margin: 0;
  }
`;
const StyledListTitleWrapper = styled.div`
  && {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export default ListTitle