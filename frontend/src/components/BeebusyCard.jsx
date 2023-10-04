import {Paper} from "@mui/material"
import styled from "styled-components"

const BeebusyCard = ({ content }) => {
    return (
        <>
            <StyledPaper>
                <p>{content}</p>
            </StyledPaper>
        </>
    )
}

const StyledPaper = styled(Paper)`
  && {
    background-color: var(--yellowjslighter);
    margin-block: 1rem;
    padding: 10px;
  }
  p {
    margin: 0;
  }
`;

export default BeebusyCard